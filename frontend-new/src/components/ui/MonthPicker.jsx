"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getMonthValue = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const parseMonthValue = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const [yearValue, monthValue] = value.split("-").map(Number);
  if (!yearValue || !monthValue) {
    return null;
  }

  return new Date(yearValue, monthValue - 1, 1);
};

const formatMonthLabel = (value) => {
  const parsedMonth = parseMonthValue(value);
  if (!parsedMonth) {
    return "Select month";
  }

  return format(parsedMonth, "LLL yyyy");
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthPartsFromValue = (value) => {
  const parsedMonth = parseMonthValue(value);
  if (!parsedMonth) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      monthIndex: now.getMonth(),
    };
  }

  return {
    year: parsedMonth.getFullYear(),
    monthIndex: parsedMonth.getMonth(),
  };
};

const buildMonthValue = (year, monthIndex) => {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
};

const normalizeRange = (rangeValue) => {
  if (!rangeValue || typeof rangeValue !== "object") {
    return null;
  }

  const from = getMonthValue(parseMonthValue(rangeValue.from));
  const to = getMonthValue(parseMonthValue(rangeValue.to));

  if (!from && !to) {
    return null;
  }

  const normalizedFrom = from || to;
  const normalizedTo = to || from;

  if (!normalizedFrom || !normalizedTo) {
    return null;
  }

  if (normalizedFrom <= normalizedTo) {
    return { from: normalizedFrom, to: normalizedTo };
  }

  return { from: normalizedTo, to: normalizedFrom };
};

const formatRangeLabel = (rangeValue) => {
  const normalized = normalizeRange(rangeValue);
  if (!normalized) {
    return "Select month range";
  }

  if (normalized.from === normalized.to) {
    return formatMonthLabel(normalized.from);
  }

  return `${formatMonthLabel(normalized.from)} - ${formatMonthLabel(normalized.to)}`;
};

const isMonthInRange = (monthValue, rangeValue) => {
  const normalized = normalizeRange(rangeValue);
  if (!normalized) {
    return false;
  }

  return monthValue >= normalized.from && monthValue <= normalized.to;
};

export default function MonthPicker({
  value,
  className,
  onChange = () => {},
}) {
  const today = new Date();
  const defaultMonth = getMonthValue(new Date(today.getFullYear(), today.getMonth(), 1));
  const normalizedInitialRange = normalizeRange(value) || {
    from: defaultMonth,
    to: defaultMonth,
  };
  const initialMonthParts = monthPartsFromValue(normalizedInitialRange.to);

  const [selectedRange, setSelectedRange] = useState(normalizedInitialRange);
  const [draftFrom, setDraftFrom] = useState(normalizedInitialRange.from);
  const [draftTo, setDraftTo] = useState(normalizedInitialRange.to);
  const [selectionStep, setSelectionStep] = useState("start");
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initialMonthParts.year);

  useEffect(() => {
    const normalized = normalizeRange(value);
    if (!normalized) {
      return;
    }

    const nextParts = monthPartsFromValue(normalized.to);

    setSelectedRange(normalized);
    setDraftFrom(normalized.from);
    setDraftTo(normalized.to);
    setSelectionStep("start");
    setViewYear(nextParts.year);
  }, [value]);

  const syncDraftToSelectedRange = () => {
    const nextParts = monthPartsFromValue(selectedRange.to);
    setDraftFrom(selectedRange.from);
    setDraftTo(selectedRange.to);
    setSelectionStep("start");
    setViewYear(nextParts.year);
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      syncDraftToSelectedRange();
    }
  };

  const handleApply = () => {
    const normalized = normalizeRange({ from: draftFrom, to: draftTo || draftFrom });
    if (!normalized) {
      return;
    }

    setSelectedRange(normalized);
    setOpen(false);

    onChange(normalized);
  };

  const handleCancel = () => {
    syncDraftToSelectedRange();
    setOpen(false);
  };

  const selectedDraftRange = normalizeRange({ from: draftFrom, to: draftTo || draftFrom });

  const handlePreviousYear = () => {
    setViewYear((currentYear) => currentYear - 1);
  };

  const handleNextYear = () => {
    setViewYear((currentYear) => currentYear + 1);
  };

  const handleSelectMonth = (monthValue) => {
    if (selectionStep === "start") {
      setDraftFrom(monthValue);
      setDraftTo(monthValue);
      setSelectionStep("end");
      return;
    }

    if (monthValue >= draftFrom) {
      setDraftTo(monthValue);
    } else {
      setDraftTo(draftFrom);
      setDraftFrom(monthValue);
    }

    setSelectionStep("start");
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="month-picker"
            variant="outline"
            className="w-full justify-start text-left font-normal border border-border text-gray-600 dark:text-slate-300"
          >
            <CalendarIcon className="h-4 w-4" />
            {formatRangeLabel(selectedRange)}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/20"
          align="start"
          side="bottom"
        >
          <div className="p-3 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handlePreviousYear}
                className="h-8 w-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {viewYear}
              </span>

              <button
                type="button"
                onClick={handleNextYear}
                className="h-8 w-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MONTH_LABELS.map((monthLabel, index) => {
                const monthValue = buildMonthValue(viewYear, index);
                const isSelected =
                  monthValue === draftFrom || monthValue === draftTo;
                const isInRange = isMonthInRange(monthValue, selectedDraftRange);

                return (
                  <button
                    key={monthLabel}
                    type="button"
                    onClick={() => handleSelectMonth(monthValue)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm border transition-colors",
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : isInRange
                          ? "bg-primary/10 text-primary border-primary/30"
                        : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10"
                    )}
                  >
                    {monthLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2 border-t border-gray-200 dark:border-white/30 p-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              className="bg-white dark:bg-slate-700"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              className="bg-white dark:bg-primary"
              size="sm"
              onClick={handleApply}
              disabled={!selectedDraftRange}
            >
              <Check className="h-4 w-4" />
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
