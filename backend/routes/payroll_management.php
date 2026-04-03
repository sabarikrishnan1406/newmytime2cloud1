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

// Payslip
Route::get('payroll-management/payslip/{recordId}', [PayrollManagementController::class, 'downloadPayslip']);

// Reports Export
Route::get('payroll-management/export-report', [PayrollManagementController::class, 'exportReport']);
