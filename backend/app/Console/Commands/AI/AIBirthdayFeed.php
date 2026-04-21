<?php

namespace App\Console\Commands\AI;

use App\Http\Controllers\Controller;
use App\Models\AIFeeds;
use App\Models\Company;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AIBirthdayFeed extends Command
{
    protected $signature = 'ai:birthday-feed';

    protected $description = 'Insert ai_feeds rows for employees whose birthday is today';

    public function handle()
    {
        $logger = new Controller;
        $logFilePath = 'logs/ai/birthday_feed';
        $logger->logOutPut($logFilePath, "***** Cron started: ai:birthday-feed *****");

        $today = Carbon::now()->format('m-d');
        $todayDate = Carbon::now()->toDateString();
        $insertedCount = 0;
        $skippedCount = 0;

        $companyIds = Company::pluck('id');

        foreach ($companyIds as $companyId) {
            // DOB can live on employees.date_of_birth (new form) OR emirates_info.date_of_birth (legacy).
            // Match either.
            $employees = Employee::where('company_id', $companyId)
                ->with(['emirate', 'department', 'branch', 'designation'])
                ->where(function ($q) use ($today) {
                    // employees.date_of_birth is varchar 'YYYY-MM-DD' — string-match the MM-DD suffix
                    // to avoid casting (some rows have empty/invalid values that would crash TO_CHAR).
                    $q->whereRaw("SUBSTRING(date_of_birth FROM 6 FOR 5) = ?", [$today])
                      ->orWhereHas('emirate', function ($eq) use ($today) {
                          // emirates_infos.date_of_birth is already a date type → safe to use TO_CHAR.
                          $eq->whereRaw("TO_CHAR(date_of_birth, 'MM-DD') = ?", [$today]);
                      });
                })
                ->get();

            foreach ($employees as $employee) {
                $alreadyExists = AIFeeds::where('company_id', $companyId)
                    ->where('employee_id', $employee->id)
                    ->where('type', 'birthday')
                    ->whereDate('created_at', $todayDate)
                    ->exists();

                if ($alreadyExists) {
                    $skippedCount++;
                    continue;
                }

                $fullName = trim(($employee->first_name ?? '') . ' ' . ($employee->last_name ?? ''));
                $dob = $employee->date_of_birth ?? ($employee->emirate->date_of_birth ?? null);
                $age = $dob ? Carbon::parse($dob)->age : null;

                try {
                    AIFeeds::create([
                        'company_id' => $companyId,
                        'employee_id' => $employee->id,
                        'type' => 'birthday',
                        'description' => "🎉 Today is {$fullName}'s Birthday! Wishing a year full of joy, success, and milestones.",
                        'data' => [
                            'employee_id' => $employee->id,
                            'employee_code' => $employee->employee_id ?? null,
                            'first_name' => $employee->first_name,
                            'last_name' => $employee->last_name,
                            'full_name' => $fullName,
                            'profile_picture' => $employee->profile_picture ?? null,
                            'department' => $employee->department->name ?? null,
                            'branch' => $employee->branch->branch_name ?? null,
                            'designation' => $employee->designation->name ?? null,
                            'age' => $age,
                        ],
                    ]);
                    $insertedCount++;
                    $logger->logOutPut($logFilePath, "Inserted birthday feed for {$fullName} (id={$employee->id})");
                } catch (\Throwable $e) {
                    $logger->logOutPut($logFilePath, "FAILED for employee id={$employee->id}: " . $e->getMessage());
                    $this->error("Failed for employee {$employee->id}: " . $e->getMessage());
                }
            }
        }

        $summary = "Birthday feed complete: {$insertedCount} inserted, {$skippedCount} skipped (already existed).";
        $this->info($summary);
        $logger->logOutPut($logFilePath, $summary);
        $logger->logOutPut($logFilePath, "***** Cron ended: ai:birthday-feed *****");

        return 0;
    }
}
