"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarCheck,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Coffee,
  Moon,
  Sun,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { API_BASE, api, buildQueryParams } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { getStaffUser } from "@/lib/staff-user";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DEFAULT_WORKING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const SHIFT_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  night: "Night",
  off: "Off",
};

const SHIFT_COLORS = {
  morning: "#f59e0b",
  afternoon: "#38bdf8",
  night: "#8b5cf6",
  off: "#475569",
};

const SHIFT_STYLES = {
  morning: {
    pill: "border-amber-400/20 bg-amber-400/15 text-amber-200",
    icon: Sun,
  },
  afternoon: {
    pill: "border-sky-400/20 bg-sky-400/15 text-sky-200",
    icon: Cloud,
  },
  night: {
    pill: "border-violet-400/20 bg-violet-400/15 text-violet-200",
    icon: Moon,
  },
  off: {
    pill: "border-white/10 bg-slate-800 text-slate-300",
    icon: Coffee,
  },
};

function getInitials(name) {
  if (!name) return "ST";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getProfileImageUrl(profilePicture) {
  if (!profilePicture) return null;
  if (String(profilePicture).startsWith("http")) return profilePicture;
  const mediaBase = API_BASE.replace(/\/api$/, "");
  return `${mediaBase}/media/employee/profile_picture/${profilePicture}`;
}

function matchesEmployeeRecord(employee, identifiers) {
  const recordValues = [
    employee?.id,
    employee?.employee_id,
    employee?.system_user_id,
    employee?.user_id,
  ]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map(String);

  return identifiers.some((identifier) => recordValues.includes(String(identifier)));
}

function getBestScheduleRecord(employee) {
  if (!employee) return null;

  const activeSchedule = employee?.schedule_active?.id ? employee.schedule_active : null;
  if (activeSchedule?.shift?.name && activeSchedule.shift.name !== "---") {
    return activeSchedule;
  }

  const assignedSchedule = employee?.schedule?.id ? employee.schedule : null;
  if (assignedSchedule?.shift?.name && assignedSchedule.shift.name !== "---") {
    return assignedSchedule;
  }

  const historicalSchedule = Array.isArray(employee?.schedule_all)
    ? employee.schedule_all.find((item) => item?.id && item?.shift?.name && item.shift.name !== "---")
    : null;

  return historicalSchedule || null;
}

function getWeekStart(baseDate, offset = 0) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset + offset * 7);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date, count) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function formatWeekRange(baseDate, offset = 0) {
  const start = getWeekStart(baseDate, offset);
  const end = addDays(start, 6);

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.toLocaleDateString("en-US", { day: "numeric" });
  const endDay = end.toLocaleDateString("en-US", { day: "numeric" });
  const year = end.getFullYear();

  return startMonth === endMonth
    ? `${startMonth} ${startDay} - ${endDay}, ${year}`
    : `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function normalizeDayLabel(day) {
  if (!day) return null;
  const value = String(day).trim().slice(0, 3).toLowerCase();
  const match = DAY_LABELS.find((label) => label.toLowerCase() === value);
  return match || null;
}

function parseTimeToMinutes(timeValue) {
  if (!timeValue || timeValue === "---" || timeValue === "-") return null;

  const raw = String(timeValue).trim();

  if (/am|pm/i.test(raw)) {
    const normalized = raw.replace(/\s+/g, " ").toUpperCase();
    const match = normalized.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
    if (!match) return null;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3];

    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  const parts = raw.split(":");
  if (parts.length < 2) return null;

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  return hours * 60 + minutes;
}

function formatTimeLabel(timeValue) {
  if (!timeValue || timeValue === "---" || timeValue === "-") return "-";

  const minutes = parseTimeToMinutes(timeValue);
  if (minutes === null) return String(timeValue);

  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(mins).padStart(2, "0")} ${suffix}`;
}

function getShiftHours(shift) {
  const workingHours = shift?.working_hours;
  if (workingHours && typeof workingHours === "string" && workingHours.includes(":")) {
    const [hoursPart, minutesPart] = workingHours.split(":").map((chunk) => Number(chunk));
    if (!Number.isNaN(hoursPart) && !Number.isNaN(minutesPart)) {
      return Number((hoursPart + minutesPart / 60).toFixed(1));
    }
  }

  const start = parseTimeToMinutes(shift?.on_duty_time);
  const end = parseTimeToMinutes(shift?.off_duty_time);

  if (start === null || end === null) return 8;

  const duration = end >= start ? end - start : 24 * 60 - start + end;
  return Number((duration / 60).toFixed(1));
}

