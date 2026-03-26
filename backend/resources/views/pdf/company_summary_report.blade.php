<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Monthly Attendance Summary</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 12mm 15mm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.4;
            -webkit-font-smoothing: antialiased;
        }

        .page-container {
            width: 100%;
            position: relative;
            page-break-after: always;
        }
        .page-container:last-child {
            page-break-after: auto;
        }

        /* Header */
        .header {
            border-bottom: 2px solid #0f4c81;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }
        .header-table {
            width: 100%;
        }
        .header-title-icon {
            background-color: #0f4c81;
            color: white;
            padding: 4px 6px;
            font-size: 14px;
            display: inline-block;
            border-radius: 2px;
            vertical-align: middle;
        }
        .header-brand {
            font-size: 14px;
            font-weight: bold;
            color: #0f4c81;
            text-transform: uppercase;
            letter-spacing: 1px;
            vertical-align: middle;
            padding-left: 6px;
        }
        .header-subtitle {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            margin-top: 2px;
        }
        .header-date {
            font-size: 10px;
            color: #64748b;
        }
        .period-box {
            display: inline-block;
            background-color: #f1f5f9;
            padding: 6px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            text-align: center;
        }
        .period-label {
            font-size: 9px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .period-value {
            font-size: 13px;
            font-weight: bold;
            color: #0f4c81;
        }

        /* KPI Cards */
        .kpi-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 5px 0;
            margin-bottom: 10px;
        }
        .kpi-cell {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 6px 8px;
            border-radius: 3px;
            vertical-align: top;
            width: 11.11%;
        }
        .kpi-label {
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
        }
        .kpi-value {
            font-size: 16px;
            font-weight: bold;
            color: #1e293b;
            margin-top: 4px;
        }
        .kpi-trend {
            font-size: 8px;
            font-weight: bold;
            margin-top: 2px;
        }
        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }
        .trend-flat { color: #94a3b8; }

        /* Chart Section */
        .chart-section {
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            padding: 8px 10px;
            margin-bottom: 10px;
        }
        .chart-header {
            margin-bottom: 6px;
        }
        .chart-title {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1e293b;
        }
        .chart-subtitle {
            font-size: 9px;
            color: #64748b;
        }
        .legend-dot {
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 1px;
            margin-right: 3px;
            vertical-align: middle;
        }
        .legend-text {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            color: #64748b;
            vertical-align: middle;
        }

        /* Bar chart */
        .bar-chart-container {
            width: 100%;
            height: 90px;
            border-left: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
            position: relative;
        }
        .bar-chart-table {
            width: 100%;
            height: 90px;
            border-collapse: collapse;
        }
        .bar-chart-table td {
            vertical-align: bottom;
            text-align: center;
            padding: 0 1px;
        }
        .bar-present { background-color: #0f4c81; }
        .bar-late { background-color: #f59e0b; }
        .bar-absent { background-color: #e2e8f0; }
        .bar-label {
            font-size: 8px;
            color: #64748b;
            font-family: monospace;
            text-align: center;
        }

        /* Bottom sections */
        .bottom-section-table {
            width: 100%;
            border-collapse: collapse;
        }
        .bottom-left {
            width: 50%;
            vertical-align: top;
            padding-right: 8px;
        }
        .bottom-right {
            width: 50%;
            vertical-align: top;
            padding-left: 8px;
        }

        /* Department Donut */
        .dept-section {
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            padding: 10px;
            height: 100%;
        }
        .section-title {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1e293b;
            margin-bottom: 2px;
        }
        .section-subtitle {
            font-size: 9px;
            color: #64748b;
            margin-bottom: 8px;
        }
        .dept-bar-track {
            width: 100%;
            height: 5px;
            background-color: #f1f5f9;
            border-radius: 3px;
            margin-top: 2px;
        }
        .dept-bar-fill {
            height: 5px;
            border-radius: 3px;
        }
        .dept-dot {
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            margin-right: 4px;
            vertical-align: middle;
        }
        .dept-colors-0 { background-color: #0f4c81; }
        .dept-colors-1 { background-color: #f59e0b; }
        .dept-colors-2 { background-color: #10b981; }
        .dept-colors-3 { background-color: #cbd5e1; }

        /* Punctuality */
        .punct-section {
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
            height: 100%;
        }
        .punct-header {
            background-color: #f8fafc;
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .punct-body {
            padding: 6px;
        }
        .punct-table {
            width: 100%;
            border-collapse: collapse;
        }
        .punct-table td {
            padding: 5px 6px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }
        .punct-table tr:last-child td {
            border-bottom: none;
        }
        .punct-rank {
            font-weight: bold;
            font-size: 11px;
            width: 20px;
        }
        .punct-rank-gold { color: #f59e0b; }
        .punct-rank-gray { color: #94a3b8; }
        .punct-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            text-align: center;
            line-height: 28px;
            font-size: 9px;
            font-weight: bold;
            display: inline-block;
        }
        .punct-name {
            font-weight: bold;
            font-size: 10px;
            color: #1e293b;
        }
        .punct-dept {
            font-size: 9px;
            color: #64748b;
        }
        .punct-badge {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            font-size: 9px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
        }

        /* Footer */
        .footer {
            margin-top: auto;
            padding-top: 6px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #64748b;
        }
        .footer-table {
            width: 100%;
        }

        /* Page 2 - Attention Required */
        .attention-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 8px;
        }
        .attention-badge {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 2px 8px;
            border-radius: 3px;
            display: inline-block;
            vertical-align: middle;
            margin-left: 6px;
        }
        .attention-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        .attention-left {
            width: 50%;
            vertical-align: top;
            padding-right: 8px;
        }
        .attention-right {
            width: 50%;
            vertical-align: top;
            padding-left: 8px;
        }
        .attention-box-red {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 10px;
        }
        .attention-box-amber {
            background-color: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 6px;
            padding: 10px;
        }
        .attention-box-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 8px;
        }
        .attention-box-title-red { color: #991b1b; }
        .attention-box-title-amber { color: #92400e; }
        .attention-card {
            background-color: white;
            padding: 6px 8px;
            border-radius: 4px;
            margin-bottom: 6px;
        }
        .attention-card-red { border: 1px solid #fecaca; }
        .attention-card-amber { border: 1px solid #fde68a; }
        .attention-card:last-child { margin-bottom: 0; }
        .attention-card-table {
            width: 100%;
            border-collapse: collapse;
        }
        .attention-value-red {
            font-size: 14px;
            font-weight: bold;
            color: #ef4444;
        }
        .attention-value-amber {
            font-size: 14px;
            font-weight: bold;
            color: #f59e0b;
        }
        .attention-sublabel-red {
            font-size: 8px;
            color: rgba(220, 38, 38, 0.7);
            font-weight: 500;
        }
        .attention-sublabel-amber {
            font-size: 8px;
            color: rgba(217, 119, 6, 0.7);
            font-weight: 500;
        }

        /* Detailed Table */
        .detail-section {
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
        }
        .detail-header {
            background-color: #f8fafc;
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-header-label {
            font-size: 9px;
            color: #64748b;
            font-weight: 500;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-table thead th {
            background-color: #f1f5f9;
            color: #0f4c81;
            font-size: 9px;
            font-weight: bold;
            padding: 6px 8px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-table thead th:first-child {
            text-align: left;
            width: 18%;
        }
        .detail-table thead th:last-child {
            text-align: right;
        }
        .detail-table tbody td {
            padding: 5px 8px;
            font-size: 10px;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }
        .detail-table tbody td:first-child {
            text-align: left;
        }
        .detail-table tbody td:last-child {
            text-align: right;
        }
        .detail-table tbody tr:last-child td {
            border-bottom: none;
        }
        .emp-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            line-height: 24px;
            font-size: 8px;
            font-weight: bold;
            vertical-align: middle;
            margin-right: 6px;
        }
        .emp-name {
            font-weight: bold;
            font-size: 10px;
            color: #1e293b;
            vertical-align: middle;
        }
        .emp-dept-inline {
            font-size: 9px;
            color: #64748b;
            display: block;
            margin-left: 30px;
        }

        .text-success { color: #10b981; }
        .text-danger { color: #ef4444; }
        .text-warning { color: #f59e0b; }
        .text-muted { color: #64748b; }
        .font-bold { font-weight: bold; }
        .font-medium { font-weight: 500; }
    </style>
</head>
<body>
    {{-- ==================== PAGE 1 ==================== --}}
    <div class="page-container">
        {{-- Header --}}
        <table class="header-table" style="margin-bottom:4px;">
            <tr>
                <td style="vertical-align: bottom;">
                    <div style="margin-bottom:4px;">
                        <span class="header-title-icon">&#9632;</span>
                        <span class="header-brand">{{ $companyName ?? 'WorkDay Analytics' }}</span>
                    </div>
                    <div class="header-subtitle">Monthly Attendance Summary</div>
                    <div class="header-date">Generated on {{ $generatedDate }}</div>
                </td>
                <td style="text-align: right; vertical-align: bottom;">
                    <div class="period-box">
                        <div class="period-label">Reporting Period</div>
                        <div class="period-value">{{ $periodLabel }}</div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="header" style="margin-bottom:10px;"></div>

        {{-- KPI Cards --}}
        <table class="kpi-table">
            <tr>
                @foreach($stats as $stat)
                <td class="kpi-cell">
                    <div class="kpi-label">{{ $stat['title'] ?? '---' }}</div>
                    <div class="kpi-value">{{ $stat['value'] ?? '0' }}</div>
                    @php
                        $trend = $stat['trend'] ?? '0%';
                        $trendUp = $stat['trendUp'] ?? false;
                        $trendClass = $trend === '0%' ? 'trend-flat' : ($trendUp ? 'trend-up' : 'trend-down');
                        $arrow = $trend === '0%' ? '—' : ($trendUp ? '&#9650;' : '&#9660;');
                    @endphp
                    <div class="kpi-trend {{ $trendClass }}">
                        {!! $arrow !!} {{ $trend }}
                    </div>
                </td>
                @endforeach
            </tr>
        </table>

        {{-- Attendance Trends Chart --}}
        <div class="chart-section">
            <table style="width:100%; margin-bottom:4px;">
                <tr>
                    <td>
                        <div class="chart-title">Attendance Trends</div>
                        <div class="chart-subtitle">Daily breakdown (Present vs Late vs Absent)</div>
                    </td>
                    <td style="text-align:right;">
                        <span class="legend-dot" style="background-color:#0f4c81;"></span>
                        <span class="legend-text">Present</span>
                        &nbsp;&nbsp;
                        <span class="legend-dot" style="background-color:#f59e0b;"></span>
                        <span class="legend-text">Late</span>
                        &nbsp;&nbsp;
                        <span class="legend-dot" style="background-color:#e2e8f0;"></span>
                        <span class="legend-text">Absent</span>
                    </td>
                </tr>
            </table>

            @if(count($hourlyTrends) > 0)
            <table class="bar-chart-table">
                <tr>
                    @foreach($hourlyTrends as $bar)
                    @php
                        $present = (int)($bar['present'] ?? 0);
                        $late = (int)($bar['late'] ?? 0);
                        $absent = (int)($bar['absent'] ?? 0);
                        $total = max(1, $present + $late + $absent);
                        $pPct = round(($present / $total) * 100);
                        $lPct = round(($late / $total) * 100);
                        $aPct = 100 - $pPct - $lPct;
                        $barHeight = 80; // px
                    @endphp
                    <td style="vertical-align:bottom; width:{{ 100 / count($hourlyTrends) }}%;">
                        <div style="height:{{ $barHeight }}px; display:flex; flex-direction:column-reverse; gap:1px;">
                            <div class="bar-present" style="height:{{ $pPct }}%; width:100%;"></div>
                            <div class="bar-late" style="height:{{ $lPct }}%; width:100%;"></div>
                            <div class="bar-absent" style="height:{{ $aPct }}%; width:100%;"></div>
                        </div>
                    </td>
                    @endforeach
                </tr>
            </table>
            <table style="width:100%; margin-top:2px;">
                <tr>
                    @foreach($hourlyTrends as $idx => $bar)
                    @if($idx % 2 === 0)
                    <td class="bar-label" style="width:{{ 100 / count($hourlyTrends) }}%;">{{ $bar['label'] ?? '' }}</td>
                    @else
                    <td style="width:{{ 100 / count($hourlyTrends) }}%;"></td>
                    @endif
                    @endforeach
                </tr>
            </table>
            @else
            <p style="text-align:center; color:#64748b; font-size:10px; padding:20px 0;">No trend data available.</p>
            @endif
        </div>

        {{-- Bottom Section: Department + Punctuality --}}
        <table class="bottom-section-table">
            <tr>
                {{-- Department Wise Analytics --}}
                <td class="bottom-left">
                    <div class="dept-section">
                        <div class="section-title">Department Wise Analytics</div>
                        <div class="section-subtitle">Attendance percentage distribution</div>

                        @if(count($departmentBreakdown) > 0)
                        <table style="width:100%; margin-top:4px;">
                            <tr>
                                {{-- Donut SVG --}}
                                <td style="width:120px; vertical-align:middle; text-align:center;">
                                    @php
                                        $deptSlice = array_slice($departmentBreakdown, 0, 4);
                                        $deptColors = ['#0f4c81', '#f59e0b', '#10b981', '#cbd5e1'];
                                        $offset = 0;
                                    @endphp
                                    <svg width="110" height="110" viewBox="0 0 36 36" style="transform:rotate(-90deg);">
                                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f1f5f9" stroke-width="4.5"/>
                                        @foreach($deptSlice as $di => $dept)
                                        @php
                                            $pct = (float)($dept['percentage'] ?? 0);
                                        @endphp
                                        <circle cx="18" cy="18" r="15.9" fill="transparent"
                                            stroke="{{ $deptColors[$di] }}" stroke-width="4.5"
                                            stroke-dasharray="{{ $pct }} {{ 100 - $pct }}"
                                            stroke-dashoffset="{{ -$offset }}"/>
                                        @php $offset += $pct; @endphp
                                        @endforeach
                                    </svg>
                                    <div style="margin-top:-65px; position:relative; text-align:center;">
                                        @php
                                            $overallPct = count($deptSlice) > 0
                                                ? round(array_sum(array_column($deptSlice, 'percentage')) / count($deptSlice))
                                                : 0;
                                        @endphp
                                        <span style="font-size:18px; font-weight:bold; color:#1e293b;">{{ $overallPct }}%</span><br>
                                        <span style="font-size:8px; font-weight:bold; color:#64748b; text-transform:uppercase;">Overall</span>
                                    </div>
                                    <div style="height:35px;"></div>
                                </td>
                                {{-- Progress Bars --}}
                                <td style="vertical-align:middle; padding-left:12px;">
                                    @foreach($deptSlice as $di => $dept)
                                    <div style="margin-bottom:8px;">
                                        <table style="width:100%; margin-bottom:2px;">
                                            <tr>
                                                <td style="font-size:9px;">
                                                    <span class="dept-dot dept-colors-{{ $di }}"></span>
                                                    <span style="font-weight:bold; color:#1e293b;">{{ $dept['name'] ?? 'Unknown' }}</span>
                                                </td>
                                                <td style="text-align:right; font-size:9px; color:#64748b;">{{ $dept['percentage'] ?? 0 }}%</td>
                                            </tr>
                                        </table>
                                        <div class="dept-bar-track">
                                            <div class="dept-bar-fill dept-colors-{{ $di }}" style="width:{{ min(100, $dept['percentage'] ?? 0) }}%;"></div>
                                        </div>
                                    </div>
                                    @endforeach
                                </td>
                            </tr>
                        </table>
                        @else
                        <p style="font-size:10px; color:#64748b;">No department data available.</p>
                        @endif
                    </div>
                </td>

                {{-- Top Punctuality --}}
                <td class="bottom-right">
                    <div class="punct-section">
                        <div class="punct-header">
                            <table style="width:100%;">
                                <tr>
                                    <td>
                                        <div class="section-title" style="margin-bottom:0;">Top Punctuality</div>
                                        <div style="font-size:9px; color:#64748b;">100% On-time employees</div>
                                    </td>
                                    <td style="text-align:right; color:#f59e0b; font-size:16px;">&#9733;</td>
                                </tr>
                            </table>
                        </div>
                        <div class="punct-body">
                            @if(count($punctualityTop) > 0)
                            <table class="punct-table">
                                @foreach($punctualityTop as $pi => $staff)
                                @php
                                    $rankClass = $pi < 3 ? 'punct-rank-gold' : 'punct-rank-gray';
                                    $initial = collect(explode(' ', $staff['name'] ?? 'NA'))
                                        ->filter()->take(2)->map(fn($p) => strtoupper(substr($p, 0, 1)))->join('');
                                    $avatarColors = ['#dbeafe;color:#2563eb', '#d1fae5;color:#059669', '#fef3c7;color:#d97706', '#f1f5f9;color:#0f4c81', '#ede9fe;color:#7c3aed'];
                                    $avatarBg = $avatarColors[$pi % count($avatarColors)];
                                @endphp
                                <tr>
                                    <td class="punct-rank {{ $rankClass }}">#{{ $pi + 1 }}</td>
                                    <td style="width:34px;">
                                        @if(!empty($staff['img']))
                                        <img src="{{ $staff['img'] }}" style="width:28px;height:28px;border-radius:50%;border:1px solid #e2e8f0;" />
                                        @else
                                        <span class="punct-avatar" style="background-color:{{ $avatarBg }};">{{ $initial ?: 'NA' }}</span>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="punct-name">{{ $staff['name'] ?? 'Unknown' }}</div>
                                        <div class="punct-dept">{{ $staff['dept'] ?? '---' }}</div>
                                    </td>
                                    <td style="text-align:right;">
                                        <span class="punct-badge">{{ $staff['score'] ?? '0%' }} On-Time</span>
                                    </td>
                                </tr>
                                @endforeach
                            </table>
                            @else
                            <p style="font-size:10px; color:#64748b; padding:10px;">No punctuality data available.</p>
                            @endif
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Footer --}}
        <table class="footer-table" style="margin-top:8px;">
            <tr>
                <td class="footer">Confidential Document &bull; Internal Use Only</td>
                <td class="footer" style="text-align:right;">Page 1 of 2</td>
            </tr>
        </table>
    </div>

    {{-- ==================== PAGE 2 ==================== --}}
    <div class="page-container">
        {{-- Header --}}
        <table class="header-table" style="margin-bottom:4px;">
            <tr>
                <td style="vertical-align: bottom;">
                    <div style="margin-bottom:4px;">
                        <span class="header-title-icon">&#9632;</span>
                        <span class="header-brand">{{ $companyName ?? 'WorkDay Analytics' }}</span>
                    </div>
                    <div class="header-subtitle">Monthly Attendance Summary</div>
                    <div class="header-date">Generated on {{ $generatedDate }}</div>
                </td>
                <td style="text-align: right; vertical-align: bottom;">
                    <div class="period-box">
                        <div class="period-label">Reporting Period</div>
                        <div class="period-value">{{ $periodLabel }}</div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="header" style="margin-bottom:10px;"></div>

        {{-- Attention Required --}}
        @if(count($highAbsenteeism) > 0 || count($frequentLateIns) > 0)
        <div style="margin-bottom:10px;">
            <div class="attention-title">
                &#9888; Attention Required
                <span class="attention-badge">Action Needed</span>
            </div>

            <table class="attention-grid">
                <tr>
                    <td class="attention-left">
                        <div class="attention-box-red">
                            <div class="attention-box-title attention-box-title-red">
                                &#128683; High Absenteeism (&gt;15% Absence)
                            </div>
                            @forelse($highAbsenteeism as $absent)
                            @php
                                $initial = collect(explode(' ', $absent['name'] ?? 'NA'))
                                    ->filter()->take(2)->map(fn($p) => strtoupper(substr($p, 0, 1)))->join('');
                            @endphp
                            <div class="attention-card attention-card-red">
                                <table class="attention-card-table">
                                    <tr>
                                        <td style="width:34px; vertical-align:middle;">
                                            @if(!empty($absent['img']))
                                            <img src="{{ $absent['img'] }}" style="width:28px;height:28px;border-radius:50%;border:1px solid #fecaca;" />
                                            @else
                                            <span class="punct-avatar" style="background-color:#fef2f2;color:#ef4444;">{{ $initial }}</span>
                                            @endif
                                        </td>
                                        <td style="vertical-align:middle;">
                                            <div style="font-weight:bold; font-size:10px; color:#1e293b;">{{ $absent['name'] }}</div>
                                            <div style="font-size:9px; color:#64748b;">{{ $absent['department'] ?? '---' }}</div>
                                        </td>
                                        <td style="text-align:right; vertical-align:middle;">
                                            <div class="attention-value-red">{{ $absent['absent_days'] }} Days</div>
                                            <div class="attention-sublabel-red">ABSENT</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            @empty
                            <p style="font-size:10px; color:#991b1b;">No high absenteeism found.</p>
                            @endforelse
                        </div>
                    </td>
                    <td class="attention-right">
                        <div class="attention-box-amber">
                            <div class="attention-box-title attention-box-title-amber">
                                &#128337; Frequent Late Ins (&gt;3 Occurrences)
                            </div>
                            @forelse($frequentLateIns as $late)
                            @php
                                $initial = collect(explode(' ', $late['name'] ?? 'NA'))
                                    ->filter()->take(2)->map(fn($p) => strtoupper(substr($p, 0, 1)))->join('');
                            @endphp
                            <div class="attention-card attention-card-amber">
                                <table class="attention-card-table">
                                    <tr>
                                        <td style="width:34px; vertical-align:middle;">
                                            @if(!empty($late['img']))
                                            <img src="{{ $late['img'] }}" style="width:28px;height:28px;border-radius:50%;border:1px solid #fde68a;" />
                                            @else
                                            <span class="punct-avatar" style="background-color:#fffbeb;color:#f59e0b;">{{ $initial }}</span>
                                            @endif
                                        </td>
                                        <td style="vertical-align:middle;">
                                            <div style="font-weight:bold; font-size:10px; color:#1e293b;">{{ $late['name'] }}</div>
                                            <div style="font-size:9px; color:#64748b;">{{ $late['department'] ?? '---' }}</div>
                                        </td>
                                        <td style="text-align:right; vertical-align:middle;">
                                            <div class="attention-value-amber">{{ $late['late_days'] }} Times</div>
                                            <div class="attention-sublabel-amber">LATE IN</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            @empty
                            <p style="font-size:10px; color:#92400e;">No frequent late ins found.</p>
                            @endforelse
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        @endif

        {{-- Detailed Employee Statistics --}}
        <div class="detail-section">
            <div class="detail-header">
                <table style="width:100%;">
                    <tr>
                        <td class="section-title" style="margin-bottom:0;">Detailed Employee Statistics</td>
                        <td style="text-align:right;" class="detail-header-label">Full report for active employees</td>
                    </tr>
                </table>
            </div>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th style="text-align:left;">Employee</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Leave</th>
                        <th>Manual Logs</th>
                        <th>Avg Check-In</th>
                        <th>Avg Check-Out</th>
                        <th>Late In</th>
                        <th>Early Out</th>
                        <th>Avg Working Hrs</th>
                        <th style="text-align:right;">Working Hrs</th>
                        <th style="text-align:right;">Performance</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($employeeDetails as $emp)
                    @php
                        $initial = collect(explode(' ', $emp['name'] ?? 'NA'))
                            ->filter()->take(2)->map(fn($p) => strtoupper(substr($p, 0, 1)))->join('');
                        $perf = (float)($emp['performance'] ?? 0);
                        $perfClass = $perf >= 90 ? 'text-success' : ($perf >= 75 ? 'text-warning' : 'text-danger');
                        $absentDays = (int)($emp['absent'] ?? 0);
                        $absentClass = $absentDays > 10 ? 'text-danger font-bold' : 'text-muted';
                        $manualLogs = (int)($emp['manual_logs'] ?? 0);
                        $manualClass = $manualLogs > 0 ? 'text-warning font-medium' : 'text-muted';
                        $lateIn = (int)($emp['late_in'] ?? 0);
                        $lateInClass = $lateIn > 0 ? 'text-warning font-medium' : 'text-success font-bold';
                        $earlyOut = (int)($emp['early_out'] ?? 0);
                        $earlyOutClass = $earlyOut > 0 ? 'text-warning font-medium' : 'text-muted';
                        $avgCheckin = $emp['avg_checkin'] ?? '---';
                        $checkinClass = '';
                        $workingHrs = $emp['total_hours'] ?? 0;
                        $requiredHrs = $emp['required_hours'] ?? 0;
                        $workingHrsClass = $workingHrs < $requiredHrs ? 'text-danger' : '';
                        $avatarColors = ['#dbeafe;color:#2563eb', '#d1fae5;color:#059669', '#fef3c7;color:#d97706', '#f1f5f9;color:#0f4c81', '#ede9fe;color:#7c3aed'];
                    @endphp
                    <tr>
                        <td>
                            @if(!empty($emp['img']))
                            <img src="{{ $emp['img'] }}" style="width:24px;height:24px;border-radius:50%;border:1px solid #e2e8f0;vertical-align:middle;margin-right:6px;" />
                            @else
                            <span class="emp-avatar" style="background-color:{{ $avatarColors[$loop->index % count($avatarColors)] }};">{{ $initial }}</span>
                            @endif
                            <span class="emp-name">{{ $emp['name'] }}</span>
                            <span class="emp-dept-inline">{{ $emp['department'] ?? '---' }}</span>
                        </td>
                        <td class="font-medium">{{ $emp['present'] ?? 0 }}</td>
                        <td class="{{ $absentClass }}">{{ $emp['absent'] ?? 0 }}</td>
                        <td class="text-muted">{{ $emp['leave'] ?? 0 }}</td>
                        <td class="{{ $manualClass }}">{{ $emp['manual_logs'] ?? 0 }}</td>
                        <td>{{ $emp['avg_checkin'] ?? '---' }}</td>
                        <td>{{ $emp['avg_checkout'] ?? '---' }}</td>
                        <td class="{{ $lateInClass }}">{{ $emp['late_in'] ?? 0 }}</td>
                        <td class="{{ $earlyOutClass }}">{{ $emp['early_out'] ?? 0 }}</td>
                        <td>{{ $emp['avg_working_hrs'] ?? '0.00' }}</td>
                        <td style="text-align:right;" class="{{ $workingHrsClass }} font-medium">
                            {{ $emp['total_hours'] ?? 0 }}<span class="text-muted" style="font-weight:normal;">/{{ $emp['required_hours'] ?? 0 }}</span>
                        </td>
                        <td style="text-align:right;" class="{{ $perfClass }} font-bold">{{ $emp['performance'] ?? 0 }}%</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="12" style="text-align:center; padding:15px; color:#64748b;">No employee data available for the selected filters.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- Footer --}}
        <table class="footer-table" style="margin-top:8px;">
            <tr>
                <td class="footer">Confidential Document &bull; Internal Use Only</td>
                <td class="footer" style="text-align:right;">Page 2 of 2</td>
            </tr>
        </table>
    </div>
</body>
</html>
