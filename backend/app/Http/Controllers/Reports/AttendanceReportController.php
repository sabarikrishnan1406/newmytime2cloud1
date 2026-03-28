<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Company;
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
        set_time_limit(120);
        ini_set('memory_limit', '512M');

        $companyId = $request->company_id;
        $date = $request->date ?? date('Y-m-d');

        $company = Company::select('id', 'name')->find($companyId);

        $query = Attendance::select([
                'id', 'employee_id', 'company_id', 'date', 'shift_id',
                'in', 'out', 'total_hrs', 'ot', 'late_coming', 'early_going', 'status'
            ])
            ->where('company_id', $companyId)
            ->whereDate('date', $date)
            ->with([
                'employee:system_user_id,first_name,last_name,employee_id,department_id,branch_id',
                'employee.department:id,name',
                'employee.branch:id,branch_name',
                'shift:id,name',
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

        $records = $query->orderBy('employee_id')->get();

        $stats = [
            'total' => $records->count(),
            'present' => $records->whereIn('status', ['P', 'LC', 'EG'])->count(),
            'absent' => $records->where('status', 'A')->count(),
            'late' => $records->where('status', 'LC')->count(),
            'early_out' => $records->where('status', 'EG')->count(),
            'leave' => $records->where('status', 'L')->count(),
            'holiday' => $records->where('status', 'H')->count(),
            'week_off' => $records->where('status', 'O')->count(),
            'missing' => $records->where('status', 'M')->count(),
        ];

        $filters = $this->buildFilterLabels($request, $date);

        $pdf = Pdf::loadView('pdf.reports.daily-attendance', compact(
            'company', 'records', 'stats', 'date', 'filters'
        ));

        $pdf->setPaper('a4', 'landscape');
        $pdf->setOption('isPhpEnabled', true);
        $pdf->setOption('isRemoteEnabled', false);

        $filename = 'Daily_Attendance_' . $date . '.pdf';

        if ($request->input('action') === 'download') {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
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

        $company = Company::select('id', 'name')->find($companyId);

        $query = Attendance::select([
                'id', 'employee_id', 'company_id', 'date', 'shift_id', 'shift_type_id',
                'in', 'out', 'total_hrs', 'ot', 'late_coming', 'early_going',
                'status', 'device_id_in', 'device_id_out', 'is_manual_entry'
            ])
            ->where('company_id', $companyId)
            ->whereBetween('date', [$fromDate, $toDate])
            ->with([
                'employee:system_user_id,first_name,last_name,employee_id,department_id,branch_id,profile_picture',
                'employee.department:id,name',
                'employee.branch:id,branch_name',
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

        $employees = $allRecords->groupBy('employee_id')->map(function ($records) {
            $employee = $records->first()->employee;
            $days = [];

            $shiftTypeMap = [1 => 'FILO', 2 => 'Multi', 3 => 'Auto', 4 => 'Night', 5 => 'Split', 6 => 'Single'];

            foreach ($records as $record) {
                $rawDate = $record->getRawOriginal('date');
                $days[] = [
                    'date' => Carbon::parse($rawDate)->format('d M y'),
                    'day' => Carbon::parse($rawDate)->format('l'),
                    'shift' => $record->shift->name ?? '---',
                    'shift_type' => $shiftTypeMap[$record->shift_type_id] ?? '---',
                    'in' => $record->in ?? '---',
                    'out' => $record->out ?? '---',
                    'late_coming' => ($record->late_coming && $record->late_coming !== '---') ? $record->late_coming : '---',
                    'early_going' => ($record->early_going && $record->early_going !== '---') ? $record->early_going : '---',
                    'total_hrs' => $record->total_hrs ?? '---',
                    'ot' => ($record->ot && $record->ot !== '00:00') ? $record->ot : '---',
                    'status' => $record->status ?? '---',
                    'device_in' => $record->device_in->name ?? '',
                    'device_out' => $record->device_out->name ?? '',
                    'is_manual' => $record->is_manual_entry ? true : false,
                ];
            }

            $statuses = $records->pluck('status');
            $stats = [
                'present' => $statuses->filter(fn($s) => in_array($s, ['P', 'LC', 'EG']))->count(),
                'absent' => $statuses->filter(fn($s) => $s === 'A')->count(),
                'late' => $statuses->filter(fn($s) => $s === 'LC')->count(),
                'leave' => $statuses->filter(fn($s) => $s === 'L')->count(),
                'holiday' => $statuses->filter(fn($s) => $s === 'H')->count(),
                'week_off' => $statuses->filter(fn($s) => $s === 'O')->count(),
                'missing' => $statuses->filter(fn($s) => $s === 'M')->count(),
                'manual' => $records->filter(fn($r) => $r->is_manual_entry)->count(),
                'total_hours' => $records->sum(fn($r) => $this->timeToMinutes($r->total_hrs)),
                'total_ot' => $records->sum(fn($r) => $this->timeToMinutes($r->ot)),
            ];

            return [
                'employee' => $employee,
                'days' => $days,
                'stats' => $stats,
            ];
        });

        $filters = $this->buildFilterLabels($request, null, $fromDate, $toDate);

        $pdf = Pdf::loadView('pdf.reports.monthly-detail', compact(
            'company', 'employees', 'fromDate', 'toDate', 'filters'
        ));

        $pdf->setPaper('a4', 'landscape');
        $pdf->setOption('isPhpEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);

        $filename = 'Monthly_Attendance_Detail_' . $fromDate . '_to_' . $toDate . '.pdf';

        if ($request->input('action') === 'download') {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
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
                'employee:system_user_id,first_name,last_name,employee_id,department_id',
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
