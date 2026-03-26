<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SyncAttendanceStatuses extends Command
{
    /**
     * Usage: 
     * php artisan attendance:sync {date?} {company_id?}
     */
    protected $signature = 'attendance:sync {date?} {company_id?}';
    protected $description = 'Syncs attendance records with O(1) holiday lookup and optional company filtering.';

    public function handle()
    {
        $dateArgument = $this->argument('date');
        $companyArgument = $this->argument('company_id');

        $date = $dateArgument ? Carbon::parse($dateArgument) : Carbon::yesterday();
        $dateString = $date->toDateString();

        $this->info("--- Initializing Sync: $dateString ---");

        // 1. Delete Previous Records for this date
        $deleteQuery = Attendance::whereDate('date', $dateString);

        if ($companyArgument) {
            $deleteQuery->where('company_id', $companyArgument);
            $this->warn("Clearing existing records for Company ID: $companyArgument on $dateString");
        } else {
            $this->warn("Clearing ALL existing records for $dateString");
        }

        $deletedCount = $deleteQuery->delete();
        $this->info("Deleted $deletedCount existing records.");

        // 2. Fetch Holidays (O(1) lookup preparation)
        $holidayQuery = DB::table('holidays')
            ->whereDate('start_date', '<=', $dateString)
            ->whereDate('end_date', '>=', $dateString);

        if ($companyArgument) {
            $holidayQuery->where('company_id', $companyArgument);
        }

        $holidayCompanyIds = $holidayQuery->pluck('company_id')->flip()->toArray();

        // 3. Process All Employees (Since we deleted previous logs, we don't need whereNotIn)
        $employeeQuery = Employee::query();

        if ($companyArgument) {
            $employeeQuery->where('company_id', $companyArgument);

            $employeeQuery->with(['schedule' => function ($q) use ($companyArgument) {
                $q->where('company_id', $companyArgument);
            }]);
        }

        $totalEmployees = $employeeQuery->count();
        $this->info("Processing $totalEmployees employees.");

        $employeeQuery->chunkById(500, function ($employees) use ($dateString, $holidayCompanyIds) {
            $batch = [];
            $counts = ['H' => 0, 'A' => 0];

            foreach ($employees as $employee) {
                $status = isset($holidayCompanyIds[$employee->company_id]) ? "H" : "A";
                $counts[$status]++;

                $payload = [
                    'employee_id'   => $employee->employee_id,
                    'company_id'    => $employee->company_id,
                    'branch_id'     => $employee->branch_id,
                    'date'          => $dateString,
                    'status'        => $status,
                    'roster_id'     => 0,
                    'total_hrs'     => '---',
                    'in'            => '---',
                    'out'           => '---',
                    'ot'            => '---',
                    'device_id_in'  => '---',
                    'device_id_out' => '---',
                    'shift_id'      => $employee->schedule->shift->id,
                    'shift_type_id'      => $employee->schedule->shift->shift_type_id,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];

                if ($employee->employee_id == 1068) {
                    $this->info("Prepared: EmpID {$employee->employee_id} | Status: $status | shift_type_id: {$employee->schedule->shift->shift_type_id}");
                }


                $batch[] = $payload;
            }

            if (!empty($batch)) {
                Attendance::insert($batch);
                $this->line("<fg=cyan>Batch Inserted:</> H: {$counts['H']} | A: {$counts['A']}");
            }
        });

        $this->info("--- Sync Completed Successfully ---");
    }
}
