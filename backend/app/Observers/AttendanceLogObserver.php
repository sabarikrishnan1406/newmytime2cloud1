<?php

namespace App\Observers;

use App\Models\Attendance;
use App\Models\AttendanceLog;
use App\Models\Employee;
use App\Models\ScheduleEmployee;
use Illuminate\Support\Facades\Log;

class AttendanceLogObserver
{
    /**
     * Handle the AttendanceLog "created" event.
     *
     * When any new log is inserted (from device, mobile, camera, manual),
     * mark the first log of the day as IN and the last log as OUT.
     */
    public function created(AttendanceLog $log): void
    {
        $userID = $log->UserID;
        $companyId = $log->company_id;
        $logDate = $log->LogTime ? date('Y-m-d', strtotime($log->LogTime)) : date('Y-m-d');

        if (!$userID || !$companyId) {
            return;
        }

        // Get all logs for this employee today, ordered by time
        $todayLogs = AttendanceLog::where('UserID', $userID)
            ->where('company_id', $companyId)
            ->where('LogTime', '>=', $logDate)
            ->where('LogTime', '<', date('Y-m-d', strtotime($logDate . ' +2 days')))
            ->orderBy('LogTime', 'asc')
            ->get();

        if ($todayLogs->isEmpty()) {
            return;
        }

        // Get employee's shift info
        $employee = Employee::where('system_user_id', $userID)
            ->where('company_id', $companyId)
            ->first();

        $offDutyTime = null;
        if ($employee) {
            $schedule = ScheduleEmployee::where('employee_id', $employee->system_user_id)
                ->whereHas('shift')
                ->latest('updated_at')
                ->first();

            if ($schedule && $schedule->shift) {
                $offDutyTime = $schedule->shift->off_duty_time;
            }
        }

        // Reset all log_type for this employee today
        AttendanceLog::where('UserID', $userID)
            ->where('company_id', $companyId)
            ->where('LogTime', '>=', $logDate)
            ->where('LogTime', '<', date('Y-m-d', strtotime($logDate . ' +2 days')))
            ->update(['log_type' => null]);

        // First log = IN
        $firstLog = $todayLogs->first();
        $firstLog->update(['log_type' => 'In']);

        // Last log after shift end = OUT (if different from first)
        if ($todayLogs->count() > 1 && $offDutyTime) {
            $shiftEndDt = $logDate . ' ' . $offDutyTime;

            // Find last log after shift end time
            $outLog = $todayLogs->filter(function ($l) use ($shiftEndDt) {
                return $l->LogTime >= $shiftEndDt;
            })->last();

            if ($outLog && $outLog->id !== $firstLog->id) {
                $outLog->update(['log_type' => 'Out']);
            }
        } elseif ($todayLogs->count() > 1 && !$offDutyTime) {
            // No shift defined — last log = OUT
            $lastLog = $todayLogs->last();
            if ($lastLog->id !== $firstLog->id) {
                $lastLog->update(['log_type' => 'Out']);
            }
        }

        Log::info("AttendanceLogObserver: Updated IN/OUT for UserID={$userID}, date={$logDate}, total_logs={$todayLogs->count()}");
    }
}