function getShiftType(shift) {
  if (!shift) return "off";

  const shiftName = String(shift.name || "").toLowerCase();
  if (shiftName.includes("night") || shiftName.includes("overnight")) return "night";
  if (shiftName.includes("afternoon") || shiftName.includes("evening")) return "afternoon";
  if (shiftName.includes("morning")) return "morning";

  const startMinutes = parseTimeToMinutes(shift.on_duty_time);
  if (startMinutes === null) return "morning";

  const hour = Math.floor(startMinutes / 60);
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 19) return "afternoon";
  return "night";
}

function buildWeeklyShifts(shift, branchName, weekOffset) {
  const weekStart = getWeekStart(new Date(), weekOffset);
  const normalizedDays = (shift?.days || []).map(normalizeDayLabel).filter(Boolean);
  const activeDays = normalizedDays.length ? normalizedDays : shift ? DEFAULT_WORKING_DAYS : [];
  const shiftType = getShiftType(shift);
  const hours = shift ? getShiftHours(shift) : 0;
  const start = shift ? formatTimeLabel(shift.on_duty_time) : "-";
  const end = shift ? formatTimeLabel(shift.off_duty_time) : "-";
  const todayToken = new Date().toDateString();

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(weekStart, index);
    const shortDay = DAY_LABELS[currentDate.getDay()];
    const isWorkingDay = activeDays.includes(shortDay);
    const currentShiftType = isWorkingDay ? shiftType : "off";

    return {
      key: `${currentDate.toISOString()}-${shortDay}`,
      day: shortDay,
      fullDay: FULL_DAY_LABELS[currentDate.getDay()],
      dateLabel: formatShortDate(currentDate),
      dateNumber: currentDate.getDate(),
      isToday: currentDate.toDateString() === todayToken,
      type: currentShiftType,
      shiftName: isWorkingDay ? shift?.name || SHIFT_LABELS[currentShiftType] : "Day Off",
      start,
      end,
      hours: isWorkingDay ? hours : 0,
      location: branchName || "---",
    };
  });
}

function formatHours(value) {
  if (!value) return "0h";
  const hasDecimal = Math.abs(value % 1) > 0;
  return `${hasDecimal ? value.toFixed(1) : value.toFixed(0)}h`;
}

function ProfileAvatar({ name, imageUrl }) {
  const initials = getInitials(name);

  return (
    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-[0_10px_24px_rgba(0,0,0,0.22)] sm:h-14 sm:w-14">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-cyan-400/10 text-sm font-semibold text-cyan-200 sm:text-base">
          {initials}
        </div>
      )}
    </div>
  );
}

function ShiftBadge({ type, start, end, shiftName }) {
  const config = SHIFT_STYLES[type];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "inline-flex cursor-default items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-transform duration-200 hover:scale-[1.02]",
            config.pill
          )}
        >
          <Icon className="h-3 w-3" />
          <span>{SHIFT_LABELS[type]}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="border border-white/10 bg-[#0b1628] text-slate-100">
        <p className="font-semibold text-slate-100">{shiftName}</p>
        <p className="text-[11px] text-slate-400">
          {type === "off" ? "No scheduled hours" : `${start} - ${end}`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

function StatsCards({ items }) {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.24 }}
          className="staff-glass-card min-h-[92px] rounded-[22px] border border-white/10 p-3.5"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {item.label}
            </span>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5 text-cyan-200">
              <item.icon className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="font-headline text-[1.85rem] font-bold leading-none text-slate-50">{item.value}</p>
          <p className="mt-1 text-[11px] text-slate-400">{item.subtext}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ChartTooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#091120] px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-slate-100">{point.fullDay || label}</p>
      <p className="mt-1 text-slate-400">
        {point.type === "off" ? "Off day" : `${point.shiftName} - ${formatHours(point.hours)}`}
      </p>
      {point.type !== "off" ? (
        <p className="mt-1 text-[11px] text-slate-500">
          {point.start} - {point.end}
        </p>
      ) : null}
    </div>
  );
}

