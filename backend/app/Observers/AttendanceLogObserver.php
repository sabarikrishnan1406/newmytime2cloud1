<?php

namespace App\Observers;

use App\Models\AttendanceLog;
use Illuminate\Support\Facades\Log;

class AttendanceLogObserver
{
    /**
     * Handle the AttendanceLog "created" event.
     *
     * Camera logs already have log_type set by the logAttendance endpoint.
     * For device/mobile/manual logs, we don't override their existing log_type.
     *
     * This observer only logs the event for debugging.
     */
    public function created(AttendanceLog $log): void
    {
        $source = 'device';
        if ($log->channel === 'camera') {
            $source = 'camera';
        } elseif (str_contains($log->DeviceID ?? '', 'Mobile')) {
            $source = 'mobile';
        } elseif ($log->DeviceID === 'Manual') {
            $source = 'manual';
        }

        Log::info("AttendanceLogObserver: New log UserID={$log->UserID}, type={$log->log_type}, source={$source}");
    }
}
