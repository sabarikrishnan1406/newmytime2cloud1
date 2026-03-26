import ProfilePicture from "@/components/ProfilePicture";
import { getBgColor, getTextColor, setStatusLabel } from "@/lib/utils";
import { Eye } from "lucide-react";

export default (shiftTypeId, { onViewLogs } = {}) => {
    // 1. Base columns (common to all types)
    const columns = [
        {
            key: "name",
            header: "Name",
            render: ({ employee }) => (
                <div className="flex items-center space-x-3">
                    <ProfilePicture src={employee.profile_picture} />
                    <div>
                        <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{employee?.first_name} ({employee?.system_user_id})</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {employee?.department?.name}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "date", header: "Date",
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{log.day.toString().substring(0, 3)}, {log.date}</p>)
        },
        {
            key: "shift", header: "Shift",
            render: (log) => (
                <p className="text-sm text-slate-600 dark:text-slate-300">{log.shift?.name}</p>
            ),
        },
    ];

    // 2. Dynamic columns for shiftTypeId 2 (The 1-7 loop)
    const inOutColumns = [];
    for (let i = 1; i <= 5; i++) {
        inOutColumns.push({
            key: `in${i}`,
            header: `In${i}`,
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log[`in${i}`] || "—"}`}</p>)
        });
        inOutColumns.push({
            key: `out${i}`,
            header: `Out${i}`,
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log[`out${i}`] || "—"}`}</p>)
        });
    }

    // 3. Specific columns for shiftTypeId 5 (In1, Out1, In2, Out2)
    // 3. Specific columns for shiftTypeId 5
    const doubleShiftColumns = [
        ...[1, 2].flatMap(i => [
            {
                key: `in${i}`, // Unique Key
                header: `In${i}`,
                render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log[`in${i}`] || "—"}`}</p>)
            },
            {
                key: `out${i}`, // Unique Key
                header: `Out${i}`,
                render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log[`out${i}`] || "—"}`}</p>)
            }
        ]),
        {
            key: "late_coming_5", // Unique Key
            header: "Late In",
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log?.late_coming || "—"}`}</p>),
        },
        {
            key: "early_going_5", // Unique Key
            header: "Early Out",
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log?.early_going || "—"}`}</p>),
        },
    ];

    // 4. Closing columns (common to all types)
    const otherColumns = [
        { key: "ot", header: "OT", render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{log.ot}</p>) },
        { key: "total_hrs", header: "Total Hrs", render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{log.total_hrs}</p>) },
        {
            key: "status",
            header: "Status",
            render: (log) => (
                <span className={`text-sm ${getBgColor(log.status)}`}
                    style={{ padding: "2px 10px", borderRadius: "50px" }}
                >
                    {setStatusLabel(log?.status)}
                </span>
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            render: (item) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onViewLogs?.(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary hover:bg-primary/5"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // --- Conditional Logic ---
    if (shiftTypeId == '2') {
        return [...columns, ...inOutColumns, ...otherColumns];
    }

    if (shiftTypeId == '5') {
        return [...columns, ...doubleShiftColumns, ...otherColumns];
    }

    // Default Case (Original Layout)
    return [
        ...columns,
        {
            key: "in",
            header: "In",
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log?.in || "—"}`}</p>),
        },
        {
            key: "out",
            header: "Out",
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log?.out || "—"}`}</p>),
        },
        {
            key: "late_coming",
            header: "Late In",
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log?.late_coming || "—"}`}</p>),
        },
        {
            key: "early_going",
            header: "Early Out",
            render: (log) => (<p className="text-sm text-slate-600 dark:text-slate-300">{`${log?.early_going || "—"}`}</p>),
        },
        ...otherColumns,
    ];
};