<?php
namespace App\Console\Commands;

use App\Jobs\GenerateAttendanceSummaryReport;
use App\Models\Company;
use App\Models\Shift;
use Illuminate\Console\Command;

class GeneralDailyReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'task:generate_daily_report {id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Daily Report';

    protected $company_id;

    public function handle()
    {
        $this->company_id = $this->argument("id") ?? 0;

        $companyIds = Company::when($this->company_id > 0, fn($q) => $q->where("id", $this->company_id))
            ->whereHas('report_notifications', function ($query) {
                $query->where('type', 'attendance');
            })
            ->with(['report_notifications' => function ($query) {
                $query->where('type', 'attendance');
                $query->select('id', 'company_id', "branch_id");
                $query->with('branch:id,branch_name');
            }])
            ->whereHas('shifts')
            ->with('contact:id,company_id,number')
            ->get(["logo", "name", "company_code", "location", "p_o_box_no", "id", "user_id"]);

        foreach ($companyIds as $key => $company) {
            $this->processByCompanyIds($company);
        }

    }

    public function processByCompanyIds($companyPayload)
    {
        $company_id           = $companyPayload->id;
        $report_notifications = $companyPayload->report_notifications;
        $shift_types          = Shift::getShiftTypesByCompany($company_id);

        $from_date = date("Y-m-d", strtotime("-1 day"));
        $to_date   = date("Y-m-d", strtotime("-1 day"));

        $heading = "Summary";

        $companyPayload = Company::whereId($company_id)
            ->with('contact:id,company_id,number')
            ->first(["logo", "name", "company_code", "location", "p_o_box_no", "id", "user_id"]);

        $company = [
            "logo_raw"    => env("BASE_URL") . '/' . $companyPayload->logo_raw,
            "name"        => $companyPayload->name,
            "email"       => $companyPayload->user->email ?? 'mail not found',
            "location"    => $companyPayload->location,
            "contact"     => $companyPayload->contact->number ?? 'contact not found',
            "report_type" => $heading,
            "from_date"   => $from_date,
            "to_date"     => $to_date,
        ];

        foreach ($shift_types as $shift_type) {

            foreach ($report_notifications as $report_notification) {

                $branchName = $report_notification?->branch?->branch_name ?? 'N/A';
                $branchId   = $report_notification?->branch_id ?? 'N/A';
                $name       = $company['name'] ?? 'Unknown';

                $this->info("Process Type for Company $name with Id = $company_id on Branch $branchName with Branch id = $branchId and with $shift_type");


                $this->info(env("APP_ENV"));


                GenerateAttendanceSummaryReport::dispatch($shift_type, $company_id, $branchId, $company);

                // $this->info(showJson($company));
            }
        }
    }
}
