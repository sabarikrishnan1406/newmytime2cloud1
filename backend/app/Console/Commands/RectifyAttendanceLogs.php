<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Device;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RectifyAttendanceLogs extends Command
{
    /**
     * The name and signature of the console command.
     * Usage: php artisan attendance:rectify {date?}
     */
    protected $signature = 'attendance:rectify {date? : The date to start fixing from (YYYY-MM-DD)}';

    /**
     * The console command description.
     */
    protected $description = 'Syncs attendance log_types with device function settings (Auto, In, Out)';

    public function handle()
    {
        // 1. Determine Start Date (Default to today)
        $dateArgument = $this->argument('date');
        $startDate = $dateArgument ? Carbon::parse($dateArgument)->toDateString() : Carbon::today()->toDateString();

        $this->warn("!!! Rectifying logs from: {$startDate} onwards !!!");

        // 2. Fetch Device Mapping (id -> function)
        // Exclude mobile to focus on hardware devices
        $deviceFunctionMap = Device::excludeMobile()
            ->get(['device_id', 'function'])
            ->pluck('function', 'device_id')
            ->toArray();

        $correctedCount = 0;
        $processedCount = 0;

        // 3. Query logs in the specified range
        $query = DB::table('attendance_logs')
            ->whereNotIn("log_type", ['in', 'out']) // Only check logs that are not already 'Auto'
            ->whereDate('log_date', '>=', $startDate);

        $totalFound = $query->count();
        $this->info("Found {$totalFound} logs to verify.");

        if ($totalFound === 0) {
            $this->info("Nothing to process.");
            return;
        }

        // 4. Process in chunks for memory efficiency
        $query->orderBy('id')->chunk(500, function ($logs) use ($deviceFunctionMap, &$correctedCount, &$processedCount) {
            foreach ($logs as $log) {
                $deviceId = trim($log->DeviceID);

                // Get the function from the device table
                $deviceFunction = $deviceFunctionMap[$deviceId] ?? '';

                /**
                 * LOGIC MAPPING 
                 * Matches your FUNCTIONS constant: 
                 * { id: 'auto', name: 'Auto' }, { id: 'In', name: 'In' }, { id: 'Out', name: 'Out' }
                 */
                if ($deviceFunction === 'auto') {
                    $expectedType = 'Auto';
                } elseif ($deviceFunction === 'In') {
                    $expectedType = 'In';
                } elseif ($deviceFunction === 'Out') {
                    $expectedType = 'Out';
                } else {
                    // Fallback: If 'in' is in DeviceID string, use 'In'. 
                    // Otherwise, default to 'Auto' (NOT 'Out')
                    $expectedType = (str_contains(strtolower($deviceId), 'in')) ? 'In' : 'Auto';
                }

                // 5. Check for mismatch and update
                // Using trim on current log_type to catch hidden spaces
                if (trim($log->log_type) !== $expectedType) {
                    DB::table('attendance_logs')
                        ->where('id', $log->id)
                        ->update(['log_type' => $expectedType]);

                    $correctedCount++;
                }

                $processedCount++;
            }
            // Show progress in console
            $this->output->write(".");
        });

        $this->newline();
        $this->table(
            ['Total Processed', 'Total Corrected', 'Start Date'],
            [[$processedCount, $correctedCount, $startDate]]
        );

        $this->info("Successfully rectified attendance logs.");
    }
}
