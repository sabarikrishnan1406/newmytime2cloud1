"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getReportNotifications } from '@/lib/endpoint/automation';
import { getHolidays } from '@/lib/endpoint/holidays';
import { Badge } from '../ui/badge';

const render = (start_date) => {
    // 1. Calculate status based on date
    const today = new Date();
    const startDate = new Date(start_date);

    // If start_date is in the past, use "P", otherwise "A"
    const statusKey = startDate < today ? "P" : "A";

    const statusConfig = {
        "P": {
            label: "Past",
            color: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
        },
        "A": {
            label: "Active",
            color: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        },
    };

    const current = statusConfig[statusKey];

    return (
        <div className="flex items-center">
            <Badge
                variant="outline"
                className={`flex items-center gap-1.5 font-medium px-2.5 py-0.5 rounded-full ${current.color}`}
            >
                {current.label}
            </Badge>
        </div>
    );
}


export default function HolidaysPage() {

    const [holidaysRows, setHolidaysRows] = useState([]);

    const fetchAllData = async () => {

        try {
            const params = {
                page: 1,
                per_page: 1000,
                sortDesc: 'false',
                branch_ids: [],
                search: null, // Only include search if it's not empty
                types: [] // Only fetch absent type notifications for this page
            };
            const result = await getHolidays(params);

            setHolidaysRows(result.data);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);


    return (
        <>
            <div className="overflow-auto">
                <table className="w-full text-left border-collapse min-w-[200px]">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap">Branch</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap">Name</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap">Duration</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap">Total Days</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap">Last Sync</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap">Status</th>
                            {/* <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 text-center whitespace-nowrap">Medium</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                        {holidaysRows.length > 0 ? holidaysRows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group relative">
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{row?.branch?.branch_name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{row?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{row?.start_date || 'N/A'} - {row?.end_date || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{row?.total_days || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{row?.last_sync_at || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{render(row?.start_date)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-600 dark:text-slate-300">No holiday detail found for selected filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
