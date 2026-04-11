<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Company;
use App\Services\Attendance\AttendanceWeekOffService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceReportController extends Controller
{
    /**
     * Daily Attendance Report PDF
     */
    public function dailyPDF(Request $request)
    {
        $request->merge([
            'from_date' => $request->date ?? date('Y-m-d'),
            'to_date' => $request->date ?? date('Y-m-d'),
            'report_mode' => 'daily',
        ]);

        return $this->monthlyDetailPDF($request);
    }

    /**
     * Monthly Attendance Report - Per Employee Detail
     */
    public function monthlyDetailPDF(Request $request)
    {
        set_time_limit(300);
        ini_set('memory_limit', '1024M');

        $companyId = $request->company_id;
        $fromDate = $request->from_date ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $toDate = $request->to_date ?? Carbon::now()->endOfMonth()->format('Y-m-d');

        $company = Company::select('id', 'name', 'logo')->find($companyId);

        $shiftTypeId = $request->shift_type_id;
        $isMultiShift = in_array($shiftTypeId, [2, '2']);
        $isSplitShift = in_array($shiftTypeId, [5, '5']);

        $selectColumns = [
            'id', 'employee_id', 'company_id', 'date', 'shift_id', 'shift_type_id',
            'in', 'out', 'total_hrs', 'ot', 'late_coming', 'early_going',
            'status', 'device_id_in', 'device_id_out', 'is_manual_entry'
        ];

        if ($isMultiShift || $isSplitShift) {
            $selectColumns[] = 'logs';
        }

        $query = Attendance::select($selectColumns)
            ->where('company_id', $companyId)
            ->whereBetween('date', [$fromDate, $toDate])
            ->with([
                'employee' => function ($q) use ($companyId) {
                    $q->where('company_id', $companyId)
                      ->select('system_user_id', 'first_name', 'last_name', 'employee_id', 'department_id', 'branch_id', 'profile_picture', 'company_id')
                      ->withOut('schedule');
                },
                'employee.department:id,name',
                'employee.branch:id,branch_name',
                'employee.schedule' => function ($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                    $q->withOut('shift_type');
                },
                'employee.schedule.shift',
                'shift:id,name',
                'shift_type:id,name',
                'device_in:device_id,name',
                'device_out:device_id,name',
            ]);

        if ($request->filled('branch_ids')) {
            $branchIds = is_array($request->branch_ids) ? $request->branch_ids : explode(',', $request->branch_ids);
            $query->whereHas('employee', fn($q) => $q->whereIn('branch_id', $branchIds));
        }

        if ($request->filled('department_ids')) {
            $deptIds = is_array($request->department_ids) ? $request->department_ids : explode(',', $request->department_ids);
            $query->whereHas('employee', fn($q) => $q->whereIn('department_id', $deptIds));
        }

        if ($request->filled('employee_ids')) {
            $empIds = is_array($request->employee_ids) ? $request->employee_ids : explode(',', $request->employee_ids);
            $query->whereIn('employee_id', $empIds);
        }

        $allRecords = $query->orderBy('employee_id')->orderBy('date')->get();

        // Recalculate weekoff statuses (converts some "A" to "O" in-memory)
        AttendanceWeekOffService::recalculateForReport($allRecords, (int) $companyId);

        $employees = $allRecords->groupBy('employee_id')->map(function ($records) use ($isMultiShift, $isSplitShift) {
            $employee = $records->first()->employee;

            $shiftTypeMap = [1 => 'FILO', 2 => 'Multi', 3 => 'Auto', 4 => 'Night', 5 => 'Split', 6 => 'Single'];

            $days = [];
            foreach ($records as $record) {
                $rawDate = $record->getRawOriginal('date');
                // Detect missing: has IN but no OUT (or vice versa) — single shift only
                $inTime = $record->in ?? '---';
                $outTime = $record->out ?? '---';
                $status = $record->status ?? '---';

                if (!$isMultiShift && !$isSplitShift) {
                    $hasIn = $inTime !== '---' && $inTime !== '' && $inTime !== null;
                    $hasOut = $outTime !== '---' && $outTime !== '' && $outTime !== null;

                    if (($hasIn !== $hasOut) && in_array($status, ['P', 'A', 'LC', 'EG', '---'])) {
                        $status = 'M';
                        $record->status = 'M';
                    }
                }

                $dayData = [
                    'date' => Carbon::parse($rawDate)->format('d M y'),
                    'day' => Carbon::parse($rawDate)->format('l'),
                    'shift' => $record->shift->name ?? '---',
                    'shift_type' => $shiftTypeMap[$record->shift_type_id] ?? '---',
                    'in' => $inTime,
                    'out' => $outTime,
                    'late_coming' => ($record->late_coming && $record->late_coming !== '---') ? $record->late_coming : '---',
                    'early_going' => ($record->early_going && $record->early_going !== '---') ? $record->early_going : '---',
                    'total_hrs' => $record->total_hrs ?? '---',
                    'ot' => ($record->ot && $record->ot !== '00:00') ? $record->ot : '---',
                    'status' => $status,
                    'device_in' => $record->device_in->name ?? '',
                    'device_out' => $record->device_out->name ?? '',
                    'is_manual' => $record->is_manual_entry
                        || str_contains(strtolower($record->device_id_in ?? ''), 'manual')
                        || str_contains(strtolower($record->device_id_out ?? ''), 'manual'),
                ];

                if ($isMultiShift || $isSplitShift) {
                    $logs = $record->logs ?? [];
                    // Check missing: any session with IN but no OUT (or vice versa)
                    $hasMissingPair = false;
                    foreach ($logs as $log) {
                        $logIn = $log['in'] ?? '---';
                        $logOut = $log['out'] ?? '---';
                        $logHasIn = $logIn !== '---' && $logIn !== '';
                        $logHasOut = $logOut !== '---' && $logOut !== '';
                        if ($logHasIn !== $logHasOut) {
                            $hasMissingPair = true;
                            break;
                        }
                    }
                    if ($hasMissingPair && in_array($dayData['status'], ['P', 'A', 'LC', 'EG', '---'])) {
                        $dayData['status'] = 'M';
                        $record->status = 'M';
                    }
                    $dayData['logs'] = $logs;
                }

                $days[] = $dayData;
            }

            // Recalculate stats after weekoff recalculation
            $statuses = $records->pluck('status');
            $stats = [
                'present' => $statuses->filter(fn($s) => in_array($s, ['P', 'LC', 'EG']))->count(),
                'absent' => $statuses->filter(fn($s) => $s === 'A')->count(),
                'late' => $statuses->filter(fn($s) => $s === 'LC')->count(),
                'leave' => $statuses->filter(fn($s) => $s === 'L')->count(),
                'holiday' => $statuses->filter(fn($s) => $s === 'H')->count(),
                'week_off' => $statuses->filter(fn($s) => $s === 'O')->count(),
                'missing' => $statuses->filter(fn($s) => $s === 'M')->count(),
                'manual' => $records->filter(fn($r) =>
                    $r->is_manual_entry
                    || str_contains(strtolower($r->device_id_in ?? ''), 'manual')
                    || str_contains(strtolower($r->device_id_out ?? ''), 'manual')
                )->count(),
                'total_hours' => $records->sum(fn($r) => $this->timeToMinutes($r->total_hrs)),
                'total_ot' => $records->sum(fn($r) => $this->timeToMinutes($r->ot)),
                'total_late' => $records->sum(fn($r) => $this->timeToMinutes($r->late_coming)),
            ];

            return [
                'employee' => $employee,
                'days' => $days,
                'stats' => $stats,
            ];
        });

        $filters = $this->buildFilterLabels($request, null, $fromDate, $toDate);

        $reportMode = $request->input('report_mode', 'monthly');

        $pdf = Pdf::loadView('pdf.reports.monthly-detail', compact(
            'company', 'employees', 'fromDate', 'toDate', 'filters', 'isMultiShift', 'isSplitShift', 'reportMode'
        ));

        $pdf->setPaper('a4', 'landscape');
        $pdf->setOption('isPhpEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);

        // Render first, then add footer to every page
        $pdf->render();
        $canvas = $pdf->getDomPDF()->getCanvas();
        $fontMetrics = $pdf->getDomPDF()->getFontMetrics();
        $font = $fontMetrics->getFont('Helvetica', 'normal');
        $w = $canvas->get_width();
        $h = $canvas->get_height();
        $y = $h - 25;
        $grey = [0.12, 0.15, 0.20];
        $generatedOn = 'GENERATED ON:  ' . Carbon::now()->format('d M Y, H:i');

        $canvas->page_text(28, $y, $generatedOn, $font, 6, $grey);
        $canvas->page_text($w / 2 - 80, $y, 'CONFIDENTIAL REPORT  .  MYTIME2CLOUD.COM', $font, 6, $grey);
        $canvas->page_text($w - 110, $y, 'PAGE {PAGE_NUM} OF {PAGE_COUNT}', $font, 6, $grey);

        $filename = 'Monthly_Attendance_Detail_' . $fromDate . '_to_' . $toDate . '.pdf';

        if ($request->input('action') === 'download') {
            return response($pdf->getDomPDF()->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        }

        return response($pdf->getDomPDF()->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }

    /**
     * Monthly Attendance Report - Grid/Matrix View
     */
    public function monthlyGridPDF(Request $request)
    {
        set_time_limit(300);
        ini_set('memory_limit', '1024M');

        $companyId = $request->company_id;
        $fromDate = $request->from_date ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $toDate = $request->to_date ?? Carbon::now()->endOfMonth()->format('Y-m-d');

        $company = Company::select('id', 'name')->find($companyId);

        $query = Attendance::select(['id', 'employee_id', 'company_id', 'date', 'status'])
            ->where('company_id', $companyId)
            ->whereBetween('date', [$fromDate, $toDate])
            ->with([
                'employee' => function ($q) use ($companyId) {
                    $q->where('company_id', $companyId)
                      ->select('system_user_id', 'first_name', 'last_name', 'employee_id', 'department_id', 'company_id');
                },
                'employee.department:id,name',
            ]);

        if ($request->filled('branch_ids')) {
            $branchIds = is_array($request->branch_ids) ? $request->branch_ids : explode(',', $request->branch_ids);
            $query->whereHas('employee', fn($q) => $q->whereIn('branch_id', $branchIds));
        }

        if ($request->filled('department_ids')) {
            $deptIds = is_array($request->department_ids) ? $request->department_ids : explode(',', $request->department_ids);
            $query->whereHas('employee', fn($q) => $q->whereIn('department_id', $deptIds));
        }

        if ($request->filled('employee_ids')) {
            $empIds = is_array($request->employee_ids) ? $request->employee_ids : explode(',', $request->employee_ids);
            $query->whereIn('employee_id', $empIds);
        }

        $allRecords = $query->orderBy('employee_id')->orderBy('date')->get();

        $start = Carbon::parse($fromDate);
        $end = Carbon::parse($toDate);
        $dates = [];
        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $dates[] = $d->format('Y-m-d');
        }

        $grid = $allRecords->groupBy('employee_id')->map(function ($records) use ($dates) {
            $employee = $records->first()->employee;
            $byDate = $records->keyBy(fn($r) => $r->getRawOriginal('date'));

            $row = [];
            $summary = ['P' => 0, 'A' => 0, 'L' => 0, 'H' => 0, 'O' => 0, 'M' => 0, 'LC' => 0, 'EG' => 0];

            foreach ($dates as $date) {
                $record = $byDate->get($date);
                $status = $record ? $record->status : '-';
                $row[$date] = $status;
                if (isset($summary[$status])) $summary[$status]++;
            }

            $summary['present'] = $summary['P'] + $summary['LC'] + $summary['EG'];

            return [
                'employee' => $employee,
                'dates' => $row,
                'summary' => $summary,
            ];
        });

        $filters = $this->buildFilterLabels($request, null, $fromDate, $toDate);

        $pdf = Pdf::loadView('pdf.reports.monthly-grid', compact(
            'company', 'grid', 'dates', 'fromDate', 'toDate', 'filters'
        ));

        $pdf->setPaper('a4', 'landscape');
        $pdf->setOption('isPhpEnabled', true);
        $pdf->setOption('isRemoteEnabled', false);

        $filename = 'Monthly_Attendance_Grid_' . $fromDate . '_to_' . $toDate . '.pdf';

        if ($request->input('action') === 'download') {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
    }

    private function buildFilterLabels(Request $request, $date = null, $fromDate = null, $toDate = null)
    {
        $labels = [];
        if ($date) $labels['Date'] = Carbon::parse($date)->format('d M Y');
        if ($fromDate && $toDate) $labels['Period'] = Carbon::parse($fromDate)->format('d M Y') . ' - ' . Carbon::parse($toDate)->format('d M Y');
        $labels['Generated'] = Carbon::now()->format('d M Y, h:i A');
        return $labels;
    }

    private function timeToMinutes($time)
    {
        if (!$time || $time === '---' || $time === '00:00') return 0;
        $parts = explode(':', $time);
        return (int)($parts[0] ?? 0) * 60 + (int)($parts[1] ?? 0);
    }
}
