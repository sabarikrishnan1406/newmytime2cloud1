<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monthly Attendance Report</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 8.5pt;
            color: #1e293b;
            line-height: 1.4;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .page-break { page-break-after: always; }

        .page-wrapper {
            padding: 24px 28px 20px 28px;
            position: relative;
        }

        /* ===== TOP ACCENT BAR ===== */
        .accent-bar {
            height: 7px;
            background: #4f46e5;
        }

        /* ===== HEADER ===== */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 16px;
        }

        .header-table td {
            border: none;
            padding: 0 0 14px 0;
            vertical-align: middle;
        }

        .report-title {
            font-size: 18pt;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .report-meta {
            font-size: 8pt;
            color: #64748b;
            margin-top: 4px;
        }

        .report-meta-icon { color: #4f46e5; }

        .company-badge {
            text-align: right;
        }

        .company-card {
            display: inline-block;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 8px 14px;
        }

        .company-card-table {
            border: none;
            border-collapse: collapse;
        }

        .company-card-table td {
            border: none;
            padding: 0;
            vertical-align: middle;
        }

        .company-icon {
            width: 34px;
            height: 34px;
            background: #4f46e5;
            border-radius: 6px;
            text-align: center;
            line-height: 34px;
            color: #fff;
            font-size: 14pt;
            font-weight: bold;
            margin-right: 10px;
        }

        .company-name {
            font-size: 9pt;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .company-location {
            font-size: 6.5pt;
            color: #64748b;
        }

        /* ===== EMPLOYEE + STATS ROW ===== */
        .info-row {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        .info-row td {
            border: none;
            padding: 0;
            vertical-align: top;
        }

        .emp-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 16px;
            width: 100%;
        }

        .emp-card-inner {
            width: 100%;
            border: none;
            border-collapse: collapse;
        }

        .emp-card-inner td {
            border: none;
            padding: 0;
            vertical-align: middle;
        }

        .emp-avatar {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            border: 2px solid #e2e8f0;
            object-fit: cover;
        }

        .emp-avatar-placeholder {
            width: 50px;
            height: 50px;
            background: #f1f5f9;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            text-align: center;
            line-height: 50px;
            color: #94a3b8;
            font-size: 20pt;
        }

        .emp-name {
            font-size: 12pt;
            font-weight: bold;
            color: #0f172a;
        }

        .emp-id {
            font-size: 7pt;
            font-weight: bold;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
        }

        .emp-dept {
            font-size: 7pt;
            color: #64748b;
            margin-top: 1px;
        }

        /* Stat cards */
        .stat-cards {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 0;
        }

        .stat-cards td {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 8px;
            text-align: center;
            vertical-align: middle;
            background: #fff;
            width: 25%;
        }

        .stat-label {
            font-size: 6pt;
            font-weight: bold;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .stat-value {
            font-size: 18pt;
            font-weight: bold;
            color: #0f172a;
            margin-top: 2px;
        }

        .stat-unit {
            font-size: 7pt;
            color: #94a3b8;
            font-weight: normal;
        }

        .stat-late {
            background: #fff1f2 !important;
            border-color: #fecdd3 !important;
        }
        .stat-late .stat-label { color: #e11d48; }
        .stat-late .stat-value { color: #e11d48; }

        .stat-ot {
            background: #eef2ff !important;
            border-color: #c7d2fe !important;
        }
        .stat-ot .stat-label { color: #4f46e5; }
        .stat-ot .stat-value { color: #4f46e5; }

        /* ===== SUMMARY BAR ===== */
        .summary-bar {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            margin-bottom: 12px;
            overflow: hidden;
            background: #fff;
        }

        .summary-bar-table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-bar-table td {
            text-align: center;
            padding: 8px 4px 10px 4px;
            border-right: 1px solid #f1f5f9;
            vertical-align: middle;
        }

        .summary-bar-table td:last-child {
            border-right: none;
        }

        .sum-label {
            font-size: 5.5pt;
            font-weight: bold;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .sum-value {
            font-size: 14pt;
            font-weight: bold;
            color: #0f172a;
        }

        .sum-bar {
            width: 20px;
            height: 3px;
            border-radius: 2px;
            margin: 5px auto 0 auto;
        }

        .bar-green { background: #10b981; }
        .bar-red { background: #ef4444; }
        .bar-slate { background: #94a3b8; }
        .bar-amber { background: #f59e0b; }
        .bar-violet { background: #8b5cf6; }
        .bar-orange { background: #f97316; }
        .bar-cyan { background: #06b6d4; }

        /* ===== DATA TABLE ===== */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
        }

        .data-table thead th {
            background: #f8fafc;
            color: #64748b;
            padding: 9px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 6.5pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e2e8f0;
        }

        .data-table thead th.col-center { text-align: center; }
        .data-table thead th.col-right { text-align: right; }
        .data-table thead th.col-late { color: #e11d48; }
        .data-table thead th.col-early { color: #d97706; }
        .data-table thead th.col-ot { color: #4f46e5; }

        .data-table tbody td {
            padding: 9px 10px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }

        .data-table tbody tr:last-child td {
            border-bottom: none;
        }

        /* Date */
        .td-date-main {
            font-size: 9pt;
            font-weight: bold;
            color: #0f172a;
        }

        .td-date-day {
            font-size: 6.5pt;
            color: #64748b;
        }

        /* Shift */
        .td-shift {
            font-size: 7pt;
            font-weight: 500;
            color: #334155;
        }

        .td-shift-type {
            font-size: 5.5pt;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Time */
        .td-time { font-size: 8.5pt; font-weight: 500; color: #0f172a; }
        .td-time-dash { font-size: 8.5pt; color: #cbd5e1; }
        .td-device { font-size: 5.5pt; color: #94a3b8; }

        /* Mono values */
        .td-mono { font-size: 8pt; text-align: center; }
        .td-mono-late { color: #e11d48; font-weight: bold; }
        .td-mono-early { color: #d97706; font-weight: bold; }
        .td-mono-ot { color: #4f46e5; font-weight: bold; }
        .td-mono-zero { color: #cbd5e1; }
        .td-mono-hrs { color: #475569; font-weight: 600; }

        /* Status badges */
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 6pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            text-align: center;
        }

        .badge-present { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .badge-absent { background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; }
        .badge-weekoff { background: #fff; color: #64748b; border: 1px solid #e2e8f0; }
        .badge-holiday { background: #fff; color: #64748b; border: 1px solid #e2e8f0; }
        .badge-leave { background: #faf5ff; color: #7c3aed; border: 1px solid #ddd6fe; }
        .badge-missing { background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }
        .badge-manual { font-size: 5pt; color: #d97706; display: block; margin-top: 2px; }

        /* Row highlights */
        .row-absent td { background: #fff5f5; }
        .row-weekoff td { background: #f8fafc; }
        .row-holiday td { background: #f8fafc; }
        .row-weekoff .td-date-main, .row-holiday .td-date-main { color: #64748b; }
        .row-weekoff .td-date-day, .row-holiday .td-date-day { color: #94a3b8; }

        .text-right { text-align: right; }

        /* ===== FOOTER ===== */
        .footer {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
            border-top: 1px solid #f1f5f9;
            padding-top: 8px;
        }

        .footer td {
            border: none;
            padding: 6px 0 0 0;
            font-size: 6pt;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    @foreach($employees as $empId => $empData)
        @php
            $emp = $empData['employee'];
            $days = $empData['days'];
            $st = $empData['stats'];

            $totalDays = count($days);
            $score = $totalDays > 0 ? round(($st['present'] / $totalDays) * 100, 0) : 0;
            $totalHrs = floor($st['total_hours'] / 60);
            $totalHrsFormatted = $totalHrs . ':' . str_pad($st['total_hours'] % 60, 2, '0', STR_PAD_LEFT);
            $totalOtFormatted = floor($st['total_ot'] / 60) . ':' . str_pad($st['total_ot'] % 60, 2, '0', STR_PAD_LEFT);
        @endphp

        <!-- ACCENT BAR -->
        <div class="accent-bar"></div>

        <div class="page-wrapper">
            <!-- HEADER -->
            <table class="header-table">
                <tr>
                    <td style="width: 65%;">
                        <div class="report-title">Monthly Attendance Report</div>
                        <div class="report-meta">
                            <span class="report-meta-icon">&#x1F4C5;</span>
                            {{ \Carbon\Carbon::parse($fromDate)->format('d M Y') }} - {{ \Carbon\Carbon::parse($toDate)->format('d M Y') }}
                            &nbsp;&bull;&nbsp; Monthly Exact
                        </div>
                    </td>
                    <td class="company-badge">
                        <div class="company-card">
                            <table class="company-card-table">
                                <tr>
                                    <td><div class="company-icon">&#x1F3E2;</div></td>
                                    <td>
                                        <div class="company-name">{{ $company->name ?? 'Company' }}</div>
                                        <div class="company-location">&#x1F4CD; {{ $emp->branch->branch_name ?? 'Head Office' }}</div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>

            <!-- EMPLOYEE + STATS -->
            <table class="info-row">
                <tr>
                    <td style="width: 34%; padding-right: 12px;">
                        <div class="emp-card">
                            <table class="emp-card-inner">
                                <tr>
                                    <td style="width: 58px; padding-right: 12px;">
                                        @if($emp->profile_picture)
                                            <img src="{{ $emp->profile_picture }}" class="emp-avatar" />
                                        @else
                                            <div class="emp-avatar-placeholder">&#x1F464;</div>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="emp-name">{{ $emp->first_name ?? '' }} {{ $emp->last_name ?? '' }}</div>
                                        <div class="emp-id">ID: {{ $emp->employee_id ?? '---' }}</div>
                                        <div class="emp-dept">{{ $emp->department->name ?? '---' }}</div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                    <td style="width: 66%;">
                        <table class="stat-cards">
                            <tr>
                                <td>
                                    <div class="stat-label">Score</div>
                                    <div class="stat-value">{{ $score }}%</div>
                                </td>
                                <td>
                                    <div class="stat-label">Worked</div>
                                    <div class="stat-value">{{ $totalHrs }} <span class="stat-unit">h</span></div>
                                </td>
                                <td class="stat-late">
                                    <div class="stat-label">Late In</div>
                                    <div class="stat-value">{{ $st['late'] > 0 ? $st['late'] : '00:00' }}</div>
                                </td>
                                <td class="stat-ot">
                                    <div class="stat-label">Overtime</div>
                                    <div class="stat-value">{{ $totalOtFormatted }}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- SUMMARY BAR -->
            <div class="summary-bar">
                <table class="summary-bar-table">
                    <tr>
                        <td>
                            <div class="sum-label">Present</div>
                            <div class="sum-value">{{ $st['present'] }}</div>
                            <div class="sum-bar bar-green"></div>
                        </td>
                        <td>
                            <div class="sum-label">Absent</div>
                            <div class="sum-value">{{ $st['absent'] }}</div>
                            <div class="sum-bar bar-red"></div>
                        </td>
                        <td>
                            <div class="sum-label">Week Off</div>
                            <div class="sum-value">{{ $st['week_off'] }}</div>
                            <div class="sum-bar bar-slate"></div>
                        </td>
                        <td>
                            <div class="sum-label">Leaves</div>
                            <div class="sum-value">{{ $st['leave'] }}</div>
                            <div class="sum-bar bar-amber"></div>
                        </td>
                        <td>
                            <div class="sum-label">Holidays</div>
                            <div class="sum-value">{{ $st['holiday'] }}</div>
                            <div class="sum-bar bar-violet"></div>
                        </td>
                        <td>
                            <div class="sum-label">Missing</div>
                            <div class="sum-value">{{ $st['missing'] }}</div>
                            <div class="sum-bar bar-orange"></div>
                        </td>
                        <td>
                            <div class="sum-label">Manual</div>
                            <div class="sum-value">{{ $st['manual'] }}</div>
                            <div class="sum-bar bar-cyan"></div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- DATA TABLE -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 90px;">Date</th>
                        <th>Shift Details</th>
                        <th>In Time</th>
                        <th>Out Time</th>
                        <th class="col-center col-late">Late In</th>
                        <th class="col-center col-early">Early Go</th>
                        <th class="col-center col-ot">Overtime</th>
                        <th class="col-center">Work Hrs</th>
                        <th class="col-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($days as $day)
                        @php
                            $rowClass = '';
                            if ($day['status'] === 'H') $rowClass = 'row-holiday';
                            elseif ($day['status'] === 'O') $rowClass = 'row-weekoff';
                            elseif ($day['status'] === 'A') $rowClass = 'row-absent';

                            $statusText = match($day['status']) {
                                'P' => 'PRESENT', 'A' => 'ABSENT', 'O' => 'WEEK OFF',
                                'H' => 'HOLIDAY', 'L' => 'LEAVE', 'M' => 'MISSING',
                                'LC' => 'PRESENT', 'EG' => 'PRESENT', 'V' => 'VACATION',
                                default => $day['status'],
                            };

                            $badgeClass = match($day['status']) {
                                'P', 'LC', 'EG' => 'badge-present',
                                'A' => 'badge-absent',
                                'O' => 'badge-weekoff',
                                'H' => 'badge-holiday',
                                'L' => 'badge-leave',
                                'M' => 'badge-missing',
                                default => 'badge-weekoff',
                            };

                            $hasLate = $day['late_coming'] !== '---' && $day['late_coming'] !== '00:00';
                            $hasEarly = $day['early_going'] !== '---' && $day['early_going'] !== '00:00';
                            $hasOt = $day['ot'] !== '---' && $day['ot'] !== '00:00';
                            $hasHrs = $day['total_hrs'] !== '---' && $day['total_hrs'] !== '00:00';
                        @endphp
                        <tr class="{{ $rowClass }}">
                            <td>
                                <div class="td-date-main">{{ $day['date'] }}</div>
                                <div class="td-date-day">{{ $day['day'] }}</div>
                            </td>
                            <td>
                                <div class="td-shift">{{ $day['shift'] }}</div>
                                <div class="td-shift-type">{{ $day['shift_type'] ?? '' }}</div>
                            </td>
                            <td>
                                @if($day['in'] !== '---')
                                    <div class="td-time">{{ $day['in'] }}</div>
                                    <div class="td-device">{{ $day['device_in'] ?: '' }}</div>
                                @else
                                    <div class="td-time-dash">-- : --</div>
                                @endif
                            </td>
                            <td>
                                @if($day['out'] !== '---')
                                    <div class="td-time">{{ $day['out'] }}</div>
                                    <div class="td-device">{{ $day['device_out'] ?: '' }}</div>
                                @else
                                    <div class="td-time-dash">-- : --</div>
                                @endif
                            </td>
                            <td class="td-mono {{ $hasLate ? 'td-mono-late' : 'td-mono-zero' }}">
                                {{ $hasLate ? $day['late_coming'] : '-' }}
                            </td>
                            <td class="td-mono {{ $hasEarly ? 'td-mono-early' : 'td-mono-zero' }}">
                                {{ $hasEarly ? $day['early_going'] : '-' }}
                            </td>
                            <td class="td-mono {{ $hasOt ? 'td-mono-ot' : 'td-mono-zero' }}">
                                {{ $hasOt ? $day['ot'] : '-' }}
                            </td>
                            <td class="td-mono {{ $hasHrs ? 'td-mono-hrs' : 'td-mono-zero' }}">
                                {{ $hasHrs ? $day['total_hrs'] : '--:--' }}
                            </td>
                            <td class="text-right">
                                <span class="badge {{ $badgeClass }}">{{ $statusText }}</span>
                                @if($day['is_manual'] ?? false)
                                    <span class="badge-manual">MANUAL</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- FOOTER -->
            <table class="footer">
                <tr>
                    <td style="width: 33%;">Generated on: <strong style="color: #475569;">{{ \Carbon\Carbon::now()->format('d M Y, H:i') }}</strong></td>
                    <td style="text-align: center; width: 34%;">Confidential Report &bull; mytime2cloud.com</td>
                    <td style="text-align: right; width: 33%;">Page {{ $loop->iteration }} of {{ $loop->count }}</td>
                </tr>
            </table>
        </div>

        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach
</body>
</html>
