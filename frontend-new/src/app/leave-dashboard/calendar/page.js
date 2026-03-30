"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LayoutList,
  Plus,
  X,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
  differenceInDays,
  addDays,
  isWeekend,
  getDay,
} from "date-fns";
import {
  leaveRequests,
  employees,
  leaveTypes,
  getEmployee,
  getLeaveType,
} from "@/lib/leave-store";

// --- Status config ---
const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

// --- Unique departments from employees ---
const departments = [...new Set(employees.map((e) => e.department))].sort();

// --- Status badge ---
function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// --- Drawer Panel ---
function DrawerPanel({ open, onClose, title, children }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">{children}</div>
      </div>
    </>
  );
}

// --- Leave events mapped for calendar ---
function useLeaveEvents() {
  return useMemo(() => {
    return leaveRequests.map((lr) => {
      const emp = getEmployee(lr.employeeId);
      const lt = getLeaveType(lr.leaveTypeId);
      return {
        ...lr,
        employee: emp,
        leaveType: lt,
        start: parseISO(lr.startDate),
        end: parseISO(lr.endDate),
      };
    });
  }, []);
}

// --- Main Page ---
export default function TeamCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "timeline"
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filters
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Drag select state
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // New leave form
  const [newLeave, setNewLeave] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const allEvents = useLeaveEvents();

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (filterDepartment !== "all" && ev.employee?.department !== filterDepartment) {
        return false;
      }
      if (filterStatus !== "all" && ev.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [allEvents, filterDepartment, filterStatus]);

  // Calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  // Events for a specific day
  const getEventsForDay = useCallback(
    (day) => {
      return filteredEvents.filter((ev) =>
        isWithinInterval(day, { start: ev.start, end: ev.end })
      );
    },
    [filteredEvents]
  );

  // Navigation
  const goToPrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const goToNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Drag to select handlers
  const handleDayMouseDown = (day) => {
    setIsDragging(true);
    setDragStart(day);
    setDragEnd(day);
  };

  const handleDayMouseEnter = (day) => {
    if (isDragging) {
      setDragEnd(day);
    }
  };

  const handleDayMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const start = dragStart < dragEnd ? dragStart : dragEnd;
      const end = dragStart < dragEnd ? dragEnd : dragStart;
      setNewLeave((prev) => ({
        ...prev,
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      }));
      setDrawerOpen(true);
    }
    setIsDragging(false);
  };

  const isDayInDragRange = (day) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    const start = dragStart < dragEnd ? dragStart : dragEnd;
    const end = dragStart < dragEnd ? dragEnd : dragStart;
    return isWithinInterval(day, { start, end });
  };

  // Open event detail
  const handleEventClick = (e, ev) => {
    e.stopPropagation();
    setSelectedEvent(ev);
    setDrawerOpen(true);
  };

  // Submit new leave
  const handleSubmitLeave = () => {
    if (!newLeave.employeeId || !newLeave.leaveTypeId || !newLeave.startDate || !newLeave.endDate) {
      alert("Please fill all required fields.");
      return;
    }
    console.log("New leave request submitted:", newLeave);
    alert("Leave request created successfully! (mock)");
    setDrawerOpen(false);
    setSelectedEvent(null);
    setNewLeave({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "" });
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedEvent(null);
  };

  // Employees for timeline (filtered by department)
  const timelineEmployees = useMemo(() => {
    if (filterDepartment === "all") return employees;
    return employees.filter((e) => e.department === filterDepartment);
  }, [filterDepartment]);

  // Timeline dates (full month)
  const timelineDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });
  }, [currentMonth]);

  const weekDayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]"
      onMouseUp={handleDayMouseUp}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-600 dark:text-white">
            Team Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View and manage team leave schedules across the organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
              showFilters
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-white dark:bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setNewLeave({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "" });
              setDrawerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Leave
          </button>
        </div>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/10">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="h-8 px-2 rounded-lg text-sm bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 px-2 rounded-lg text-sm bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="ml-auto text-xs text-slate-500">
            {filteredEvents.length} leave request{filteredEvents.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Month Navigation + View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-white min-w-[180px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white border border-white/10 hover:bg-white/10 transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/50 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "calendar"
                ? "bg-primary text-primary-foreground"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "timeline"
                ? "bg-primary text-primary-foreground"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Timeline
          </button>
        </div>
      </div>

      {/* Calendar Grid View */}
      {viewMode === "calendar" && (
        <div className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden select-none">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-white/10">
            {weekDayHeaders.map((d) => (
              <div
                key={d}
                className="px-2 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const inDragRange = isDayInDragRange(day);
              const weekend = isWeekend(day);

              return (
                <div
                  key={idx}
                  onMouseDown={() => handleDayMouseDown(day)}
                  onMouseEnter={() => handleDayMouseEnter(day)}
                  className={`min-h-[100px] border-b border-r border-white/5 p-1.5 cursor-crosshair transition-colors ${
                    !isCurrentMonth ? "opacity-40" : ""
                  } ${weekend ? "bg-white/[0.02]" : ""} ${
                    inDragRange ? "bg-primary/20 ring-1 ring-primary/40" : ""
                  } hover:bg-white/5`}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-medium leading-none ${
                        isToday
                          ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center font-bold"
                          : isCurrentMonth
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event Pills */}
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => handleEventClick(e, ev)}
                        className="group flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: ev.leaveType?.color
                            ? `${ev.leaveType.color.replace(")", ", 0.2)")}`
                            : "rgba(100,100,100,0.2)",
                          color: ev.leaveType?.color || "#94a3b8",
                          borderLeft: `2px solid ${ev.leaveType?.color || "#64748b"}`,
                        }}
                        title={`${ev.employee?.name} - ${ev.leaveType?.name}`}
                      >
                        <span className="truncate">
                          {ev.employee?.avatar} {ev.employee?.name?.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-slate-500 px-1.5 font-medium">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <div className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div
              className="min-w-[900px]"
              style={{ minWidth: `${200 + timelineDays.length * 32}px` }}
            >
              {/* Timeline Header - Dates */}
              <div className="flex border-b border-white/10 sticky top-0 bg-slate-800/90 backdrop-blur-sm z-10">
                <div className="w-[200px] shrink-0 px-3 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-white/10">
                  Employee
                </div>
                <div className="flex flex-1">
                  {timelineDays.map((day, idx) => {
                    const isToday = isSameDay(day, new Date());
                    const weekend = isWeekend(day);
                    return (
                      <div
                        key={idx}
                        className={`flex-1 min-w-[32px] text-center py-2.5 text-[10px] font-medium border-r border-white/5 ${
                          isToday
                            ? "bg-primary/20 text-primary font-bold"
                            : weekend
                            ? "text-slate-600 bg-white/[0.02]"
                            : "text-slate-500"
                        }`}
                      >
                        <div>{format(day, "EEE")[0]}</div>
                        <div className="font-bold">{format(day, "d")}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Employee Rows */}
              {timelineEmployees.map((emp) => {
                const empEvents = filteredEvents.filter(
                  (ev) => ev.employeeId === emp.id
                );

                return (
                  <div
                    key={emp.id}
                    className="flex border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Employee Info */}
                    <div className="w-[200px] shrink-0 px-3 py-2.5 border-r border-white/10 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">
                        {emp.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {emp.department}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Cells */}
                    <div className="flex flex-1 relative">
                      {timelineDays.map((day, idx) => {
                        const weekend = isWeekend(day);
                        const isToday = isSameDay(day, new Date());
                        return (
                          <div
                            key={idx}
                            className={`flex-1 min-w-[32px] border-r border-white/5 ${
                              weekend ? "bg-white/[0.02]" : ""
                            } ${isToday ? "bg-primary/5" : ""}`}
                          />
                        );
                      })}

                      {/* Leave Bars (absolutely positioned) */}
                      {empEvents.map((ev) => {
                        const monthStart = startOfMonth(currentMonth);
                        const monthEnd = endOfMonth(currentMonth);

                        // Clip to visible month
                        const barStart = ev.start < monthStart ? monthStart : ev.start;
                        const barEnd = ev.end > monthEnd ? monthEnd : ev.end;

                        if (barStart > monthEnd || barEnd < monthStart) return null;

                        const startIdx = differenceInDays(barStart, monthStart);
                        const spanDays = differenceInDays(barEnd, barStart) + 1;
                        const totalDays = timelineDays.length;

                        const leftPct = (startIdx / totalDays) * 100;
                        const widthPct = (spanDays / totalDays) * 100;

                        const statusCfg = statusConfig[ev.status] || statusConfig.pending;

                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => handleEventClick(e, ev)}
                            className="absolute top-1 cursor-pointer group"
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                              height: "calc(100% - 8px)",
                            }}
                          >
                            <div
                              className={`h-full rounded-md border flex items-center px-1.5 text-[10px] font-medium truncate transition-opacity hover:opacity-90 ${statusCfg.border}`}
                              style={{
                                backgroundColor: ev.leaveType?.color
                                  ? `${ev.leaveType.color.replace(")", ", 0.25)")}`
                                  : "rgba(100,100,100,0.25)",
                                borderLeftWidth: "3px",
                                borderLeftColor: ev.leaveType?.color || "#64748b",
                              }}
                            >
                              <span className="truncate" style={{ color: ev.leaveType?.color || "#94a3b8" }}>
                                {ev.leaveType?.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {timelineEmployees.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500">
                  No employees match the selected filters.
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-t border-white/10">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Leave Types:
            </span>
            {leaveTypes.map((lt) => (
              <div key={lt.id} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: lt.color }}
                />
                <span className="text-[10px] text-slate-400">{lt.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards below calendar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upcoming Leaves */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            Upcoming Leaves
          </h3>
          <div className="space-y-2">
            {filteredEvents
              .filter((ev) => ev.start >= new Date() && ev.status !== "rejected")
              .sort((a, b) => a.start - b.start)
              .slice(0, 5)
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={(e) => handleEventClick(e, ev)}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: ev.leaveType?.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white truncate">
                      {ev.employee?.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {format(ev.start, "MMM d")}
                      {!isSameDay(ev.start, ev.end) && ` - ${format(ev.end, "MMM d")}`}
                    </div>
                  </div>
                  <StatusBadge status={ev.status} />
                </div>
              ))}
            {filteredEvents.filter((ev) => ev.start >= new Date() && ev.status !== "rejected")
              .length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No upcoming leaves</p>
            )}
          </div>
        </div>

        {/* On Leave Today */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            On Leave Today
          </h3>
          <div className="space-y-2">
            {filteredEvents
              .filter(
                (ev) =>
                  isWithinInterval(new Date(), { start: ev.start, end: ev.end }) &&
                  ev.status === "approved"
              )
              .map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={(e) => handleEventClick(e, ev)}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">
                    {ev.employee?.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white truncate">
                      {ev.employee?.name}
                    </div>
                    <div className="text-[10px] text-slate-500">{ev.leaveType?.name}</div>
                  </div>
                </div>
              ))}
            {filteredEvents.filter(
              (ev) =>
                isWithinInterval(new Date(), { start: ev.start, end: ev.end }) &&
                ev.status === "approved"
            ).length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">
                No one is on leave today
              </p>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            Pending Approvals
          </h3>
          <div className="space-y-2">
            {filteredEvents
              .filter((ev) => ev.status === "pending")
              .slice(0, 5)
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={(e) => handleEventClick(e, ev)}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-[10px] font-bold text-yellow-400">
                    {ev.employee?.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white truncate">
                      {ev.employee?.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {format(ev.start, "MMM d")} - {ev.days} day{ev.days !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <span className="text-[10px] text-yellow-400 font-medium">Review</span>
                </div>
              ))}
            {filteredEvents.filter((ev) => ev.status === "pending").length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">
                No pending approvals
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Drawer - Event Detail or New Leave Form */}
      <DrawerPanel
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={selectedEvent ? "Leave Details" : "New Leave Request"}
      >
        {selectedEvent ? (
          /* Event Detail View */
          <div className="space-y-5">
            {/* Employee Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                {selectedEvent.employee?.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {selectedEvent.employee?.name}
                </div>
                <div className="text-xs text-slate-500">
                  {selectedEvent.employee?.department} - {selectedEvent.employee?.category}
                </div>
              </div>
            </div>

            {/* Leave Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400">Leave Type</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedEvent.leaveType?.color }}
                  />
                  <span className="text-white">{selectedEvent.leaveType?.name}</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400">Duration</span>
                <span className="text-sm font-medium text-white">
                  {format(selectedEvent.start, "MMM d, yyyy")}
                  {!isSameDay(selectedEvent.start, selectedEvent.end) &&
                    ` - ${format(selectedEvent.end, "MMM d, yyyy")}`}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400">Days</span>
                <span className="text-sm font-medium text-white">{selectedEvent.days}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400">Status</span>
                <StatusBadge status={selectedEvent.status} />
              </div>
              {selectedEvent.reason && (
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block mb-1">Reason</span>
                  <p className="text-sm text-white">{selectedEvent.reason}</p>
                </div>
              )}
              {selectedEvent.appliedOn && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400">Applied On</span>
                  <span className="text-sm text-white">{selectedEvent.appliedOn}</span>
                </div>
              )}
            </div>

            {/* Approval Chain */}
            {selectedEvent.approvalChain && selectedEvent.approvalChain.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Approval Chain
                </h4>
                <div className="space-y-2">
                  {selectedEvent.approvalChain.map((step, idx) => {
                    const stepCfg = statusConfig[step.status] || statusConfig.pending;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border ${stepCfg.bg} ${stepCfg.border}`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${stepCfg.bg} ${stepCfg.text}`}>
                          {step.level}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white">{step.role}</div>
                          {step.approverName && (
                            <div className="text-[10px] text-slate-400">{step.approverName}</div>
                          )}
                          {step.comment && (
                            <div className="text-[10px] text-slate-500 mt-0.5 italic">
                              &ldquo;{step.comment}&rdquo;
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold ${stepCfg.text}`}>
                          {step.status?.charAt(0).toUpperCase() + step.status?.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* New Leave Request Form */
          <div className="space-y-4">
            {/* Employee */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Employee <span className="text-red-400">*</span>
              </label>
              <select
                value={newLeave.employeeId}
                onChange={(e) =>
                  setNewLeave((prev) => ({ ...prev, employeeId: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-lg text-sm bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Leave Type <span className="text-red-400">*</span>
              </label>
              <select
                value={newLeave.leaveTypeId}
                onChange={(e) =>
                  setNewLeave((prev) => ({ ...prev, leaveTypeId: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-lg text-sm bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) =>
                    setNewLeave((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-lg text-sm bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  End Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) =>
                    setNewLeave((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-lg text-sm bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Reason
              </label>
              <textarea
                value={newLeave.reason}
                onChange={(e) =>
                  setNewLeave((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={3}
                placeholder="Optional: Provide a reason for this leave..."
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* Preview */}
            {newLeave.startDate && newLeave.endDate && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-xs text-primary font-medium">Leave Summary</div>
                <div className="text-sm text-white mt-1">
                  {newLeave.startDate === newLeave.endDate
                    ? format(parseISO(newLeave.startDate), "MMMM d, yyyy")
                    : `${format(parseISO(newLeave.startDate), "MMM d")} - ${format(
                        parseISO(newLeave.endDate),
                        "MMM d, yyyy"
                      )}`}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {differenceInDays(parseISO(newLeave.endDate), parseISO(newLeave.startDate)) + 1} day(s)
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCloseDrawer}
                className="flex-1 h-10 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLeave}
                className="flex-1 h-10 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