function WeeklyChart({ weeklyShifts }) {
  const chartData = weeklyShifts.map((shift) => ({
    day: shift.day,
    fullDay: shift.fullDay,
    hours: shift.hours,
    type: shift.type,
    shiftName: shift.shiftName,
    start: shift.start,
    end: shift.end,
  }));

  const totalHours = weeklyShifts.reduce((sum, shift) => sum + shift.hours, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.28 }}
      className="staff-glass-card flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/10"
    >
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-headline text-base font-semibold text-slate-100">Weekly Hours</h3>
            <p className="mt-0.5 text-[11px] text-slate-400">Daily shift breakdown</p>
          </div>
          <div className="text-right">
            <p className="font-headline text-xl font-bold text-slate-50">{formatHours(totalHours)}</p>
            <p className="text-[10px] text-slate-500">Scheduled</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 px-2 pb-1 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="24%">
            <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="4 4" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              domain={[0, (dataMax) => Math.max(10, Math.ceil(dataMax + 1))]}
              width={22}
              ticks={[0, 3, 6, 9]}
            />
            <RechartsTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "rgba(148, 163, 184, 0.08)", radius: 10 }}
            />
            <Bar dataKey="hours" radius={[7, 7, 0, 0]} maxBarSize={26}>
              {chartData.map((entry) => (
                <Cell key={`${entry.day}-${entry.type}`} fill={SHIFT_COLORS[entry.type]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="shrink-0 flex flex-wrap items-center justify-center gap-3 px-4 pb-3 pt-1">
        {Object.entries(SHIFT_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: SHIFT_COLORS[type] }} />
            <span className="text-[10px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ScheduleList({ weeklyShifts }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.28 }}
      className="staff-glass-card flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/10"
    >
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <h3 className="font-headline text-base font-semibold text-slate-100">This Week&apos;s Schedule</h3>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {weeklyShifts[0]?.dateLabel} - {weeklyShifts[weeklyShifts.length - 1]?.dateLabel}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col divide-y divide-white/5">
        {weeklyShifts.map((shift, index) => (
          <motion.div
            key={shift.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.18 }}
            className={cn(
              "grid min-h-[56px] flex-1 grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 transition-colors",
              shift.isToday && "bg-cyan-400/5"
            )}
          >
            <div className="text-center">
              <p className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", shift.isToday ? "text-cyan-300" : "text-slate-500")}>
                {shift.day}
              </p>
              <p className={cn("font-headline text-xl font-bold leading-none", shift.isToday ? "text-cyan-200" : "text-slate-100")}>
                {shift.dateNumber}
              </p>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-100">{shift.fullDay}</p>
                {shift.isToday ? (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
                    Today
                  </span>
                ) : null}
              </div>
              <p className="truncate text-[11px] text-slate-400">
                {shift.location} - {shift.shiftName}
              </p>
            </div>

            <div className="flex items-center gap-3 text-right">
              <ShiftBadge
                type={shift.type}
                start={shift.start}
                end={shift.end}
                shiftName={shift.shiftName}
              />
              <div className="min-w-[110px]">
                {shift.type === "off" ? (
                  <p className="text-[11px] text-slate-400">Day Off</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-100">{shift.start} - {shift.end}</p>
                    <p className="text-[10px] text-slate-500">{formatHours(shift.hours)}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function StaffSchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "Employee",
    employeeCode: "---",
    designation: "---",
    department: "---",
    branchName: "---",
    profilePicture: null,
  });
  const [shiftData, setShiftData] = useState(null);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    weekOff: 0,
    holiday: 0,
    incomplete: 0,
    overtime: "0:00",
  });

  useEffect(() => {
    let ignore = false;

    async function fetchSchedulePage() {
      try {
        const staffUser = await getStaffUser();
        const params = await buildQueryParams({});
        const systemUserId = staffUser?.system_user_id || staffUser?.employee_id;

        const [meResult, employeeResult, statsResult] = await Promise.allSettled([
          api.get("/me"),
          api.get("/employees_with_schedule_count", { params: { ...params, per_page: 500 } }),
          api.get("/staff-stats", {
            params: {
              ...params,
              system_user_id: systemUserId,
              user_id: staffUser?.id,
            },
          }),
        ]);

        if (ignore) return;

        const me = meResult.status === "fulfilled" ? meResult.value?.data?.user : null;
        const employees = employeeResult.status === "fulfilled" ? employeeResult.value?.data?.data || [] : [];
        const employeeIdentifiers = [
          staffUser?.id,
          staffUser?.employee_id,
          staffUser?.system_user_id,
          me?.id,
          me?.employee_id,
          me?.system_user_id,
          me?.employee_code,
        ].filter((value) => value !== undefined && value !== null && value !== "");
        const employeeRecord = employees.find((employee) => matchesEmployeeRecord(employee, employeeIdentifiers)) || null;
        const scheduleRecord = getBestScheduleRecord(employeeRecord);

        const resolvedName =
          me?.employee_name ||
          (employeeRecord ? `${employeeRecord.first_name || ""} ${employeeRecord.last_name || ""}`.trim() : "") ||
          me?.name ||
          staffUser?.employee_name ||
          "Employee";

        const resolvedProfilePicture =
          me?.employee_profile_picture ||
          employeeRecord?.profile_picture ||
          staffUser?.employee_profile_picture ||
          null;

        setProfile({
          name: resolvedName,
          employeeCode: employeeRecord?.employee_id || staffUser?.employee_id || "---",
          designation: employeeRecord?.designation?.name || staffUser?.designation_name || "---",
          department: employeeRecord?.department?.name || staffUser?.department_name || "---",
          branchName:
            employeeRecord?.branch?.branch_name ||
            me?.branch?.branch_name ||
            staffUser?.branch_name ||
            "---",
          profilePicture: resolvedProfilePicture,
        });

        setShiftData(
          scheduleRecord?.shift
            ? {
                ...scheduleRecord.shift,
                branchName:
                  employeeRecord?.branch?.branch_name ||
                  me?.branch?.branch_name ||
                  staffUser?.branch_name ||
                  "---",
              }
            : null
        );

        if (statsResult.status === "fulfilled") {
          const data = statsResult.value?.data || {};
          setStats({
            present: Number(data.present || 0),
            absent: Number(data.absent || 0),
            leave: Number(data.leave || 0),
            weekOff: Number(data.week_off || 0),
            holiday: Number(data.holiday || 0),
            incomplete: Number(data.incomplete || 0),
            overtime: data.overtime || "0:00",
          });
        }
      } catch (error) {
        console.error("Failed to load staff schedule page", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchSchedulePage();

    return () => {
      ignore = true;
    };
  }, []);

  const weeklyShifts = buildWeeklyShifts(shiftData, profile.branchName, weekOffset);
  const totalHoursThisWeek = weeklyShifts.reduce((sum, shift) => sum + shift.hours, 0);
  const workDays = weeklyShifts.filter((shift) => shift.type !== "off").length;
  const trackedAttendanceDays = stats.present + stats.absent + stats.incomplete;
  const attendanceRate = trackedAttendanceDays > 0 ? ((stats.present / trackedAttendanceDays) * 100).toFixed(1) : "0.0";
  const firstName = profile.name.split(" ")[0] || "Employee";
  const activeShiftLabel = shiftData?.name || "No active shift assigned";
  const activeShiftTime = shiftData
    ? `${formatTimeLabel(shiftData.on_duty_time)} - ${formatTimeLabel(shiftData.off_duty_time)}`
    : "No scheduled hours";
  const profileImageUrl = getProfileImageUrl(profile.profilePicture);

  const statItems = [
    {
      label: "Hours This Week",
      value: formatHours(totalHoursThisWeek),
      subtext: `${workDays} scheduled day${workDays === 1 ? "" : "s"}`,
      icon: Clock,
    },
    {
      label: "Attendance",
      value: `${attendanceRate}%`,
      subtext: `${stats.present} present / ${Math.max(trackedAttendanceDays, 0)} tracked`,
      icon: CalendarCheck,
    },
    {
      label: "Overtime",
      value: stats.overtime || "0:00",
      subtext: "Recorded this period",
      icon: TrendingUp,
    },
    {
      label: "Leave Days",
      value: `${stats.leave}`,
      subtext: `${stats.holiday} holiday / ${stats.weekOff} week off`,
      icon: CalendarOff,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="staff-glass-card rounded-[22px] border border-white/10 px-5 py-4 text-sm text-slate-300">
          Loading schedule...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-2 sm:p-3">
      <div className="flex h-full w-full min-w-0 flex-col gap-3">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="staff-glass-card shrink-0 rounded-[22px] border border-white/10 p-4"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3">
              <ProfileAvatar name={profile.name} imageUrl={profileImageUrl} />
              <div>
                <h1 className="font-headline text-[1.9rem] font-bold tracking-tight text-slate-50">
                  {firstName}&apos;s Schedule
                </h1>
                <p className="mt-0.5 text-sm text-slate-400">
                  {profile.designation} - {profile.department} - {formatWeekRange(new Date(), weekOffset)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300">
                    {activeShiftLabel}
                  </span>
                  <span className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-200">
                    {activeShiftTime}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-400">
                    {profile.branchName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 rounded-2xl border-white/10 bg-white/5 px-3 text-xs text-slate-100 hover:bg-white/10 hover:text-white"
              >
                <Link href="/staff/leave/apply">
                  <CalendarOff className="h-3.5 w-3.5" />
                  Request Leave
                </Link>
              </Button>
              <div className="ml-1 flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => setWeekOffset((value) => value - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-2xl border-white/10 bg-white/5 px-3 text-xs text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => setWeekOffset(0)}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => setWeekOffset((value) => value + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        <StatsCards items={statItems} />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.72fr)_minmax(320px,0.92fr)]">
          <div className="min-h-0">
            <ScheduleList weeklyShifts={weeklyShifts} />
          </div>
          <div className="min-h-0">
            <WeeklyChart weeklyShifts={weeklyShifts} />
          </div>
        </div>
      </div>
    </div>
  );
}
