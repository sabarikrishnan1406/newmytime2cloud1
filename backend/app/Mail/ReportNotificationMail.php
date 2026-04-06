<?php

namespace App\Mail;

use App\Models\Attendance;
use App\Models\Employee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReportNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public $model, public $manager, public $files) {}

    public function build()
    {
        $this->subject($this->model->subject ?: 'MyTime2Cloud - Attendance Report');

        $companyId = $this->model->company_id;
        $branchId = $this->model->branch_id;
        $date = date("Y-m-d", strtotime("-1 day"));
        $dateDisplay = date("D, F j, Y", strtotime("-1 day"));

        // Try to attach pre-generated PDFs first
        $hasAttachment = false;
        foreach ($this->files as $file) {
            $fullPath = storage_path("app/public/pdf/$date/{$companyId}/summary_report_{$branchId}_$file.pdf");
            if (file_exists($fullPath)) {
                $this->attach($fullPath);
                $hasAttachment = true;
            }
        }

        // If no pre-generated PDF, generate one on-the-fly
        if (!$hasAttachment) {
            try {
                $employees = Employee::where('company_id', $companyId)
                    ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
                    ->with('branch:id,branch_name', 'department:id,name')
                    ->get(['id', 'first_name', 'last_name', 'employee_id', 'system_user_id', 'branch_id', 'department_id']);

                $branchName = $employees->first()?->branch?->branch_name ?? 'All Branches';

                $html = $this->generateReportHtml($employees, $companyId, $branchName, $dateDisplay);

                $pdf = Pdf::loadHTML($html)->setPaper('a4', 'landscape');
                $pdfPath = storage_path("app/attendance_report_{$companyId}_{$date}.pdf");
                $pdf->save($pdfPath);

                $this->attach($pdfPath, [
                    'as' => "Attendance_Report_{$date}.pdf",
                    'mime' => 'application/pdf',
                ]);
            } catch (\Exception $e) {
                \Log::warning("Failed to generate PDF for report notification: " . $e->getMessage());
            }
        }

        $managerName = optional($this->manager)->name ?? 'Manager';
        $companyName = optional($this->model->company)->name ?? 'N/A';

        $bodyContent = "Hi {$managerName},<br/><br/>";
        $bodyContent .= "<b>Company: {$companyName}</b><br/>";
        $bodyContent .= "Date: {$dateDisplay}<br/><br/>";
        $bodyContent .= "Please find the attached Attendance Report.<br/><br/>";
        $bodyContent .= "Regards,<br/>MyTime2Cloud";

        return $this->view('emails.report')->with([
            'body' => $bodyContent
        ]);
    }

    private function generateReportHtml($employees, $companyId, $branchName, $dateDisplay)
    {
        $html = '<!DOCTYPE html><html><head><style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;color:#333}
        .header{background:#1a5276;color:#fff;padding:25px 30px;text-align:center}
        .header h1{font-size:20px;font-weight:800;margin-bottom:4px}
        .header p{font-size:11px;opacity:0.85}
        .content{padding:20px 30px}
        table{width:100%;border-collapse:collapse;font-size:10px;margin-top:15px}
        th{background:#1a5276;color:#fff;padding:8px 6px;text-align:left;font-size:9px;text-transform:uppercase}
        td{padding:7px 6px;border-bottom:1px solid #eee}
        tr:nth-child(even){background:#f8f9fa}
        .status-p{color:#27ae60;font-weight:700}.status-a{color:#e74c3c;font-weight:700}.status-o{color:#f39c12;font-weight:700}
        .footer{text-align:center;padding:15px;font-size:9px;color:#999;border-top:1px solid #eee;margin-top:20px}
        </style></head><body>';

        $html .= '<div class="header"><h1>MyTime2Cloud - Attendance Report</h1>';
        $html .= '<p>Branch: ' . $branchName . ' | ' . $dateDisplay . '</p></div>';
        $html .= '<div class="content">';

        $present = 0;
        $absent = 0;
        $rows = '';

        foreach ($employees as $emp) {
            $att = Attendance::where('employee_id', $emp->system_user_id)
                ->where('company_id', $companyId)
                ->orderBy('id', 'desc')->first();

            $status = $att->status ?? 'A';
            $in = $att->in ?? '---';
            $out = $att->out ?? '---';
            $totalHrs = $att->total_hrs ?? '---';
            $late = $att->late_coming ?? '---';

            if (in_array($status, ['P', 'LC', 'EG'])) $present++;
            else $absent++;

            $statusClass = in_array($status, ['P', 'LC', 'EG']) ? 'status-p' : ($status == 'A' ? 'status-a' : 'status-o');

            $rows .= '<tr>';
            $rows .= '<td>' . $emp->first_name . ' ' . $emp->last_name . '</td>';
            $rows .= '<td>' . $emp->employee_id . '</td>';
            $rows .= '<td>' . ($emp->department->name ?? '---') . '</td>';
            $rows .= '<td>' . $in . '</td>';
            $rows .= '<td>' . $out . '</td>';
            $rows .= '<td>' . $late . '</td>';
            $rows .= '<td>' . $totalHrs . '</td>';
            $rows .= '<td class="' . $statusClass . '">' . $status . '</td>';
            $rows .= '</tr>';
        }

        $total = $employees->count();
        $html .= '<table style="width:100%;margin:15px 0"><tr>';
        $html .= '<td style="background:#f0f3f5;border-radius:6px;padding:10px;text-align:center;width:30%"><b style="font-size:20px;color:#1a5276">' . $total . '</b><br><span style="font-size:9px;color:#666">TOTAL</span></td>';
        $html .= '<td style="width:5%"></td>';
        $html .= '<td style="background:#e8f8f5;border-radius:6px;padding:10px;text-align:center;width:30%"><b style="font-size:20px;color:#27ae60">' . $present . '</b><br><span style="font-size:9px;color:#666">PRESENT</span></td>';
        $html .= '<td style="width:5%"></td>';
        $html .= '<td style="background:#fef2f2;border-radius:6px;padding:10px;text-align:center;width:30%"><b style="font-size:20px;color:#e74c3c">' . $absent . '</b><br><span style="font-size:9px;color:#666">ABSENT</span></td>';
        $html .= '</tr></table>';

        $html .= '<table><thead><tr><th>Employee</th><th>ID</th><th>Dept</th><th>In</th><th>Out</th><th>Late</th><th>Total Hrs</th><th>Status</th></tr></thead>';
        $html .= '<tbody>' . $rows . '</tbody></table>';
        $html .= '<div class="footer">System-generated report from MyTime2Cloud</div>';
        $html .= '</div></body></html>';

        return $html;
    }
}
