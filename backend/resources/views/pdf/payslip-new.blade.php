<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Payslip</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #1a1a2e; background: #f8f9fa; padding: 30px; }
  .payslip { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { font-size: 24px; }
  .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 24px 30px; background: #f8f9fa; border-bottom: 1px solid #e5e7eb; }
  .info-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; }
  .info-item p { font-size: 14px; font-weight: 600; margin-top: 2px; }
  .section { padding: 20px 30px; }
  .section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280; margin-bottom: 12px; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
  .total-row { background: #f0fdf4; border-radius: 8px; padding: 16px 20px; margin: 20px 30px; display: flex; justify-content: space-between; }
  .total-row .label { font-size: 14px; font-weight: 700; color: #065f46; }
  .total-row .value { font-size: 24px; font-weight: 800; color: #065f46; }
  .footer { text-align: center; padding: 20px; font-size: 11px; color: #9ca3af; }
</style>
</head>
<body>
<div class="payslip">
  <div class="header">
    <div><h1>PAYSLIP</h1><div style="font-size:14px;opacity:0.8;">{{ $record->month }}</div></div>
    <div style="text-align:right;font-size:13px;opacity:0.7;">{{ $record->employee->branch->branch_name ?? '' }}</div>
  </div>
  <div class="info">
    <div class="info-item"><label>Employee</label><p>{{ $record->employee->first_name }} {{ $record->employee->last_name }}</p></div>
    <div class="info-item"><label>ID</label><p>{{ $record->employee->employee_id }}</p></div>
    <div class="info-item"><label>Department</label><p>{{ $record->employee->department->name ?? '---' }}</p></div>
    <div class="info-item"><label>Present / Absent</label><p>{{ $record->present_days }} / {{ $record->absent_days }}</p></div>
  </div>
  <div class="section">
    <h3>Earnings</h3>
    <div class="row"><span>Basic Salary</span><span>{{ number_format($record->basic_salary, 2) }}</span></div>
    <div class="row"><span>Allowances</span><span>{{ number_format($record->total_allowances, 2) }}</span></div>
    <div class="row"><span>Overtime ({{ $record->ot_hours }}h)</span><span>{{ number_format($record->ot_amount, 2) }}</span></div>
    <div class="row" style="font-weight:bold;border-top:2px solid #e5e7eb;"><span>Gross</span><span>{{ number_format($record->gross_earned, 2) }}</span></div>
  </div>
  <div class="section" style="background:#fef2f2;">
    <h3>Deductions</h3>
    <div class="row"><span>Total Deductions</span><span style="color:#ef4444;">-{{ number_format($record->total_deduction, 2) }}</span></div>
  </div>
  <div class="total-row"><span class="label">NET SALARY</span><span class="value">{{ number_format($record->net_salary, 2) }}</span></div>
  <div class="footer">Computer generated payslip</div>
</div>
</body>
</html>
