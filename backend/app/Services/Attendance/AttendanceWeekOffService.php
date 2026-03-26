<?php

namespace App\Services\Attendance;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\ScheduleEmployee;
use DateTime;

class AttendanceWeekOffService
{
    /**
     * Resolve weekoff configuration from shift.
     * Priority: weekoff_rules JSON > legacy string fields.
     */
    public static function resolveConfig($shift): array
    {
        $shift = (object) $shift;
        $weekoffRules = $shift->weekoff_rules ?? null;

        if ($weekoffRules && is_array($weekoffRules) && isset($weekoffRules['type'])) {
            return self::parseJsonRules($weekoffRules);
        }

        return self::parseLegacyFields($shift);
    }

    private static function parseJsonRules(array $rules): array
    {
        $type = $rules['type'] ?? 'Fixed';

        if ($type === 'Fixed') {
            $days = $rules['days'] ?? [];
            $dayNames = array_map([self::class, 'dayKeyToFullName'], $days);

            return [
                'weekend1' => [
                    'type' => isset($dayNames[0]) ? 'Fixed' : 'Not Applicable',
                    'day'  => $dayNames[0] ?? null,
                ],
                'weekend2' => [
                    'type' => isset($dayNames[1]) ? 'Fixed' : 'Not Applicable',
                    'day'  => $dayNames[1] ?? null,
                ],
                'monthly_flexi' => 0,
            ];
        }

        if ($type === 'Flexible') {
            $cycle = $rules['cycle'] ?? 'Weekly';
            $count = (int) ($rules['count'] ?? 0);

            if ($cycle === 'Monthly') {
                return [
                    'weekend1' => ['type' => 'Not Applicable', 'day' => null],
                    'weekend2' => ['type' => 'Not Applicable', 'day' => null],
                    'monthly_flexi' => $count,
                ];
            }

            return [
                'weekend1' => ['type' => $count >= 1 ? 'Flexi' : 'Not Applicable', 'day' => null],
                'weekend2' => ['type' => $count >= 2 ? 'Flexi' : 'Not Applicable', 'day' => null],
                'monthly_flexi' => 0,
            ];
        }

        if ($type === 'Alternating') {
            return [
                'weekend1' => ['type' => 'Alternating', 'day' => null, 'odd' => $rules['odd'] ?? [], 'even' => $rules['even'] ?? []],
                'weekend2' => ['type' => 'Not Applicable', 'day' => null],
                'monthly_flexi' => 0,
            ];
        }

        return [
            'weekend1' => ['type' => 'Not Applicable', 'day' => null],
            'weekend2' => ['type' => 'Not Applicable', 'day' => null],
            'monthly_flexi' => 0,
        ];
    }

    private static function parseLegacyFields(object $shift): array
    {
        $weekend1 = $shift->weekend1 ?? 'Not Applicable';
        $weekend2 = $shift->weekend2 ?? 'Not Applicable';
        $monthlyFlexi = $shift->monthly_flexi_holidays ?? 'Not Applicable';

        return [
            'weekend1' => [
                'type' => ($weekend1 === 'Flexi') ? 'Flexi' : (($weekend1 !== 'Not Applicable' && $weekend1 !== '') ? 'Fixed' : 'Not Applicable'),
                'day'  => ($weekend1 !== 'Flexi' && $weekend1 !== 'Not Applicable' && $weekend1 !== '') ? $weekend1 : null,
            ],
            'weekend2' => [
                'type' => ($weekend2 === 'Flexi') ? 'Flexi' : (($weekend2 !== 'Not Applicable' && $weekend2 !== '') ? 'Fixed' : 'Not Applicable'),
                'day'  => ($weekend2 !== 'Flexi' && $weekend2 !== 'Not Applicable' && $weekend2 !== '') ? $weekend2 : null,
            ],
            'monthly_flexi' => ($monthlyFlexi !== 'Not Applicable' && $monthlyFlexi !== '' && $monthlyFlexi !== null) ? (int) $monthlyFlexi : 0,
        ];
    }

    public static function dayKeyToFullName(string $key): ?string
    {
        $map = [
            'M'  => 'Monday',
            'T'  => 'Tuesday',
            'W'  => 'Wednesday',
            'Th' => 'Thursday',
            'F'  => 'Friday',
            'S'  => 'Saturday',
            'Su' => 'Sunday',
        ];
        return $map[$key] ?? null;
    }

    public static function fullNameToDayKey(string $name): ?string
    {
        $map = [
            'Monday'    => 'M',
            'Tuesday'   => 'T',
            'Wednesday' => 'W',
            'Thursday'  => 'Th',
            'Friday'    => 'F',
            'Saturday'  => 'S',
            'Sunday'    => 'Su',
        ];
        return $map[$name] ?? null;
    }
}
