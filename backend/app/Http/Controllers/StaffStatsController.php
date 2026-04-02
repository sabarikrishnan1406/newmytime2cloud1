<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Employee;
use App\Models\EmployeeLeaves;
use App\Models\Holidays;
use App\Models\ScheduleEmployee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StaffStatsController extends Controller
{
    /**
     * Calculate staff dashboard stats from raw logs + leaves + holidays.
     * Works without needing the attendances table to be regenerated.
     */
    public function stats(Request $request)
    {
        $user = $request->user() ?? User::find($request->user_id);
        $companyId = $request->company_id ?? $user?->company_id ?? 0;
        $sysUserId = $request->system_user_id;

        if (!$sysUserId && $user?->employee_id) {
            $emp = Employee::find($user->employee_id);
            $sysUserId = $emp?->system_user_id;
        }

        if (!$sysUserId) {
            return response()->json(['error' => 'system_user_id required'], 400);
        }

        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth()->format('Y-m-d');
        $monthEnd = $now->format('Y-m-d');
        $todayDay = $now->day;

        // Get shift info
        $employee = Employee::where('system_user_id', $sysUserId)
            ->where('company_id', $companyId)
            ->first();

        $shift = null;
        if ($employee) {
            $schedule = ScheduleEmployee::where('employee_id', $employee->system_user_id)
                ->whereHas('shift')
                ->latest('updated_at')
                ->first();
            $shift = $schedule?->shift;
        }

        $onDutyTime = $shift?->on_duty_time;
        $offDutyTime = $shift?->off_duty_time;
        $workingHours = $shift?->working_hours;
        $lateGrace = $shift?->late_time ?? '00:15';

        // Get raw logs this month
        $logs = AttendanceLog::where('UserID', $sysUserId)
            ->where('company_id', $companyId)
            ->where('LogTime', '>=', $monthStart)
            ->where('LogTime', '<=', $monthEnd . ' 23:59:59')
            ->orderBy('LogTime')
            ->get();

        // Group by date
        $byDate = [];
        foreach ($logs as $log) {
            $date = Carbon::parse($log->LogTime)->format('Y-m-d');
            $byDate[$date][] = $log;
        }

        $presentDays = count($byDate);
        $absentDays = max(0, $todayDay - $presentDays);
        $lateDays = 0;
        $earlyOutDays = 0;
        $totalOvertimeMins = 0;
        $totalWorkMins = 0;

        foreach ($byDate as $date => $dayLogs) {
            usort($dayLogs, fn($a, $b) => strtotime($a->LogTime) - strtotime($b->LogTime));
            $firstLog = $dayLogs[0];
            $lastLog = end($dayLogs);

            $inTime = Carbon::parse($firstLog->LogTime);
            $outTime = count($dayLogs) > 1 ? Carbon::parse($lastLog->LogTime) : null;

            // Late check
            if ($onDutyTime) {
                $shiftStart = Carbon::parse($date . ' ' . $onDutyTime);
                $graceEnd = $shiftStart->copy()->addMinutes($this->timeToMinutes($lateGrace));
                if ($inTime->gt($graceEnd)) {
                    $lateDays++;
                }
            }

            // Early out check
            if ($outTime && $offDutyTime) {
                $shiftEnd = Carbon::parse($date . ' ' . $offDutyTime);
                if ($offDutyTime < $onDutyTime) {
                    $shiftEnd->addDay(); // night shift
                }
                if ($outTime->lt($shiftEnd)) {
                    $earlyOutDays++;
                }
            }

            // Work duration and overtime
            if ($outTime) {
                $workMins = $inTime->diffInMinutes($outTime);
                $totalWorkMins += $workMins;

                if ($workingHours) {
                    $expectedMins = $this->timeToMinutes($workingHours);
                    if ($workMins > $expectedMins) {
                        $totalOvertimeMins += ($workMins - $expectedMins);
                    }
                }
            }
        }

        // Leaves this month (approved only)
        $leaveDays = 0;
        if ($employee) {
            $leaves = EmployeeLeaves::where('employee_id', $employee->id)
                ->where('company_id', $companyId)
                ->where('status', 1) // approved
                ->where(function ($q) use ($monthStart, $monthEnd) {
                    $q->where('start_date', '<=', $monthEnd)
                      ->where('end_date', '>=', $monthStart);
                })
                ->get();

            foreach ($leaves as $leave) {
                $start = Carbon::parse($leave->start_date)->max(Carbon::parse($monthStart));
                $end = Carbon::parse($leave->end_date)->min(Carbon::parse($monthEnd));
                $leaveDays += $start->diffInDays($end) + 1;
            }
        }

        // Holidays this month
        $holidayDays = Holidays::where('company_id', $companyId)
            ->where(function ($q) use ($monthStart, $monthEnd) {
                $q->where('start_date', '<=', $monthEnd)
                  ->where('end_date', '>=', $monthStart);
            })
            ->get()
            ->sum(function ($h) use ($monthStart, $monthEnd) {
                $start = Carbon::parse($h->start_date)->max(Carbon::parse($monthStart));
                $end = Carbon::parse($h->end_date)->min(Carbon::parse($monthEnd));
                return $start->diffInDays($end) + 1;
            });

        // Week offs (days in month with no shift day)
        $weekOffDays = 0;
        if ($shift && $shift->days) {
            $dayMap = ['Mon' => 1, 'Tue' => 2, 'Wed' => 3, 'Thu' => 4, 'Fri' => 5, 'Sat' => 6, 'Sun' => 0];
            $shiftDayNums = [];
            foreach (($shift->days ?? []) as $d) {
                if (isset($dayMap[$d])) $shiftDayNums[] = $dayMap[$d];
            }
            for ($d = 1; $d <= $todayDay; $d++) {
                $dayOfWeek = Carbon::parse("$monthStart")->addDays($d - 1)->dayOfWeek;
                if (!in_array($dayOfWeek, $shiftDayNums)) {
                    $weekOffDays++;
                }
            }
        }

        // Adjust absent: subtract leave + holiday + weekoff
        $absentDays = max(0, $absentDays - $leaveDays - $holidayDays - $weekOffDays);

        $otHours = floor($totalOvertimeMins / 60);
        $otMins = $totalOvertimeMins % 60;

        return response()->json([
            'present' => $presentDays,
            'absent' => $absentDays,
            'late' => $lateDays,
            'early_out' => $earlyOutDays,
            'leave' => $leaveDays,
            'holiday' => $holidayDays,
            'week_off' => $weekOffDays,
            'overtime' => sprintf('%d:%02d', $otHours, $otMins),
            'total_work_hours' => round($totalWorkMins / 60, 1),
            'incomplete' => 0,
            'total_days' => $todayDay,
            'shift_name' => $shift?->name,
            'on_duty_time' => $onDutyTime,
            'off_duty_time' => $offDutyTime,
        ]);
    }

    private function timeToMinutes($time): int
    {
        if (!$time || $time === '---') return 0;
        $parts = explode(':', $time);
        return (int)($parts[0] ?? 0) * 60 + (int)($parts[1] ?? 0);
    }
}
