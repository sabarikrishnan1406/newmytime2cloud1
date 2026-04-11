<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Payslip - {{ $record->employee->employee_id ?? '' }} - {{ $record->month }}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; background: #fff; }
  .page { max-width: 800px; margin: 0 auto; }

  /* Header */
  .header { background: #1a5276; color: #fff; padding: 28px 35px; display: flex; justify-content: space-between; align-items: flex-start; }
  .header h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .header .sub { font-size: 13px; opacity: 0.85; margin-top: 4px; }
  .header .confidential { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; border: 1px solid rgba(255,255,255,0.3); padding: 4px 12px; border-radius: 4px; }

  /* Employee & Payment Details */
  .details { display: flex; gap: 40px; padding: 28px 35px; border-bottom: 1px solid #e8e8e8; }
  .details .col { flex: 1; }
  .details h3 { font-size: 13px; font-weight: 700; color: #1a5276; margin-bottom: 12px; }
  .details .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
  .details .row .label { color: #666; min-width: 120px; }
  .details .row .value { font-weight: 600; color: #333; }

  /* Attendance Summary */
  .attendance { margin: 20px 35px; border: 1px solid #1a5276; border-radius: 6px; padding: 14px 20px; }
  .attendance h4 { font-size: 12px; font-weight: 700; color: #1a5276; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .attendance p { font-size: 12px; color: #444; }
  .attendance .stats { display: flex; gap: 20px; flex-wrap: wrap; }
  .attendance .stat { display: flex; gap: 6px; align-items: center; }
  .attendance .stat-value { font-weight: 700; color: #1a5276; }
  .attendance .stat-label { color: #666; }
  .attendance .separator { color: #ccc; }

  /* Earnings & Deductions Tables */
  .tables { display: flex; gap: 20px; padding: 20px 35px; }
  .tables .col { flex: 1; }
  .tables table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .tables th { background: #c0392b; color: #fff; padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .tables .earnings th { background: #1a5276; }
  .tables td { padding: 8px 12px; border-bottom: 1px solid #eee; }
  .tables td:last-child { text-align: right; font-weight: 500; }
  .tables .total td { font-weight: 700; border-top: 2px solid #ddd; background: #f8f8f8; }
  .tables .zero td { color: #bbb; }

  /* Net Salary */
  .net-salary { background: #1a5276; color: #fff; margin: 20px 35px; padding: 18px 25px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
  .net-salary .label { font-size: 16px; font-weight: 700; }
  .net-salary .amount { font-size: 28px; font-weight: 800; }

  /* Calculation Note */
  .calc-note { margin: 10px 35px; padding: 10px 15px; background: #f9f9f9; border-left: 3px solid #1a5276; font-size: 10px; color: #888; }
  .calc-note span { font-weight: 600; color: #555; }

  /* Signatures */
  .signatures { display: flex; justify-content: space-between; padding: 40px 35px 20px; }
  .signatures .sig { text-align: center; }
  .signatures .sig .line { width: 160px; border-top: 1px solid #999; margin-bottom: 6px; }
  .signatures .sig .title { font-size: 11px; color: #666; }

  /* Footer */
  .footer { text-align: center; padding: 15px 35px 25px; font-size: 10px; color: #c0392b; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: 100%; }
  }
</style>
</head>
<body>
<div class="page">

  @php
    $monthLabel = '---';
    try { $monthLabel = \Carbon\Carbon::parse($record->month . '-01')->format('F Y'); } catch(\Exception $e) {}
    $currency = 'AED';
    $daysInMonth = 30;
    try { $daysInMonth = \Carbon\Carbon::parse($record->month . '-01')->daysInMonth; } catch(\Exception $e) {}
    $dailyRate = $record->basic_salary > 0 ? round($record->basic_salary / $daysInMonth, 2) : 0;
  @endphp

  <!-- Header -->
  <div class="header">
    <div>
      <h1>{{ $record->employee->company->name ?? 'MyTime2Cloud' }}</h1>
      <div class="sub">Payslip - {{ $monthLabel }}</div>
    </div>
    <div class="confidential">CONFIDENTIAL</div>
  </div>

  <!-- Employee & Payment Details -->
  <div class="details">
    <div class="col">
      <h3>Employee Details</h3>
      <div class="row"><span class="label">Employee ID</span><span class="value">{{ $record->employee->employee_id ?? $record->employee_id }}</span></div>
      <div class="row"><span class="label">Employee Name</span><span class="value">{{ $record->employee->first_name ?? '' }} {{ $record->employee->last_name ?? '' }}</span></div>
      <div class="row"><span class="label">Department</span><span class="value">{{ $record->employee->department->name ?? '---' }}</span></div>
      <div class="row"><span class="label">Designation</span><span class="value">{{ $record->employee->designation->name ?? '---' }}</span></div>
      <div class="row"><span class="label">Branch</span><span class="value">{{ $record->employee->branch->branch_name ?? '---' }}</span></div>
    </div>
    <div class="col">
      <h3>Payment Details</h3>
      <div class="row"><span class="label">Payment Method</span><span class="value">Bank Transfer</span></div>
      <div class="row"><span class="label">Bank</span><span class="value">{{ $record->employee->bank->bank_name ?? '---' }}</span></div>
      <div class="row"><span class="label">IBAN</span><span class="value">{{ $record->employee->bank->account_no ?? '---' }}</span></div>
      <div class="row"><span class="label">Pay Period</span><span class="value">{{ $monthLabel }}</span></div>
      <div class="row"><span class="label">Status</span><span class="value" style="text-transform:uppercase; color: {{ $record->status === 'paid' ? '#27ae60' : '#e67e22' }}">{{ $record->status }}</span></div>
    </div>
  </div>

  <!-- Attendance Summary -->
  <div class="attendance">
    <h4>Attendance Summary</h4>
    <div class="stats">
      <div class="stat"><span class="stat-value">{{ $record->present_days }}</span><span class="stat-label">Present</span></div>
      <span class="separator">|</span>
      <div class="stat"><span class="stat-value">{{ $record->absent_days }}</span><span class="stat-label">Absent</span></div>
      <span class="separator">|</span>
      <div class="stat"><span class="stat-value">{{ $record->late_days }}</span><span class="stat-label">Late Days</span></div>
      <span class="separator">|</span>
      <div class="stat"><span class="stat-value">{{ $record->late_minutes ?? 0 }}</span><span class="stat-label">Late Mins</span></div>
      <span class="separator">|</span>
      <div class="stat"><span class="stat-value">{{ $record->ot_hours }}</span><span class="stat-label">OT Hrs</span></div>
      @if(($record->paid_leave_days ?? 0) > 0)
      <span class="separator">|</span>
      <div class="stat"><span class="stat-value" style="color:#27ae60">{{ $record->paid_leave_days }}</span><span class="stat-label">Paid Leave</span></div>
      @endif
      @if(($record->unpaid_leave_days ?? 0) > 0)
      <span class="separator">|</span>
      <div class="stat"><span class="stat-value" style="color:#c0392b">{{ $record->unpaid_leave_days }}</span><span class="stat-label">Unpaid Leave</span></div>
      @endif
    </div>
  </div>

  <!-- Earnings & Deductions Tables -->
  <div class="tables">
    <div class="col">
      <table class="earnings">
        <thead><tr><th>Earnings</th><th style="text-align:right">Amount ({{ $currency }})</th></tr></thead>
        <tbody>
          <tr><td>Basic Salary</td><td>{{ number_format($record->basic_salary, 2) }}</td></tr>
          @if($record->house_allowance > 0)<tr><td>House Allowance</td><td>{{ number_format($record->house_allowance, 2) }}</td></tr>@endif
          @if($record->transport_allowance > 0)<tr><td>Transport Allowance</td><td>{{ number_format($record->transport_allowance, 2) }}</td></tr>@endif
          @if($record->food_allowance > 0)<tr><td>Food Allowance</td><td>{{ number_format($record->food_allowance, 2) }}</td></tr>@endif
          @if($record->medical_allowance > 0)<tr><td>Medical Allowance</td><td>{{ number_format($record->medical_allowance, 2) }}</td></tr>@endif
          @if($record->other_allowance > 0)<tr><td>Other Allowance</td><td>{{ number_format($record->other_allowance, 2) }}</td></tr>@endif
          @if($record->ot_amount > 0)<tr><td>Overtime ({{ $record->ot_hours }} hrs)</td><td>{{ number_format($record->ot_amount, 2) }}</td></tr>@endif
          @if($record->bonus > 0)<tr><td>Bonus</td><td>{{ number_format($record->bonus, 2) }}</td></tr>@endif
          @if($record->incentive > 0)<tr><td>Incentive</td><td>{{ number_format($record->incentive, 2) }}</td></tr>@endif
          @if($record->arrears > 0)<tr><td>Arrears</td><td>{{ number_format($record->arrears, 2) }}</td></tr>@endif
          @if($record->reimbursement > 0)<tr><td>Reimbursement</td><td>{{ number_format($record->reimbursement, 2) }}</td></tr>@endif
          <tr class="total"><td>Gross Earned</td><td>{{ number_format($record->gross_earned, 2) }}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="col">
      <table>
        <thead><tr><th>Deductions</th><th style="text-align:right">Amount ({{ $currency }})</th></tr></thead>
        <tbody>
          <tr class="{{ $record->absence_deduction == 0 ? 'zero' : '' }}"><td>Absence Deduction ({{ $record->absent_days }} days)</td><td>{{ number_format($record->absence_deduction, 2) }}</td></tr>
          @if(($record->leave_deduction ?? 0) > 0)
          <tr><td>Unpaid Leave ({{ $record->unpaid_leave_days }} days)</td><td>{{ number_format($record->leave_deduction, 2) }}</td></tr>
          @endif
          <tr class="{{ $record->late_deduction == 0 ? 'zero' : '' }}"><td>Late Deduction ({{ $record->late_days }} days)</td><td>{{ number_format($record->late_deduction, 2) }}</td></tr>
          <tr class="{{ $record->loan_deduction == 0 ? 'zero' : '' }}"><td>Loan Deduction</td><td>{{ number_format($record->loan_deduction, 2) }}</td></tr>
          <tr class="{{ $record->advance_deduction == 0 ? 'zero' : '' }}"><td>Advance Deduction</td><td>{{ number_format($record->advance_deduction, 2) }}</td></tr>
          @if($record->fine_amount > 0)<tr><td>Fine</td><td>{{ number_format($record->fine_amount, 2) }}</td></tr>@endif
          @if($record->other_deduction > 0)<tr><td>Other Deduction</td><td>{{ number_format($record->other_deduction, 2) }}</td></tr>@endif
          <tr class="total"><td>Total Deductions</td><td>{{ number_format($record->total_deduction, 2) }}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Calculation Breakdown -->
  <div class="calc-note">
    <span>Daily Rate:</span> {{ $currency }} {{ number_format($dailyRate, 2) }} (Basic {{ number_format($record->basic_salary, 2) }} / {{ $daysInMonth }} days)
    &nbsp;&bull;&nbsp;
    <span>Absence:</span> {{ $record->absent_days }} days x {{ number_format($dailyRate, 2) }} = {{ number_format($record->absence_deduction, 2) }}
    @if(($record->leave_deduction ?? 0) > 0)
    &nbsp;&bull;&nbsp;
    <span>Unpaid Leave:</span> {{ $record->unpaid_leave_days }} days x {{ number_format($dailyRate, 2) }} = {{ number_format($record->leave_deduction, 2) }}
    @endif
    @if(($record->paid_leave_days ?? 0) > 0)
    &nbsp;&bull;&nbsp;
    <span style="color:#27ae60">Paid Leave:</span> {{ $record->paid_leave_days }} days (no deduction)
    @endif
    @if($record->ot_amount > 0)
    &nbsp;&bull;&nbsp;
    <span>OT:</span> {{ $record->ot_hours }} hrs
    @endif
  </div>

  <!-- Net Salary -->
  <div class="net-salary">
    <span class="label">NET SALARY</span>
    <span class="amount">{{ $currency }} {{ number_format($record->net_salary, 2) }}</span>
  </div>

  <!-- Signatures -->
  <div class="signatures">
    <div class="sig"><div class="line"></div><div class="title">Prepared By</div></div>
    <div class="sig"><div class="line"></div><div class="title">Approved By</div></div>
    <div class="sig"><div class="line"></div><div class="title">Received By</div></div>
  </div>

  <!-- Footer -->
  <div class="footer">This is a system-generated payslip. For any queries, please contact the HR department.</div>

</div>
</body>
</html>
