"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getAIFeeds } from '@/lib/endpoint/dashboard';
import Input from '@/components/Theme/Input';


export default function AIFeedAll() {
    const [dailyAttendanceRows, setDailyAttendanceRows] = useState([]);
    const [search, setSearch] = useState("");

    const fetchAllData = async () => {
        try {
            const params = {
                per_page: 50,
            };
            const result = await getAIFeeds(params);
            setDailyAttendanceRows(result.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Filter rows by search
    const filteredRows = search.trim().length === 0
        ? dailyAttendanceRows
        : dailyAttendanceRows.filter(row =>
            (row?.description || "").toLowerCase().includes(search.toLowerCase())
        );

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d)) return '';
        return d.toLocaleString();
    };

    return (
        <>
            <div className="my-1 flex justify-end">
                <Input
                    icon="search"
                    type="text"
                    placeholder="Search description..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full max-w-xs p-2 text-sm"
                />
            </div>
            <div className="overflow-auto">
                <table className="w-full table-fixed text-left border-collapse min-w-[500px]">
                    <colgroup>
                        <col style={{ width: '60px' }} />
                        <col style={{ width: '50%' }} />
                        <col style={{ width: '160px' }} />
                    </colgroup>
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap" style={{ width: '60px' }}>#</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap" style={{ width: '50%' }}>Description</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap" style={{ width: '160px' }}>Created At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                        {filteredRows.length > 0 ? filteredRows.map((row, index) => (
                            <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group relative">
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{index + 1}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 overflow-hidden text-ellipsis" style={{ maxWidth: '1px' }}>{row?.description || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">{formatDate(row?.created_at)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-sm text-slate-600 dark:text-slate-300">No AI feeds found for selected filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
