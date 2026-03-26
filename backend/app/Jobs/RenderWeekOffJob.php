<?php

namespace App\Jobs;

use App\Models\Attendance;
use App\Models\AttendanceLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RenderWeekOffJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $companyId;
    protected $month;
    protected $employeeId;

    public function __construct($companyId, $month, $employeeId)
    {
        $this->companyId = $companyId;
        $this->month = $month;
        $this->employeeId = $employeeId;
    }

    public function handle()
    {
        $this->setWeekOffs();
    }

    protected function setWeekOffs(): void
    {
        $weekoffLog = Log::channel('weekoff');

        $logContext = [
            'company_id' => $this->companyId,
            'employee_id' => $this->employeeId,
            'month' => $this->month,
            'function' => __FUNCTION__,
        ];

        $weekoffLog->info('===================================================');
        $weekoffLog->info('Starting weekoff assignment process.', $logContext);

        $totalEligiblePresents = Attendance::where('company_id', $this->companyId)
            ->where('employee_id', $this->employeeId)
            ->whereMonth('date', $this->month)
            ->whereNotIn('status', ['A', 'O'])
            ->count();

        echo "Total Eligible Presents for Employee {$this->employeeId} in Company {$this->companyId} for Month {$this->month}: {$totalEligiblePresents}\n";

        if ($totalEligiblePresents === 0) {
            $weekoffLog->warning("WEEKOFF: Employee {$this->employeeId} had no presents in month {$this->month}. Status reset to A.", $logContext);
            Attendance::where('company_id', $this->companyId)
                ->where('employee_id', $this->employeeId)
                ->whereMonth('date', $this->month)
                ->update(['status' => 'A']);
            return;
        }

        $numWeekOffsToAssign = intdiv($totalEligiblePresents, 6);

        $weekoffLog->info("Eligible Presents: {$totalEligiblePresents}. Calculated Weekoffs to assign: {$numWeekOffsToAssign}.", $logContext);

        echo "Eligible Presents: {$totalEligiblePresents}. Calculated Weekoffs to assign: {$numWeekOffsToAssign}.\n";

        $totalResetToAbsentToMakeSureCorrectCount = Attendance::where('company_id', $this->companyId)
            ->where('employee_id', $this->employeeId)
            ->whereMonth('date', $this->month)
            ->whereIn('status', ['A', 'O'])
            ->update(['status' => 'A']);

        $weekoffLog->info("Reset Status to absent for remaining rows : $totalResetToAbsentToMakeSureCorrectCount.");
        echo "Reset Status to absent for remaining rows : $totalResetToAbsentToMakeSureCorrectCount.\n";

        if ($numWeekOffsToAssign === 0) {
            $weekoffLog->info('Not enough eligible presents to assign any weekoff.', $logContext);
            echo "Not enough eligible presents to assign any weekoff.\n";
            return;
        }

        $availableSlots = Attendance::where('company_id', $this->companyId)
            ->where('employee_id', $this->employeeId)
            ->whereMonth('date', $this->month)
            ->whereIn('status', ['A', 'O'])
            ->orderBy('date')
            ->limit($numWeekOffsToAssign)
            ->select('id', 'employee_id', 'date')
            ->get();

        $weekoffLog->info("Fetched {$availableSlots->count()} candidate slots for potential weekoff assignment.", $logContext);
        echo "Fetched {$availableSlots->count()} candidate slots for potential weekoff assignment.\n";

        $idsToSetWeekOff = [];
        $skippedSlots = [];

        foreach ($availableSlots as $candidateRow) {
            $logsExist = AttendanceLog::where('company_id', $this->companyId)
                ->where('UserID', $candidateRow->employee_id)
                ->whereDate('LogTime', $candidateRow->date)
                ->exists();

            if (!$logsExist) {
                $idsToSetWeekOff[] = $candidateRow->id;
                $weekoffLog->info("Candidate ID {$candidateRow->id} (Date: {$candidateRow->date}) is eligible for WeekOff ('O').", $logContext);
                echo "Candidate ID {$candidateRow->id} (Date: {$candidateRow->date}) is eligible for WeekOff ('O').\n";
            } else {
                $skippedSlots[] = $candidateRow->date;
                $weekoffLog->info("Skipping Candidate ID {$candidateRow->id} (Date: {$candidateRow->date}). Logs already exist.", $logContext);
                echo "Skipping Candidate ID {$candidateRow->id} (Date: {$candidateRow->date}). Logs already exist.\n";
            }
        }

        $updatedCount = 0;
        if (!empty($idsToSetWeekOff)) {
            $updatedCount = Attendance::whereIn('id', $idsToSetWeekOff)->update(['status' => 'O']);
            $logMessage = "Successfully assigned {$updatedCount} Weekoffs ('O').";
            $weekoffLog->info($logMessage, array_merge($logContext, ['updated_ids' => $idsToSetWeekOff]));
            echo $logMessage . "\n";
        } else {
            $weekoffLog->info('No eligible slots remained after checking for existing logs. No update performed.', $logContext);
            echo "No eligible slots remained after checking for existing logs. No update performed.\n";
        }

        $finalAttendanceData = Attendance::where('company_id', $this->companyId)
            ->where('employee_id', $this->employeeId)
            ->whereMonth('date', $this->month)
            ->selectRaw("SUM(CASE WHEN status = 'A' THEN 1 ELSE 0 END) as final_absent_count")
            ->selectRaw("SUM(CASE WHEN status = 'O' THEN 1 ELSE 0 END) as final_weekoff_count")
            ->selectRaw("SUM(CASE WHEN status NOT IN ('A', 'O') THEN 1 ELSE 0 END) as final_present_count")
            ->first();

        $summaryLog = [
            'Total_Eligible_Presents' => $totalEligiblePresents,
            'Calculated_Weekoffs' => $numWeekOffsToAssign,
            'Assigned_Weekoffs' => $updatedCount,
            'Skipped_Slots_Count' => count($skippedSlots),
            'Final_Presents' => $finalAttendanceData->final_present_count,
            'Final_Weekoffs' => $finalAttendanceData->final_weekoff_count,
            'Final_Absents' => $finalAttendanceData->final_absent_count,
            'Skipped_Dates' => $skippedSlots,
        ];
        $weekoffLog->info('Weekoff assignment process completed with summary.', array_merge($logContext, $summaryLog));
        echo "Weekoff assignment process completed with summary: " . json_encode($summaryLog) . "\n";
    }
}
