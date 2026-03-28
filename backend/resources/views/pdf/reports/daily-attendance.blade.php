<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Attendance Report</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm 8mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 8pt;
            color: #1e293b;
            line-height: 1.4;
        }

        /* Header */
        .header {
            display: table;
            width: 100%;
            margin-bottom: 12px;
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 10px;
        }

        .header-left {
            display: table-cell;
            vertical-align: middle;
            width: 70%;
        }

        .header-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            width: 30%;
        }

        .company-name {
            font-size: 16pt;
            font-weight: bold;
            color: #0f172a;
        }

        .report-title {
            font-size: 11pt;
            font-weight: bold;
            color: #0ea5e9;
            margin-top: 2px;
        }

        .report-meta {
            font-size: 7.5pt;
            color: #64748b;
            margin-top: 4px;
        }

        /* Stats Bar */
        .stats-bar {
            display: table;
            width: 100%;
            margin-bottom: 12px;
        }

        .stat-box {
            display: table-cell;
            text-align: center;
            padding: 6px 8px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }

        .stat-value {
            font-size: 14pt;
            font-weight: bold;
        }

        .stat-label {
            font-size: 6.5pt;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-present .stat-value { color: #16a34a; }
        .stat-absent .stat-value { color: #dc2626; }
        .stat-late .stat-value { color: #f59e0b; }
        .stat-leave .stat-value { color: #8b5cf6; }
        .stat-holiday .stat-value { color: #0ea5e9; }
        .stat-weekoff .stat-value { color: #64748b; }

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7.5pt;
        }

        thead th {
            background: #0f172a;
            color: #fff;
            padding: 6px 5px;
            text-align: left;
            font-weight: 600;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            white-space: nowrap;
        }

        thead th:first-child {
            border-radius: 4px 0 0 0;
        }

        thead th:last-child {
            border-radius: 0 4px 0 0;
        }

        tbody td {
            padding: 5px 5px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
        }

        tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        tbody tr:hover {
            background: #f1f5f9;
        }

        /* Status Badges */
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 6.5pt;
            font-weight: bold;
            text-align: center;
            min-width: 28px;
        }

        .badge-P { background: #dcfce7; color: #16a34a; }
        .badge-A { background: #fee2e2; color: #dc2626; }
        .badge-LC { background: #fef3c7; color: #d97706; }
        .badge-EG { background: #fef3c7; color: #d97706; }
        .badge-L { background: #ede9fe; color: #7c3aed; }
        .badge-H { background: #e0f2fe; color: #0284c7; }
        .badge-O { background: #f1f5f9; color: #64748b; }
        .badge-M { background: #fef2f2; color: #ef4444; }
        .badge-V { background: #e0f2fe; color: #0284c7; }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-muted { color: #94a3b8; }

        /* Footer */
        .footer {
            margin-top: 12px;
            text-align: center;
            font-size: 6.5pt;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <div class="company-name">{{ $company->name ?? 'Company' }}</div>
            <div class="report-title">Daily Attendance Report</div>
            <div class="report-meta">
                @foreach($filters as $key => $value)
                    {{ $key }}: {{ $value }} &nbsp;&nbsp;|&nbsp;&nbsp;
                @endforeach
            </div>
        </div>
        <div class="header-right">
            <div style="font-size: 9pt; font-weight: bold; color: #0f172a;">
                {{ \Carbon\Carbon::parse($date)->format('d M Y') }}
            </div>
            <div style="font-size: 7pt; color: #64748b;">
                {{ \Carbon\Carbon::parse($date)->format('l') }}
            </div>
        </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
        <div class="stat-box" style="background: #f0fdf4;">
            <div class="stat-value stat-present">{{ $stats['present'] }}</div>
            <div class="stat-label">Present</div>
        </div>
        <div class="stat-box" style="background: #fef2f2;">
            <div class="stat-value stat-absent">{{ $stats['absent'] }}</div>
            <div class="stat-label">Absent</div>
        </div>
        <div class="stat-box" style="background: #fffbeb;">
            <div class="stat-value stat-late">{{ $stats['late'] }}</div>
            <div class="stat-label">Late</div>
        </div>
        <div class="stat-box" style="background: #faf5ff;">
            <div class="stat-value stat-leave">{{ $stats['leave'] }}</div>
            <div class="stat-label">Leave</div>
        </div>
        <div class="stat-box" style="background: #f0f9ff;">
            <div class="stat-value stat-holiday">{{ $stats['holiday'] }}</div>
            <div class="stat-label">Holiday</div>
        </div>
        <div class="stat-box" style="background: #f8fafc;">
            <div class="stat-value stat-weekoff">{{ $stats['week_off'] }}</div>
            <div class="stat-label">Week Off</div>
        </div>
        <div class="stat-box">
            <div class="stat-value" style="color: #0f172a;">{{ $stats['total'] }}</div>
            <div class="stat-label">Total</div>
        </div>
    </div>

    <!-- Table -->
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Late In</th>
                <th>Early Out</th>
                <th>Total Hrs</th>
                <th>Overtime</th>
                <th class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($records as $index => $record)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td style="font-weight: 600;">
                        {{ $record->employee->first_name ?? '' }} {{ $record->employee->last_name ?? '' }}
                    </td>
                    <td>{{ $record->employee->employee_id ?? '---' }}</td>
                    <td>{{ $record->employee->department->name ?? '---' }}</td>
                    <td>{{ $record->shift->name ?? '---' }}</td>
                    <td>{{ $record->in ?? '---' }}</td>
                    <td>{{ $record->out ?? '---' }}</td>
                    <td>{{ $record->late_coming && $record->late_coming !== '---' ? $record->late_coming : '---' }}</td>
                    <td>{{ $record->early_going && $record->early_going !== '---' ? $record->early_going : '---' }}</td>
                    <td style="font-weight: 600;">{{ $record->total_hrs ?? '---' }}</td>
                    <td>{{ $record->ot && $record->ot !== '00:00' ? $record->ot : '---' }}</td>
                    <td class="text-center">
                        <span class="badge badge-{{ $record->status }}">{{ $record->status }}</span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="12" class="text-center text-muted" style="padding: 20px;">
                        No attendance records found for this date.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
        Generated by MyTime2Cloud &nbsp;&bull;&nbsp; {{ \Carbon\Carbon::now()->format('d M Y, h:i A') }}
    </div>
</body>
</html>
