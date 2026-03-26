"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom"; // 👈 Import this
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  getYear,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import DropDown from "@/components/ui/DropDown";

// ✅ Helpers (Keep your existing ones)
function formatDate(date) {
  if (!(date instanceof Date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDate(input) {
  if (!input) return null;
  if (input instanceof Date)
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  const parts = input.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

export default function DatePicker({
  value = null,
  onChange = () => {},
  placeholder = "Pick a date",
  className = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    isAbove: false,
  });

  const containerRef = useRef(null);
  const displayDate = normalizeDate(value);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 1. Logic to calculate where the button is on the screen
  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // 380px is a safe estimate for your calendar height + padding
      const overflowBottom = rect.bottom + 380 > window.innerHeight;

      setCoords({
        top: overflowBottom
          ? rect.top + window.scrollY - 10 // Position above
          : rect.bottom + window.scrollY + 10, // Position below
        left: rect.left + window.scrollX,
        width: rect.width,
        isAbove: overflowBottom,
      });
    }
  };

  useEffect(() => {
    if (open) {
      updateCoords();
      window.addEventListener("scroll", updateCoords);
      window.addEventListener("resize", updateCoords);
      setViewDate(displayDate || new Date());
    }
    return () => {
      window.removeEventListener("scroll", updateCoords);
      window.removeEventListener("resize", updateCoords);
    };
  }, [open]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        // We also check if the click was inside the portal (optional but safer)
        if (!event.target.closest(".datepicker-portal")) {
          setOpen(false);
        }
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Dropdown Data & Grid Logic
  const monthItems = useMemo(
    () =>
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].map((name, idx) => ({ id: idx, name })),
    [],
  );

  const yearItems = useMemo(() => {
    const currentYear = getYear(new Date());
    return Array.from({ length: 120 }, (_, i) => ({
      id: currentYear - 100 + i,
      name: (currentYear - 100 + i).toString(),
    })).reverse();
  }, []);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate));
    const end = endOfWeek(endOfMonth(viewDate));
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  const handleDateSelect = (date) => {
    onChange(formatDate(date));
    setOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`h-11 flex items-center justify-between w-full p-5 text-left border rounded-xl shadow-sm bg-white dark:bg-slate-900 transition-all
          ${open ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-200 dark:border-white/10"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-slate-300"}
        `}
      >
        <span
          className={
            !displayDate
              ? "text-slate-400"
              : "text-slate-700 dark:text-slate-200"
          }
        >
          {displayDate ? formatDate(displayDate) : placeholder}
        </span>
        <CalendarIcon className="w-5 h-5 text-slate-400" />
      </button>

      {/* ⚡️ THE PORTAL ⚡️ */}
      {open &&
        createPortal(
          <div
            className={`datepicker-portal fixed p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl animate-in fade-in duration-200 ${
              coords.isAbove
                ? "slide-in-from-bottom-2"
                : "zoom-in-95 slide-in-from-top-2"
            }`}
            style={{
              zIndex: 9999,
              // If it's above, we need to translate it up by its own height
              transform: coords.isAbove ? "translateY(-100%)" : "none",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              minWidth: "350px",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2 flex-1">
                  <div className="w-32">
                    <DropDown
                      items={monthItems}
                      value={viewDate.getMonth()}
                      onChange={(id) =>
                        setViewDate(new Date(viewDate.setMonth(Number(id))))
                      }
                    />
                  </div>
                  <div className="w-24">
                    <DropDown
                      items={yearItems}
                      value={viewDate.getFullYear()}
                      onChange={(id) =>
                        setViewDate(new Date(viewDate.setFullYear(Number(id))))
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewDate(subMonths(viewDate, 1))}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewDate(addMonths(viewDate, 1))}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-b border-slate-100 dark:border-white/5 pb-2 text-center text-[10px] font-bold text-slate-400 uppercase">
                {daysOfWeek.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  const isSelected = displayDate && isSameDay(day, displayDate);
                  const isCurrentMonth = isSameMonth(day, viewDate);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all
                      ${!isCurrentMonth ? "text-slate-300 dark:text-slate-700 opacity-30" : "text-slate-600 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"}
                      ${isSelected ? "!bg-blue-600 !text-white" : ""}
                    `}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body, // 👈 Teleports to the end of the body
        )}
    </div>
  );
}
