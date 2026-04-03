<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Employee;
use App\Models\EmployeeAdvance;
use App\Models\EmployeeLoan;
use App\Models\PayrollAdjustment;
use App\Models\PayrollBatch;
use App\Models\PayrollRecord;
use App\Models\SalaryStructure;
use App\Models\ScheduleEmployee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollManagementController extends Controller
{
    // ── Employee List for Dropdowns ──
    public function employeeList(Request $request)
    {
        return Employee::where('company_id', $request->company_id)
            ->when($request->branch_id, fn($q) => $q->where('branch_id', $request->branch_id))
            ->select('id', 'first_name', 'last_name', 'employee_id', 'department_id', 'branch_id')
            ->with('department:id,name')
            ->with('branch:id,branch_name')
            ->orderBy('first_name')
            ->get();
    }

    // ── Single Employee Salary Structure (for Employee Edit page) ──
    public function employeeSalaryStructure(Request $request, $employeeId)
    {
        $structure = SalaryStructure::where('company_id', $request->company_id)
            ->where('employee_id', $employeeId)
            ->where('status', 'active')
            ->first();

        return response()->json($structure);
    }

    public function upsertEmployeeSalaryStructure(Request $request, $employeeId)
    {
        $data = $request->only([
            'basic_salary', 'house_allowance', 'transport_allowance',
            'food_allowance', 'medical_allowance', 'other_allowance',
            'overtime_eligible', 'loan_deduction', 'advance_deduction',
            'salary_mode', 'effective_from', 'effective_to',
        ]);
        $data['company_id'] = $request->company_id;
        $data['employee_id'] = $employeeId;
        $data['branch_id'] = $request->branch_id ?? Employee::find($employeeId)?->branch_id;
        $data['status'] = 'active';
        $data['gross_salary'] = ($data['basic_salary'] ?? 0) + ($data['house_allowance'] ?? 0) +
            ($data['transport_allowance'] ?? 0) + ($data['food_allowance'] ?? 0) +
            ($data['medical_allowance'] ?? 0) + ($data['other_allowance'] ?? 0);

        $structure = SalaryStructure::updateOrCreate(
            ['company_id' => $request->company_id, 'employee_id' => $employeeId],
            $data
        );

        return response()->json(['status' => true, 'data' => $structure]);
    }

    // ── Salary Structures ──
    public function salaryStructures(Request $request)
    {
        return SalaryStructure::where('company_id', $request->company_id)
            ->with('employee:id,first_name,last_name,employee_id,branch_id,department_id')
            ->with('employee.department:id,name')
            ->with('employee.branch:id,branch_name')
            ->when($request->branch_id, fn($q) => $q->where('branch_id', $request->branch_id))
            ->orderBy('id', 'desc')
            ->paginate($request->per_page ?? 20);
    }

    public function storeSalaryStructure(Request $request)
    {
        $request->validate([
            'company_id' => 'required',
            'employee_id' => 'required',
            'basic_salary' => 'required|numeric',
        ]);

        $data = $request->only([
            'company_id', 'employee_id', 'basic_salary', 'house_allowance',
            'transport_allowance', 'food_allowance', 'medical_allowance', 'other_allowance',
            'overtime_eligible', 'loan_deduction', 'advance_deduction',
            'salary_mode', 'effective_from', 'effective_to', 'status',
        ]);
        $data['gross_salary'] = ($data['basic_salary'] ?? 0) + ($data['house_allowance'] ?? 0) +
            ($data['transport_allowance'] ?? 0) + ($data['food_allowance'] ?? 0) +
            ($data['medical_allowance'] ?? 0) + ($data['other_allowance'] ?? 0);
        $data['branch_id'] = $request->branch_id ?? Employee::find($data['employee_id'])?->branch_id;

        $structure = SalaryStructure::create($data);
        return response()->json(['status' => true, 'data' => $structure]);
    }

    public function updateSalaryStructure(Request $request, $id)
    {
        $structure = SalaryStructure::where('company_id', $request->company_id)->findOrFail($id);
        $data = $request->only([
            'employee_id', 'basic_salary', 'house_allowance', 'transport_allowance',
            'food_allowance', 'medical_allowance', 'other_allowance',
            'overtime_eligible', 'loan_deduction', 'advance_deduction',
            'salary_mode', 'effective_from', 'effective_to', 'status',
        ]);
        $data['gross_salary'] = ($data['basic_salary'] ?? $structure->basic_salary) +
            ($data['house_allowance'] ?? $structure->house_allowance) +
            ($data['transport_allowance'] ?? $structure->transport_allowance) +
            ($data['food_allowance'] ?? $structure->food_allowance) +
            ($data['medical_allowance'] ?? $structure->medical_allowance) +
            ($data['other_allowance'] ?? $structure->other_allowance);
        $structure->update($data);
        return response()->json(['status' => true, 'data' => $structure]);
    }

    // ── Adjustments ──
    public function adjustments(Request $request)
    {
        return PayrollAdjustment::where('company_id', $request->company_id)
            ->with('employee:id,first_name,last_name,employee_id,department_id')
            ->with('employee.department:id,name')
            ->when($request->payroll_month, fn($q) => $q->where('payroll_month', $request->payroll_month))
            ->orderBy('id', 'desc')
            ->paginate($request->per_page ?? 20);
    }

    public function storeAdjustment(Request $request)
    {
        $data = $request->only([
            'company_id', 'employee_id', 'type', 'amount', 'payroll_month', 'remarks',
        ]);
        $data['branch_id'] = $request->branch_id ?? Employee::find($data['employee_id'])?->branch_id;
        $adj = PayrollAdjustment::create($data);
        return response()->json(['status' => true, 'data' => $adj]);
    }

    public function deleteAdjustment(Request $request, $id)
    {
        PayrollAdjustment::where('company_id', $request->company_id)->findOrFail($id)->delete();
        return response()->json(['status' => true, 'message' => 'Deleted']);
    }

    // ── Loans ──
    public function loans(Request $request)
    {
        return EmployeeLoan::where('company_id', $request->company_id)
            ->with('employee:id,first_name,last_name,employee_id,department_id')
            ->with('employee.department:id,name')
            ->orderBy('id', 'desc')
            ->paginate($request->per_page ?? 20);
    }

    public function storeLoan(Request $request)
    {
        $data = $request->only([
            'company_id', 'employee_id', 'loan_amount', 'monthly_installment',
            'start_month', 'end_month', 'remarks', 'status',
        ]);
        $data['outstanding_balance'] = $data['loan_amount'] ?? 0;
        $data['branch_id'] = $request->branch_id ?? Employee::find($data['employee_id'])?->branch_id;
        $loan = EmployeeLoan::create($data);
        return response()->json(['status' => true, 'data' => $loan]);
    }

    // ── Advances ──
    public function advances(Request $request)
    {
        return EmployeeAdvance::where('company_id', $request->company_id)
            ->with('employee:id,first_name,last_name,employee_id,department_id')
            ->with('employee.department:id,name')
            ->orderBy('id', 'desc')
            ->paginate($request->per_page ?? 20);
    }

    public function storeAdvance(Request $request)
    {
        $data = $request->only([
            'company_id', 'employee_id', 'advance_amount', 'monthly_recovery',
            'issue_date', 'remarks', 'status',
        ]);
        $data['outstanding_balance'] = $data['advance_amount'] ?? 0;
        $data['branch_id'] = $request->branch_id ?? Employee::find($data['employee_id'])?->branch_id;
        $advance = EmployeeAdvance::create($data);
        return response()->json(['status' => true, 'data' => $advance]);
    }

    // ── Batches ──
    public function batches(Request $request)
    {
        return PayrollBatch::where('company_id', $request->company_id)
            ->orderBy('id', 'desc')
            ->paginate($request->per_page ?? 10);
    }

    // ── Payroll Records ──
    public function records(Request $request, $batchId)
    {
        // Verify batch belongs to this company
        PayrollBatch::where('company_id', $request->company_id)->findOrFail($batchId);

        return PayrollRecord::where('batch_id', $batchId)
            ->with('employee:id,first_name,last_name,employee_id,branch_id,department_id,profile_picture')
            ->with('employee.branch:id,branch_name')
            ->with('employee.department:id,name')
            ->paginate($request->per_page ?? 50);
    }

    // ── Dashboard Stats ──
    public function dashboardStats(Request $request)
    {
        $companyId = $request->company_id;
        $month = $request->month ?? date('Y-m');

        $batch = PayrollBatch::where('company_id', $companyId)->where('month', $month)->latest('id')->first();
        $records = $batch ? PayrollRecord::where('batch_id', $batch->id)->get() : collect();

        $empCount = Employee::where('company_id', $companyId)->count();
        $structures = SalaryStructure::where('company_id', $companyId)->where('status', 'active')->count();

        // Monthly trend (last 6 batches)
        $recentBatches = PayrollBatch::where('company_id', $companyId)
            ->orderBy('month', 'desc')->limit(6)->get()->reverse()->values();
        $monthlyTrend = $recentBatches->map(fn($b) => [
            'month' => Carbon::parse($b->month . '-01')->format('M'),
            'gross' => round($b->total_gross, 0),
            'net' => round($b->total_net, 0),
            'deductions' => round($b->total_deductions, 0),
        ]);

        // Department cost from current batch records
        $deptCost = [];
        if ($records->isNotEmpty()) {
            $empIds = $records->pluck('employee_id')->unique();
            $employees = Employee::whereIn('id', $empIds)->with('department:id,name')->get()->keyBy('id');
            foreach ($records as $r) {
                $dept = $employees[$r->employee_id]?->department?->name ?? 'Other';
                $deptCost[$dept] = ($deptCost[$dept] ?? 0) + $r->net_salary;
            }
        }
        $departmentCost = collect($deptCost)->map(fn($cost, $dept) => ['department' => $dept, 'cost' => round($cost, 0)])->values();

        return response()->json([
            'total_employees' => $empCount,
            'salary_structures' => $structures,
            'total_gross' => $records->sum('gross_earned'),
            'total_deductions' => $records->sum('total_deduction'),
            'total_net' => $records->sum('net_salary'),
            'total_ot' => $records->sum('ot_amount'),
            'pending' => $records->where('status', 'draft')->count(),
            'approved' => $records->where('status', 'approved')->count(),
            'paid' => $records->where('status', 'paid')->count(),
            'batch' => $batch,
            'monthly_trend' => $monthlyTrend,
            'department_cost' => $departmentCost,
        ]);
    }

    // ── Generate Payroll ──
    public function generatePayroll(Request $request)
    {
        $companyId = $request->company_id;
        $month = $request->month ?? date('Y-m');
        $branchId = $request->branch_id;

        // Check existing batch
        // Find existing draft batch to reuse, or create new one
        $existing = PayrollBatch::where('company_id', $companyId)->where('month', $month)
            ->where('status', 'draft')
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->first();

        DB::beginTransaction();
        try {
            // Get all employees with active salary structures
            $structures = SalaryStructure::where('company_id', $companyId)
                ->where('status', 'active')
                ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
                ->get();

            if ($structures->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'No salary structures found'], 400);
            }

            // Create or reuse batch
            $batch = $existing ?? PayrollBatch::create([
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'month' => $month,
                'status' => 'draft',
            ]);

            // Delete old records if reprocessing
            PayrollRecord::where('batch_id', $batch->id)->delete();

            $totalGross = 0;
            $totalDed = 0;
            $totalNet = 0;

            foreach ($structures as $ss) {
                $emp = Employee::find($ss->employee_id);
                if (!$emp) continue;

                // Get attendance data
                $monthStart = $month . '-01';
                $monthEnd = Carbon::parse($monthStart)->endOfMonth()->format('Y-m-d');
                $logs = AttendanceLog::where('UserID', $emp->system_user_id)
                    ->where('company_id', $companyId)
                    ->where('LogTime', '>=', $monthStart)
                    ->where('LogTime', '<=', $monthEnd . ' 23:59:59')
                    ->get();

                $byDate = [];
                foreach ($logs as $log) {
                    $date = Carbon::parse($log->LogTime)->format('Y-m-d');
                    $byDate[$date][] = $log;
                }

                $presentDays = count($byDate);
                $totalDaysInMonth = Carbon::parse($monthStart)->daysInMonth;
                $absentDays = max(0, $totalDaysInMonth - $presentDays);

                // Get shift for OT calculation
                $schedule = ScheduleEmployee::where('employee_id', $emp->system_user_id)->whereHas('shift')->latest('updated_at')->first();
                $shift = $schedule?->shift;
                $workingHours = $this->timeToMinutes($shift?->working_hours ?? '08:00') / 60;

                // Calculate OT hours
                $otHours = 0;
                if ($ss->overtime_eligible) {
                    foreach ($byDate as $dayLogs) {
                        usort($dayLogs, fn($a, $b) => strtotime($a->LogTime) - strtotime($b->LogTime));
                        if (count($dayLogs) >= 2) {
                            $first = Carbon::parse($dayLogs[0]->LogTime);
                            $last = Carbon::parse(end($dayLogs)->LogTime);
                            $workedHours = $first->diffInMinutes($last) / 60;
                            if ($workedHours > $workingHours) {
                                $otHours += ($workedHours - $workingHours);
                            }
                        }
                    }
                }

                // OT rate (basic/30days/8hours * 1.25)
                $otRate = ($ss->basic_salary / 30 / 8) * 1.25;
                $otAmount = round($otHours * $otRate, 2);

                // Adjustments for this month
                $adjustments = PayrollAdjustment::where('company_id', $companyId)
                    ->where('employee_id', $ss->employee_id)
                    ->where('payroll_month', $month)
                    ->get();

                $bonus = $adjustments->where('type', 'bonus')->sum('amount');
                $incentive = $adjustments->where('type', 'incentive')->sum('amount');
                $arrears = $adjustments->where('type', 'arrears')->sum('amount');
                $reimbursement = $adjustments->where('type', 'reimbursement')->sum('amount');
                $fineAmount = $adjustments->where('type', 'fine')->sum('amount');
                $otherDed = $adjustments->where('type', 'other_deduction')->sum('amount');

                // Absence deduction (basic/30 per absent day)
                $absenceDeduction = round(($ss->basic_salary / 30) * $absentDays, 2);

                // Loan deduction
                $loanDed = 0;
                if ($ss->loan_deduction) {
                    $activeLoan = EmployeeLoan::where('employee_id', $ss->employee_id)
                        ->where('company_id', $companyId)->where('status', 'active')->first();
                    if ($activeLoan && $activeLoan->outstanding_balance > 0) {
                        $loanDed = min($activeLoan->monthly_installment, $activeLoan->outstanding_balance);
                        $activeLoan->outstanding_balance -= $loanDed;
                        if ($activeLoan->outstanding_balance <= 0) $activeLoan->status = 'completed';
                        $activeLoan->save();
                    }
                }

                // Advance deduction
                $advanceDed = 0;
                if ($ss->advance_deduction) {
                    $activeAdv = EmployeeAdvance::where('employee_id', $ss->employee_id)
                        ->where('company_id', $companyId)->where('status', 'active')->first();
                    if ($activeAdv && $activeAdv->outstanding_balance > 0) {
                        $advanceDed = min($activeAdv->monthly_recovery, $activeAdv->outstanding_balance);
                        $activeAdv->outstanding_balance -= $advanceDed;
                        if ($activeAdv->outstanding_balance <= 0) $activeAdv->status = 'completed';
                        $activeAdv->save();
                    }
                }

                $totalAllowances = $ss->house_allowance + $ss->transport_allowance + $ss->food_allowance + $ss->medical_allowance + $ss->other_allowance;
                $grossEarned = $ss->basic_salary + $totalAllowances + $otAmount + $bonus + $incentive + $arrears + $reimbursement;
                $totalDeduction = $absenceDeduction + $loanDed + $advanceDed + $fineAmount + $otherDed;
                $netSalary = $grossEarned - $totalDeduction;

                PayrollRecord::create([
                    'batch_id' => $batch->id,
                    'company_id' => $companyId,
                    'branch_id' => $emp->branch_id,
                    'employee_id' => $ss->employee_id,
                    'month' => $month,
                    'present_days' => $presentDays,
                    'absent_days' => $absentDays,
                    'late_days' => 0,
                    'ot_hours' => round($otHours, 2),
                    'basic_salary' => $ss->basic_salary,
                    'house_allowance' => $ss->house_allowance,
                    'transport_allowance' => $ss->transport_allowance,
                    'food_allowance' => $ss->food_allowance,
                    'medical_allowance' => $ss->medical_allowance,
                    'other_allowance' => $ss->other_allowance,
                    'total_allowances' => $totalAllowances,
                    'ot_amount' => $otAmount,
                    'bonus' => $bonus,
                    'incentive' => $incentive,
                    'arrears' => $arrears,
                    'reimbursement' => $reimbursement,
                    'gross_earned' => $grossEarned,
                    'absence_deduction' => $absenceDeduction,
                    'late_deduction' => 0,
                    'loan_deduction' => $loanDed,
                    'advance_deduction' => $advanceDed,
                    'fine_amount' => $fineAmount,
                    'other_deduction' => $otherDed,
                    'total_deduction' => $totalDeduction,
                    'net_salary' => $netSalary,
                    'status' => 'draft',
                ]);

                $totalGross += $grossEarned;
                $totalDed += $totalDeduction;
                $totalNet += $netSalary;
            }

            $batch->update([
                'total_employees' => $structures->count(),
                'total_gross' => $totalGross,
                'total_deductions' => $totalDed,
                'total_net' => $totalNet,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => "Payroll generated for {$structures->count()} employees",
                'data' => $batch->fresh(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ── Approve Batch ──
    public function approveBatch(Request $request, $id)
    {
        $batch = PayrollBatch::where('company_id', $request->company_id)->findOrFail($id);
        $batch->update(['status' => 'approved', 'approved_by' => $request->user_id, 'approved_at' => now()]);
        PayrollRecord::where('batch_id', $id)->update(['status' => 'approved']);
        return response()->json(['status' => true, 'message' => 'Batch approved']);
    }

    // ── Mark as Paid ──
    public function markPaid(Request $request, $id)
    {
        $batch = PayrollBatch::where('company_id', $request->company_id)->findOrFail($id);
        $batch->update(['status' => 'paid', 'paid_at' => now()]);
        PayrollRecord::where('batch_id', $id)->update(['status' => 'paid']);
        return response()->json(['status' => true, 'message' => 'Batch marked as paid']);
    }

    // ── Download Payslip PDF ──
    public function downloadPayslip(Request $request, $recordId)
    {
        $record = PayrollRecord::where('company_id', $request->company_id)
            ->with('employee', 'employee.branch', 'employee.department', 'employee.designation')
            ->findOrFail($recordId);

        // Generate simple HTML payslip
        $html = view('pdf.payslip-new', ['record' => $record])->render();

        return response($html)->header('Content-Type', 'text/html');
    }

    // ── Report Export ──
    public function exportReport(Request $request)
    {
        $companyId = $request->company_id;
        $month = $request->month ?? date('Y-m');
        $reportType = $request->report_type;
        $format = $request->format ?? 'csv';

        $batch = PayrollBatch::where('company_id', $companyId)->where('month', $month)->latest('id')->first();
        if (!$batch) {
            return response()->json(['status' => false, 'message' => 'No payroll batch found for this month'], 404);
        }

        $records = PayrollRecord::where('batch_id', $batch->id)
            ->with('employee:id,first_name,last_name,employee_id,department_id,branch_id')
            ->with('employee.department:id,name')
            ->with('employee.branch:id,branch_name')
            ->get();

        $rows = [];
        $headers = [];

        switch ($reportType) {
            case 'register':
                $headers = ['Employee', 'ID', 'Department', 'Basic', 'Allowances', 'OT', 'Gross', 'Deductions', 'Net Salary', 'Status'];
                foreach ($records as $r) {
                    $rows[] = [
                        $r->employee ? "{$r->employee->first_name} {$r->employee->last_name}" : "Emp {$r->employee_id}",
                        $r->employee?->employee_id ?? $r->employee_id,
                        $r->employee?->department?->name ?? '---',
                        $r->basic_salary, $r->total_allowances, $r->ot_amount, $r->gross_earned,
                        $r->total_deduction, $r->net_salary, $r->status,
                    ];
                }
                break;
            case 'dept_summary':
                $headers = ['Department', 'Employees', 'Total Gross', 'Total Deductions', 'Total Net'];
                $grouped = $records->groupBy(fn($r) => $r->employee?->department?->name ?? 'Other');
                foreach ($grouped as $dept => $deptRecords) {
                    $rows[] = [$dept, $deptRecords->count(), $deptRecords->sum('gross_earned'), $deptRecords->sum('total_deduction'), $deptRecords->sum('net_salary')];
                }
                break;
            case 'deduction':
                $headers = ['Employee', 'ID', 'Absence', 'Late', 'Loan', 'Advance', 'Fine', 'Other', 'Total Deduction'];
                foreach ($records as $r) {
                    $rows[] = [
                        $r->employee ? "{$r->employee->first_name} {$r->employee->last_name}" : "Emp {$r->employee_id}",
                        $r->employee?->employee_id ?? $r->employee_id,
                        $r->absence_deduction, $r->late_deduction, $r->loan_deduction,
                        $r->advance_deduction, $r->fine_amount, $r->other_deduction, $r->total_deduction,
                    ];
                }
                break;
            case 'overtime':
                $headers = ['Employee', 'ID', 'OT Hours', 'OT Amount'];
                foreach ($records->where('ot_hours', '>', 0) as $r) {
                    $rows[] = [
                        $r->employee ? "{$r->employee->first_name} {$r->employee->last_name}" : "Emp {$r->employee_id}",
                        $r->employee?->employee_id ?? $r->employee_id,
                        $r->ot_hours, $r->ot_amount,
                    ];
                }
                break;
            case 'loan_recovery':
                $headers = ['Employee', 'ID', 'Loan Deduction'];
                foreach ($records->where('loan_deduction', '>', 0) as $r) {
                    $rows[] = [
                        $r->employee ? "{$r->employee->first_name} {$r->employee->last_name}" : "Emp {$r->employee_id}",
                        $r->employee?->employee_id ?? $r->employee_id,
                        $r->loan_deduction,
                    ];
                }
                break;
            case 'advance_recovery':
                $headers = ['Employee', 'ID', 'Advance Deduction'];
                foreach ($records->where('advance_deduction', '>', 0) as $r) {
                    $rows[] = [
                        $r->employee ? "{$r->employee->first_name} {$r->employee->last_name}" : "Emp {$r->employee_id}",
                        $r->employee?->employee_id ?? $r->employee_id,
                        $r->advance_deduction,
                    ];
                }
                break;
            default:
                $headers = ['Employee', 'ID', 'Basic', 'Gross', 'Net'];
                foreach ($records as $r) {
                    $rows[] = [
                        $r->employee ? "{$r->employee->first_name} {$r->employee->last_name}" : "Emp {$r->employee_id}",
                        $r->employee?->employee_id ?? $r->employee_id,
                        $r->basic_salary, $r->gross_earned, $r->net_salary,
                    ];
                }
        }

        // CSV download
        $filename = "{$reportType}_{$month}.csv";
        $callback = function () use ($headers, $rows) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);
            foreach ($rows as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function timeToMinutes($time): int
    {
        if (!$time || $time === '---') return 480; // default 8 hours
        $parts = explode(':', $time);
        return (int)($parts[0] ?? 0) * 60 + (int)($parts[1] ?? 0);
    }
}
