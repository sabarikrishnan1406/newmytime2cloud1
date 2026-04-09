<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GovernmentHolidaysController extends Controller
{
    private $nagerBaseUrl = 'https://date.nager.at/api/v3';

    /**
     * Get government holidays by country and year
     * Fallback chain:
     * 1. Try Nager.Date API
     * 2. For UAE (AE), try Google Calendar API
     * 3. Return empty array
     * 
     * @param Request $request - Expects: country_code (ISO 3166-1 alpha-2), year
     */
    public function index(Request $request)
    {
        $countryCode = $request->get('country_code') ?? $request->get('country');
        $year = $request->get('year') ?? date('Y');

        if (!$countryCode) {
            return response()->json([
                'success' => false,
                'message' => 'country_code parameter is required',
                'data' => [],
            ], 400);
        }

        $countryCode = strtoupper(trim($countryCode));

        // Validate country code format (must be 2 characters)
        if (strlen($countryCode) !== 2) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid country code format. Must be 2-letter ISO code (e.g., AE, IN, GB)',
                'data' => [],
            ], 400);
        }

        // Cache for 30 days to reduce API calls
        $cacheKey = "government_holidays_{$countryCode}_{$year}";
        
        try {
            $result = Cache::remember($cacheKey, now()->addDays(30), function () use ($countryCode, $year) {
                // Try Nager.Date API first
                $holidays = $this->fetchFromNagerDate($countryCode, $year);
                if (!empty($holidays)) {
                    return $holidays;
                }

                // For UAE, try Google Calendar API
                if ($countryCode === 'AE') {
                    $holidays = $this->fetchFromGoogleCalendar($year);
                    if (!empty($holidays)) {
                        return $holidays;
                    }
                }

                // No holidays found
                \Log::warning("No government holidays found for {$countryCode} in {$year}");
                return [
                    'success' => true,
                    'data' => [],
                    'country' => $countryCode,
                    'message' => 'No government holidays data available'
                ];
            });

            return response()->json($result);

        } catch (\Exception $e) {
            \Log::error("Government holidays error: " . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [],
            ], 500);
        }
    }

    /**
     * Fetch holidays from Nager.Date API
     */
    private function fetchFromNagerDate($countryCode, $year)
    {
        try {
            \Log::info("Fetching holidays from Nager.Date for {$countryCode}/{$year}");
            
            $response = Http::withoutVerifying()
                ->timeout(10)
                ->get("{$this->nagerBaseUrl}/PublicHolidays/{$year}/{$countryCode}");

            \Log::info("Nager.Date response: " . $response->status());

            if ($response->status() === 200) {
                $holidays = $response->json();
                
                if (is_array($holidays) && !empty($holidays)) {
                    return [
                        'success' => true,
                        'data' => array_map(function ($holiday) use ($countryCode) {
                            return [
                                'id' => md5($holiday['date'] . $holiday['name']),
                                'name' => $holiday['name'],
                                'start_date' => $holiday['date'],
                                'end_date' => $holiday['date'],
                                'year' => substr($holiday['date'], 0, 4),
                                'total_days' => 1,
                                'country_code' => $countryCode,
                                'type' => 'government',
                                'is_public' => $holiday['types'][0] ?? 'Public',
                            ];
                        }, $holidays),
                        'country' => $countryCode,
                        'source' => 'nager.date'
                    ];
                }
            }
        } catch (\Exception $e) {
            \Log::warning("Nager.Date API failed: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Fetch UAE holidays from Google Calendar ICS feed
     */
    private function fetchFromGoogleCalendar($year)
    {
        try {
            \Log::info("Fetching UAE holidays from Google Calendar for {$year}");
            
            // Google's public ICS URL for UAE Holidays  
            $icsUrl = 'https://calendar.google.com/calendar/ical/en.ae%23holiday%40group.v.calendar.google.com/public/basic.ics';
            
            $response = Http::withoutVerifying()
                ->timeout(10)
                ->get($icsUrl);

            if ($response->successful()) {
                $icsContent = $response->body();
                $holidays = $this->parseICS($icsContent, $year);

                if (!empty($holidays)) {
                    \Log::info("✅ Found " . count($holidays) . " UAE holidays from Google Calendar");
                    return [
                        'success' => true,
                        'data' => $holidays,
                        'country' => 'AE',
                        'source' => 'google.calendar'
                    ];
                }
            }
        } catch (\Exception $e) {
            \Log::warning("Google Calendar fetch failed: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Parse ICS (iCalendar) format to extract holidays
     */
    private function parseICS($icsContent, $year)
    {
        $holidays = [];
        
        try {
            $lines = explode("\n", $icsContent);
            $currentEvent = [];
            $inEvent = false;

            foreach ($lines as $line) {
                $line = trim($line);
                
                if ($line === 'BEGIN:VEVENT') {
                    $inEvent = true;
                    $currentEvent = [];
                } elseif ($line === 'END:VEVENT') {
                    $inEvent = false;
                    
                    if (!empty($currentEvent)) {
                        // Find DTSTART regardless of the key format (VALUE=DATE etc.)
                        $dtstart = null;
                        foreach ($currentEvent as $key => $value) {
                            if (strpos($key, 'DTSTART') === 0) {
                                $dtstart = $value;
                                break;
                            }
                        }
                        
                        if ($dtstart && preg_match('/(\d{8})/', $dtstart, $matches)) {
                            $dateStr = $matches[1];
                            $eventYear = substr($dateStr, 0, 4);
                            
                            // Only include events for the requested year
                            if ($eventYear == $year) {
                                $date = substr($dateStr, 0, 4) . "-" . substr($dateStr, 4, 2) . "-" . substr($dateStr, 6, 2);
                                $summary = $currentEvent['SUMMARY'] ?? 'Holiday';
                                
                                $holidays[] = [
                                    'id' => md5($date . $summary),
                                    'name' => $summary,
                                    'start_date' => $date,
                                    'end_date' => $date,
                                    'year' => $year,
                                    'total_days' => 1,
                                    'country_code' => 'AE',
                                    'type' => 'government',
                                    'is_public' => 'Public',
                                ];
                            }
                        }
                    }
                } elseif ($inEvent) {
                    if (strpos($line, ':') !== false) {
                        [$key, $value] = explode(':', $line, 2);
                        $currentEvent[$key] = $value;
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error("ICS parsing error: " . $e->getMessage());
        }

        return $holidays;
    }
}
