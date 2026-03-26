import React, { useEffect, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import ProfilePicture from "../ProfilePicture";
import { getDeviceLogs } from "@/lib/api";
import {
  Smartphone,
  Contact,
  Fingerprint,
  ScanFace,
  Hash,
  RefreshCw,
  Edit3,
  Monitor,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLiveAttendance } from "@/context/LiveAttendanceContext";

// 1. Define the base icon mapping
const baseIcons = {
  Card: <Contact size={16} title="Card" />,
  Fing: <Fingerprint size={16} title="Fingerprint" />,
  Face: <ScanFace size={16} title="Face" />,
  Pin: <Hash size={16} title="PIN" />,
  Manual: <Edit3 size={16} title="Manual" />,
  Repeated: <RefreshCw size={16} title="Repeated" />,
  Mobile: <Smartphone size={16} title="Mobile" />,
  Device: <Monitor size={16} title="Monitor" />,
};

// 2. Define how each mode maps to those icons
const iconGroups = {
  Card: [baseIcons.Card],
  Fing: [baseIcons.Fing],
  Face: [baseIcons.Face],
  "Fing + Card": [baseIcons.Fing, baseIcons.Card],
  "Face + Fing": [baseIcons.Face, baseIcons.Fing],
  "Face + Card": [baseIcons.Face, baseIcons.Card],
  "Card + Pin": [baseIcons.Card, baseIcons.Pin],
  "Face + Pin": [baseIcons.Face, baseIcons.Pin],
  "Fing + Pin": [baseIcons.Fing, baseIcons.Pin],
  "Fing + Card + Pin": [baseIcons.Fing, baseIcons.Card, baseIcons.Pin],
  "Face + Card + Pin": [baseIcons.Face, baseIcons.Card, baseIcons.Pin],
  "Face + Fing + Pin": [baseIcons.Face, baseIcons.Fing, baseIcons.Pin],
  "Face + Fing + Card": [baseIcons.Face, baseIcons.Fing, baseIcons.Card],
  Manual: [baseIcons.Manual],
  Repeated: [baseIcons.Repeated],
};

function LiveFeed({ branch_ids, department_ids }) {
  const router = useRouter();

  const { lastAttendanceEvent } = useLiveAttendance();

  const { isDark } = useDarkMode();

  // Helper to determine Status Badge Styles
  const getStatusStyles = (type) => {
    const themes = {
      Allowed: isDark
        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
        : "bg-emerald-50 border-emerald-200 text-emerald-600",
      "Access Denied": "bg-amber-500/5 border-amber-500/20 text-amber-400",
      neutral: isDark
        ? "bg-slate-500/50 border-slate-600/50 text-slate-100"
        : "bg-slate-100 border-slate-200 text-slate-500",
    };
    return themes[type] || themes.neutral;
  };

  const getPunctualityDot = (punctuality = "On Time") => {
    const themes = {
      "On Time": "bg-emerald-500",
      Late: "bg-amber-500",
      Early: "bg-cyan-500",
    };
    return themes[punctuality] || themes.neutral;
  };

  const getPunctualityColor = (punctuality = "On Time") => {
    const themes = {
      "On Time": "text-emerald-600",
      Late: "text-amber-600",
      Early: "text-cyan-600",
    };
    return themes[punctuality] || themes.neutral;
  };

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch device logs API
  const fetchRecords = async () => {
    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const { data } = await getDeviceLogs({
      page: 1,
      per_page: 50,
      from_date: today,
      to_date: today,
      branch_ids,
      department_ids,
    });

    // Map data to match Vue logic for columns (employee, branch/department, device info, time, in/out, mode, status)
    let result = data.map((e) => {
      // Employee name logic
      const employeeName =
        [e?.employee?.first_name, e?.employee?.last_name]
          .filter(Boolean)
          .join(" ") || "---";
      // Branch/Department logic
      const branchDept =
        [e?.employee?.branch?.branch_name, e?.employee?.department?.name]
          .filter(Boolean)
          .join(" / ") || "---";
      // Device info logic
      // Fallback to name only if gps_location is null/undefined

      let deviceLocation = e.gps_location ?? e.device.name;

      // Direct replacement for "Unknown"
      if (deviceLocation === "Unknown") {
        deviceLocation = "Manual";
      }

      // In/Out logic
      let inout = "---";
      if (e.log_type === "Out") inout = "Out";
      else if (e.log_type === "In") inout = "In";

      // Mode logic
      let modes = [];
      if (e.DeviceID?.includes("Mobile")) {
        modes = [baseIcons.Mobile];
      } else if (iconGroups[e.mode]) {
        modes = iconGroups[e.mode];
      } else {
        modes = [baseIcons.Device];
      }

      return {
        ...e,
        id: e?.employee?.employee_id,
        name: employeeName,
        dept: branchDept,
        deviceLocation,
        time: `${e.time}`,
        profile_picture: `${e.employee?.profile_picture}`,
        inout,
        modes,
        // Keep status and punctuality as before
        punctuality: "On Time",
        punctualityColor: "text-emerald-600",
        punctualityDot: "bg-emerald-500",
        status: e.status,
        statusType: "neutral",
      };
    });
    setRecords(result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [branch_ids, department_ids]);

  useEffect(() => {
    if (!lastAttendanceEvent) return;

    fetchRecords();

    // setRecords((prev) => [
    //   {
    //     id: lastAttendanceEvent.customId,
    //     name: lastAttendanceEvent.personName,
    //     dept: lastAttendanceEvent.dept,
    //     deviceLocation: lastAttendanceEvent.location ?? "Office Location",
    //     log_type: lastAttendanceEvent.log_type || "---",
    //     punctuality: lastAttendanceEvent.punctuality,
    //     punctualityColor: lastAttendanceEvent.punctualityColor,
    //     punctualityDot: lastAttendanceEvent.punctualityDot,
    //     profile_picture:lastAttendanceEvent.profile_picture,
    //     status: lastAttendanceEvent.status,
    //     statusType: "neutral",
    //     time: lastAttendanceEvent.time,
    //     modes: [
    //       lastAttendanceEvent.eventId?.includes("Mobile")
    //         ? baseIcons.Mobile
    //         : baseIcons.Face,
    //     ],
    //   },
    //   ...prev,
    // ]);
  }, [lastAttendanceEvent]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="text-base font-bold text-gray-600 dark:text-gray-300 font-display tracking-wide">
            Live Recognition Feed
          </h3>

          <RefreshCw
            className={`${isLoading ? "animate-spin" : ""}`}
            onClick={fetchRecords}
            size={14}
          />
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push("/logs")}
            className="text-xs font-bold text-primary hover:text-gray-600 dark:text-gray-300 transition-colors uppercase tracking-wider"
          >
            View Full Log
          </button>
        </div>
      </div>

      {/* Table Header - Fixed column sizes to match body */}
      <div className="grid grid-cols-13 px-6 py-3 border-y border-gray-200 dark:border-white/5 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white/[0.02]">
        <div className="col-span-2">Employee</div>
        <div className="col-span-2">Branch / Dept</div>
        <div className="col-span-1">Mode</div>
        <div className="col-span-2">Device</div>
        <div className="col-span-1">Time</div>
        <div className="col-span-1">In/Out</div>
        {/* <div className="col-span-1">Punctuality</div> */}
        <div className="col-span-2 text-right pr-2">Status</div>
      </div>

      {/* List Body */}
      <div className="flex-1 overflow-y-auto px-2">
        {records.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-13 py-4 items-center cursor-pointer group gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
              index !== records.length - 1
                ? "border-b border-gray-100 dark:border-white/5"
                : ""
            }`}
          >
            {/* Employee */}
            <div className="col-span-2 flex gap-3 pl-2">
              <div className="size-8 min-w-[32px] rounded-full overflow-hidden relative border border-border flex items-center justify-center">
                <ProfilePicture src={item?.profile_picture} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors truncate">
                  {item.name}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  ID: {item.id}
                </span>
              </div>
            </div>
            {/* Branch/Department */}
            <div className="col-span-2 text-xs text-slate-600 dark:text-slate-300">
              {item.dept}
            </div>

            {/* Mode */}
            <div className="col-span-1 flex items-center text-slate-600 dark:text-slate-300">
              {item?.modes?.map((icon, idx) => (
                <span key={idx}>{icon}</span>
              ))}
            </div>

            <div className="col-span-2 text-xs text-slate-600 dark:text-slate-300">
              {item.deviceLocation}
            </div>
            {/* Time */}
            <div className="col-span-1 text-xs text-slate-600 dark:text-slate-300">
              {item.time}
            </div>
            {/* In/Out */}
            <div className="col-span-1">
              {item.log_type === "out" ? (
                <span style={{ color: "red" }}>{item.log_type}</span>
              ) : item.log_type === "in" ? (
                <span style={{ color: "green" }}>{item.log_type}</span>
              ) : (
                <span>{item.log_type}</span>
              )}
            </div>

            {/* Status (unchanged) */}

            {/* <div className="col-span-1">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${getPunctualityColor(item.punctuality)}`}
              >
                <span
                  className={`size-1 rounded-full ${getPunctualityDot(item.punctuality)}`}
                ></span>
                {item.punctuality}
              </span>
            </div> */}

            <div className="col-span-2 text-right pr-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-medium text-[9px] border ${getStatusStyles(item.status)}`}
              >
                {item.statusType !== "neutral" && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${item.status === "Allowed" ? "bg-emerald-500" : "bg-amber-500"}`}
                  ></span>
                )}
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveFeed;
