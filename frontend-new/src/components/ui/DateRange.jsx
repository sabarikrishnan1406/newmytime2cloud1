"use client";

import { format, addMonths, subMonths } from "date-fns";
import { Calendar as CalendarIcon, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

import { cn, formatDateDubai } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import DropDown from "@/components/ui/DropDown";

const monthItems = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((name, idx) => ({ id: idx, name }));

export default function DateRangeSelect({
  value,
  className,
  onChange = () => {},
  numberOfMonths = 2,
  showOutsideDays = false,
  single = false,
}) {
  const [date, setDate] = useState({ from: null, to: null });
  const [draftDate, setDraftDate] = useState(date);
  const [open, setOpen] = useState(false);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date());

  const yearGridPage = useMemo(() => {
    const centerYear = viewMonth.getFullYear();
    const startYear = centerYear - (centerYear % 10) - 1;
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  }, [viewMonth]);

  useEffect(() => {
    if (value?.from || value?.to) {
      const newRange = {
        from: value.from ? new Date(value.from) : null,
        to: value.to ? new Date(value.to) : null,
      };
      setDate(newRange);
      setDraftDate(newRange);
    }
  }, [value]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setDraftDate(date);
      setYearPickerOpen(false);
    }
  };

  const handleApply = () => {
    setDate(draftDate);
    setOpen(false);
    setYearPickerOpen(false);
    onChange({
      from: formatDateDubai(draftDate.from),
      to: formatDateDubai(draftDate.to),
    });
  };

  const handleCancel = () => {
    setDraftDate(date);
    setOpen(false);
    setYearPickerOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border border-border text-gray-600 dark:text-slate-300",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {single ? (
              date?.from ? (
                format(date.from, "LLL dd, y")
              ) : (
                <span>Pick a date</span>
              )
            ) : date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/20"
          align="start"
          side="bottom"
        >
          {/* Header with month/year controls */}
          <div className="flex items-center justify-between gap-2 p-3 pb-0">
            <div className="flex gap-2 items-center">
              <div className="w-28">
                <DropDown
                  items={monthItems}
                  value={viewMonth.getMonth()}
                  onChange={(id) => setViewMonth(new Date(viewMonth.getFullYear(), Number(id), 1))}
                />
              </div>
              <button
                type="button"
                onClick={() => setYearPickerOpen(!yearPickerOpen)}
                className="px-3 h-9 rounded-md border border-border text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {viewMonth.getFullYear()}
                <span className="material-icons ml-1 text-base align-middle">expand_more</span>
              </button>
            </div>
            {!single && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    yearPickerOpen
                      ? setViewMonth(new Date(viewMonth.getFullYear() - 10, viewMonth.getMonth(), 1))
                      : setViewMonth(subMonths(viewMonth, 1))
                  }
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    yearPickerOpen
                      ? setViewMonth(new Date(viewMonth.getFullYear() + 10, viewMonth.getMonth(), 1))
                      : setViewMonth(addMonths(viewMonth, 1))
                  }
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}
          </div>

          {yearPickerOpen ? (
            <div className="p-4">
              <div className="grid grid-cols-4 gap-2">
                {yearGridPage.map((year) => {
                  const isSelected = year === viewMonth.getFullYear();
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setViewMonth(new Date(year, viewMonth.getMonth(), 1));
                        setYearPickerOpen(false);
                      }}
                      className={cn(
                        "h-10 rounded-xl text-sm font-medium transition-all",
                        isSelected
                          ? "bg-primary text-white"
                          : "text-slate-600 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      )}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            single ? (
              <Calendar
                initialFocus
                mode="single"
                month={viewMonth}
                onMonthChange={setViewMonth}
                selected={draftDate?.from || undefined}
                onSelect={(d) => setDraftDate({ from: d || null, to: d || null })}
                numberOfMonths={numberOfMonths}
                showOutsideDays={showOutsideDays}
                classNames={{ month_caption: "hidden", nav: "hidden" }}
              />
            ) : (
              <Calendar
                initialFocus
                mode="range"
                month={viewMonth}
                onMonthChange={setViewMonth}
                selected={draftDate}
                onSelect={setDraftDate}
                numberOfMonths={numberOfMonths}
                showOutsideDays={showOutsideDays}
              />
            )
          )}

          {/* Action Buttons */}
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
              disabled={single ? !draftDate?.from : !draftDate?.from || !draftDate.to}
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
