<?php

use App\Http\Controllers\PayrollManagementController;
use Illuminate\Support\Facades\Route;

// Employee list for dropdowns
Route::get('payroll-management/employees', [PayrollManagementController::class, 'employeeList']);

// Dashboard
Route::get('payroll-management/dashboard', [PayrollManagementController::class, 'dashboardStats']);

// Employee Salary Structure (for Employee Edit page)
Route::get('payroll-management/employee-salary/{employeeId}', [PayrollManagementController::class, 'employeeSalaryStructure']);
Route::post('payroll-management/employee-salary/{employeeId}', [PayrollManagementController::class, 'upsertEmployeeSalaryStructure']);

// Salary Structures
Route::get('payroll-management/salary-structures', [PayrollManagementController::class, 'salaryStructures']);
Route::post('payroll-management/salary-structures', [PayrollManagementController::class, 'storeSalaryStructure']);
Route::put('payroll-management/salary-structures/{id}', [PayrollManagementController::class, 'updateSalaryStructure']);

// Adjustments
Route::get('payroll-management/adjustments', [PayrollManagementController::class, 'adjustments']);
Route::post('payroll-management/adjustments', [PayrollManagementController::class, 'storeAdjustment']);
Route::delete('payroll-management/adjustments/{id}', [PayrollManagementController::class, 'deleteAdjustment']);

// Loans
Route::get('payroll-management/loans', [PayrollManagementController::class, 'loans']);
Route::post('payroll-management/loans', [PayrollManagementController::class, 'storeLoan']);

// Advances
Route::get('payroll-management/advances', [PayrollManagementController::class, 'advances']);
Route::post('payroll-management/advances', [PayrollManagementController::class, 'storeAdvance']);

// Batches
Route::get('payroll-management/batches', [PayrollManagementController::class, 'batches']);

// Payroll Records
Route::get('payroll-management/records/{batchId}', [PayrollManagementController::class, 'records']);

// Generate, Approve, Pay
Route::post('payroll-management/generate', [PayrollManagementController::class, 'generatePayroll']);
Route::post('payroll-management/approve/{id}', [PayrollManagementController::class, 'approveBatch']);
Route::post('payroll-management/mark-paid/{id}', [PayrollManagementController::class, 'markPaid']);

// Staff Payslips (for employee self-service)
Route::get('payroll-management/staff-payslips', function (\Illuminate\Http\Request $request) {
    $employeeId = $request->employee_id;
    $year = $request->year ?? date('Y');

    $records = \App\Models\PayrollRecord::where('company_id', $request->company_id)
        ->where('employee_id', $employeeId)
        ->where('month', 'like', $year . '%')
        ->orderBy('month', 'desc')
        ->get();

    return $records->map(function ($r) {
        $monthNum = (int) substr($r->month, 5, 2) - 1;
        return [
            'id' => $r->id,
            'month' => $monthNum,
            'year' => (int) substr($r->month, 0, 4),
            'basic_salary' => $r->basic_salary,
            'net_salary' => $r->net_salary,
            'final_salary' => $r->net_salary,
            'total_allowances' => $r->total_allowances,
            'ot_amount' => $r->ot_amount,
            'gross_earned' => $r->gross_earned,
            'total_deduction' => $r->total_deduction,
            'status' => $r->status,
            'batch_month' => $r->month,
        ];
    });
});

// Payslip
Route::get('payroll-management/payslip/{recordId}', [PayrollManagementController::class, 'downloadPayslip']);

// Employee Geo-Fencing
Route::get('employee-geofence/{employeeId}', function (\Illuminate\Http\Request $request, $employeeId) {
    return \App\Models\EmployeeGeofence::where('company_id', $request->company_id)->where('employee_id', $employeeId)->first();
});
Route::post('employee-geofence/{employeeId}', function (\Illuminate\Http\Request $request, $employeeId) {
    $data = $request->only(['geo_fencing_enabled', 'latitude', 'longitude', 'radius']);
    $data['company_id'] = $request->company_id;
    $data['employee_id'] = $employeeId;
    $geofence = \App\Models\EmployeeGeofence::updateOrCreate(
        ['company_id' => $request->company_id, 'employee_id' => $employeeId],
        $data
    );
    return response()->json(['status' => true, 'data' => $geofence]);
});

// Settings
Route::get('payroll-management/settings', [PayrollManagementController::class, 'getSettings']);
Route::post('payroll-management/settings', [PayrollManagementController::class, 'saveSettings']);

// Reports Export
Route::get('payroll-management/export-report', [PayrollManagementController::class, 'exportReport']);
