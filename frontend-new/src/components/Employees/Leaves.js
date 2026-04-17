"use client";

import React, { useState, useEffect } from "react";
import { getLeavesRequest } from "@/lib/endpoint/leaves";
import { getEmployeeGovernmentHolidays } from "@/lib/endpoint/holidays";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { SuccessDialog } from "@/components/SuccessDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Banknote } from "lucide-react";
import { updateBank } from "@/lib/api";
import { parseApiError } from "@/lib/utils";

const Bank = ({ employee_id, bank, payload }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [globalError, setGlobalError] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [viewMonth, setViewMonth] = useState(() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        if (!employee_id) return;
        getLeavesRequest({ employee_id, per_page: 100 })
            .then(r => setLeaves(Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : []))
            .catch(() => setLeaves([]));
    }, [employee_id]);

    useEffect(() => {
        const countryCode = (payload?.branch?.country || "AE").toUpperCase().trim();
        const year = viewMonth.year;
        console.group(`[Leaves Calendar] employee=${employee_id} branch=${payload?.branch?.branch_name} country=${countryCode} year=${year}`);
        console.log("payload.branch:", payload?.branch);

        const loadHolidays = async () => {
            let govHolidays = [];
            let hasCustom = false;

            if (employee_id) {
                try {
                    const empGovData = await getEmployeeGovernmentHolidays(employee_id, {
                        country_code: countryCode,
                        year,
                    });
                    console.log("getEmployeeGovernmentHolidays →", empGovData);
                    if (empGovData?.success) {
                        hasCustom = empGovData.is_custom === true;
                        const list = empGovData.data || [];
                        govHolidays = (hasCustom ? list.filter(h => h.is_enabled) : list)
                            .map(h => ({ ...h, id: h.holiday_id || h.id, country_code: countryCode }));
                    }
                } catch (e) {
                    console.log("getEmployeeGovernmentHolidays failed:", e?.response?.status, e?.message);
                }
            }

            if (!hasCustom && govHolidays.length === 0) {
                try {
                    const { data: govData } = await api.get("/government-holidays", {
                        params: { country_code: countryCode, year },
                    });
                    console.log("/government-holidays →", govData);
                    if (govData?.success && Array.isArray(govData?.data)) {
                        govHolidays = govData.data;
                    }
                } catch (e) {
                    console.log("/government-holidays failed:", e?.response?.status, e?.message);
                }
            }

            console.log("final govHolidays count:", govHolidays.length, govHolidays);
            console.groupEnd();
            setHolidays(govHolidays);
        };

        loadHolidays();
    }, [viewMonth.year, employee_id, payload?.branch?.country]);

    const monthName = new Date(viewMonth.year, viewMonth.month, 1)
        .toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const firstDay = new Date(viewMonth.year, viewMonth.month, 1).getDay();
    const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewMonth.year, viewMonth.month, 0).getDate();
    const today = new Date();
    const isToday = (d) => today.getFullYear() === viewMonth.year
        && today.getMonth() === viewMonth.month && today.getDate() === d;
    const holidayMap = holidays.reduce((acc, h) => {
        const raw = h.date || h.start_date || h.start?.date || h.holiday_date || h.startDate;
        if (!raw) return acc;
        const dt = new Date(raw);
        if (isNaN(dt)) return acc;
        if (dt.getFullYear() === viewMonth.year && dt.getMonth() === viewMonth.month) {
            acc[dt.getDate()] = { ...h, _name: h.name || h.localName || h.summary || h.title || "Holiday" };
        }
        return acc;
    }, {});
    const leaveDayMap = leaves.reduce((acc, l) => {
        if (l.status !== 1) return acc;
        const from = new Date(l.from_date || l.start_date);
        const to = new Date(l.to_date || l.end_date || from);
        if (isNaN(from)) return acc;
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
            if (d.getFullYear() === viewMonth.year && d.getMonth() === viewMonth.month) {
                acc[d.getDate()] = true;
            }
        }
        return acc;
    }, {});
    const prevMonth = () => setViewMonth(v => {
        const m = v.month - 1;
        return m < 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: m };
    });
    const nextMonth = () => setViewMonth(v => {
        const m = v.month + 1;
        return m > 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: m };
    });

    // Totals from leave_group on payload
    const totals = {
        annual: Number(payload?.leave_group?.annual_leaves ?? payload?.annual_leaves ?? 0),
        sick: Number(payload?.leave_group?.sick_leaves ?? payload?.sick_leaves ?? 0),
        casual: Number(payload?.leave_group?.casual_leaves ?? payload?.casual_leaves ?? 0),
    };
    const used = leaves.filter(l => l.status === 1).reduce((acc, l) => {
        const t = (l.leave_type?.name || l.leave_group_type?.leave_type?.name || '').toLowerCase();
        const days = Number(l.total_days || l.days || 0);
        if (t.includes('annual')) acc.annual += days;
        else if (t.includes('sick')) acc.sick += days;
        else if (t.includes('casual')) acc.casual += days;
        return acc;
    }, { annual: 0, sick: 0, casual: 0 });
    const left = {
        annual: Math.max(0, totals.annual - used.annual),
        sick: Math.max(0, totals.sick - used.sick),
        casual: Math.max(0, totals.casual - used.casual),
    };
    const deg = (l, t) => t > 0 ? Math.round((l / t) * 360) : 0;

    const form = useForm({
        defaultValues: {
            account_title: bank?.account_title || "",
            bank_name: bank?.bank_name || "",
            account_no: bank?.account_no || "",
            iban: bank?.iban || "",
            address: bank?.address || "",
        },
    });

    const { handleSubmit, formState } = form;
    const { isSubmitting } = formState;

    const handleCancel = () => router.push(`/employees`);

    const onSubmit = async (data) => {
        setGlobalError(null);
        try {
            const finalPayload = {
                account_title: data.account_title,
                bank_name: data.bank_name,
                account_no: data.account_no,
                iban: data.iban,
                address: data.address,

                employee_id: employee_id || "",
            };

            await updateBank(finalPayload);

            setOpen(true);

            await new Promise(resolve => setTimeout(resolve, 2000));

            setOpen(false);

            router.push(`/employees`);
        } catch (error) {
            setGlobalError(parseApiError(error));
        }
    };

    return (<>

        <div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Leaves
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Track leave balances, monitor absence trends, and manage time-off requests.
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(160px,auto)]">
            <div
                className="glass-card p-6 flex flex-col items-center justify-center rounded-lg relative overflow-hidden group">
                <div className="w-full flex justify-between items-start absolute top-4 left-0 px-5">
                    <span className="text-xs font-bold text-[#9db0b9] uppercase tracking-wider">Annual</span>
                    <span className="material-symbols-outlined text-[#5f717a]">beach_access</span>
                </div>
                <div className="relative size-24 mt-4">
                    <div className="size-full rounded-full"
                        style={{ background: `conic-gradient(#13a4ec ${deg(left.annual, totals.annual)}deg, #283339 0deg)` }}
                    ></div>
                    <div className="absolute inset-2 bg-[#141d22] rounded-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{left.annual}</span>
                        <span className="text-[10px] text-[#9db0b9] uppercase">Left</span>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <span className="text-sm text-[#9db0b9]">of {totals.annual} Days</span>
                </div>
            </div>
            <div
                className="glass-card p-6 flex flex-col items-center justify-center rounded-lg relative overflow-hidden group">
                <div className="w-full flex justify-between items-start absolute top-4 left-0 px-5">
                    <span className="text-xs font-bold text-[#9db0b9] uppercase tracking-wider">Sick</span>
                    <span className="material-symbols-outlined text-[#5f717a]">medication</span>
                </div>
                <div className="relative size-24 mt-4">
                    <div className="size-full rounded-full"
                        style={{ background: `conic-gradient(#ec4899 ${deg(left.sick, totals.sick)}deg, #283339 0deg)` }}
                    ></div>
                    <div className="absolute inset-2 bg-[#141d22] rounded-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{left.sick}</span>
                        <span className="text-[10px] text-[#9db0b9] uppercase">Left</span>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <span className="text-sm text-[#9db0b9]">of {totals.sick} Days</span>
                </div>
            </div>
            <div
                className="glass-card p-6 flex flex-col items-center justify-center rounded-lg relative overflow-hidden group">
                <div className="w-full flex justify-between items-start absolute top-4 left-0 px-5">
                    <span className="text-xs font-bold text-[#9db0b9] uppercase tracking-wider">Casual</span>
                    <span className="material-symbols-outlined text-[#5f717a]">event_busy</span>
                </div>
                <div className="relative size-24 mt-4">
                    <div className="size-full rounded-full"

                        style={{ background: `conic-gradient(#f59e0b ${deg(left.casual, totals.casual)}deg, #283339 0deg)` }}
                    ></div>
                    <div className="absolute inset-2 bg-[#141d22] rounded-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{left.casual}</span>
                        <span className="text-[10px] text-[#9db0b9] uppercase">Left</span>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <span className="text-sm text-[#9db0b9]">of {totals.casual} Days</span>
                </div>
            </div>
            <div
                className="glass-card p-6 flex flex-col items-center justify-center rounded-lg relative overflow-hidden group cursor-pointer hover:bg-primary/5 transition-colors border border-dashed border-primary/20 hover:border-primary/50">
                <div
                    className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">add</span>
                </div>
                <span className="text-lg font-bold text-white">New Request</span>
                <span className="text-xs text-[#9db0b9] text-center mt-1">Submit a new leave application</span>
            </div>
            <div
                className="glass-card col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-6 rounded-lg flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">calendar_month</span>
                        Leave Calendar
                    </h3>
                    <div
                        className="flex items-center gap-2 bg-[#111618] rounded-md p-1 border border-[#283339]">
                        <button onClick={prevMonth} className="p-1 hover:text-white text-[#9db0b9] transition-colors"><span
                            className="material-symbols-outlined text-[16px]">chevron_left</span></button>
                        <span className="text-xs font-bold text-white px-2">{monthName}</span>
                        <button onClick={nextMonth} className="p-1 hover:text-white text-[#9db0b9] transition-colors"><span
                            className="material-symbols-outlined text-[16px]">chevron_right</span></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 flex-1 text-center">
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                        <div key={d} className="text-[10px] font-bold text-[#5f717a] uppercase py-2">{d}</div>
                    ))}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`p${i}`} className="p-2 text-sm text-[#283339]">{daysInPrevMonth - firstDay + i + 1}</div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const holiday = holidayMap[day];
                        const isLeave = leaveDayMap[day];
                        const todayCls = isToday(day) ? "bg-white/10 border border-white/20 font-bold text-white" : "";
                        if (holiday) {
                            return (
                                <div key={day} title={holiday._name}
                                    className="relative p-2 text-sm text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 rounded cursor-pointer">
                                    {day}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 bg-amber-500 rounded-full"></div>
                                </div>
                            );
                        }
                        if (isLeave) {
                            return (
                                <div key={day} className="relative p-2 rounded bg-primary/20 text-white font-bold cursor-pointer border border-primary/30">
                                    {day}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 bg-primary rounded-full"></div>
                                </div>
                            );
                        }
                        return (
                            <div key={day} className={`p-2 text-sm rounded cursor-pointer ${todayCls || "text-[#9db0b9] hover:bg-white/5"}`}>
                                {day}
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#283339] text-xs">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary"></div>
                        <span className="text-[#9db0b9]">Annual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-amber-500"></div>
                        <span className="text-[#9db0b9]">Holiday</span>
                    </div>
                </div>
            </div>
            <div
                className="glass-card col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-lg flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-[#283339]">
                    <h3 className="text-lg font-bold text-white">Recent Requests</h3>
                    <button className="text-xs text-primary hover:text-primary/80 transition-colors">View
                        History</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-[#5f717a] border-b border-[#283339] bg-[#141d22]">
                                <th className="px-6 py-3 font-semibold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 font-semibold uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 font-semibold uppercase tracking-wider">Days</th>
                                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right">
                                    Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#283339]">
                            {leaves.slice(0, 10).map((l) => {
                                const name = l.leave_type?.name || l.leave_group_type?.leave_type?.name || 'Leave';
                                const from = l.from_date || l.start_date;
                                const to = l.to_date || l.end_date;
                                const dateStr = from && to && from !== to
                                    ? `${new Date(from).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${new Date(to).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}`
                                    : from ? new Date(from).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '—';
                                const days = l.total_days || l.days || 0;
                                const statusCfg = {
                                    0: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                                    1: { label: 'Approved', cls: 'bg-green-500/10 text-green-500 border-green-500/20' },
                                    2: { label: 'Rejected', cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
                                }[l.status] || { label: 'Unknown', cls: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
                                const icon = name.toLowerCase().includes('sick') ? 'medication'
                                    : name.toLowerCase().includes('casual') ? 'event_busy'
                                    : 'beach_access';
                                return (
                                    <tr key={l.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                                </div>
                                                <span className="text-sm font-medium text-white">{name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#9db0b9]">{dateStr}</td>
                                        <td className="px-6 py-4 text-sm text-white">{days}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusCfg.cls}`}>
                                                {statusCfg.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {leaves.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-10 text-sm text-slate-500">No leave requests</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>);
};

export default Bank;
