"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Branch from "@/components/Branch/Page";
import Department from "@/components/Department/Page";
import Device from "@/components/Device/Page";
import ShiftPage from "@/app/shift/page";
import SchedulePage from "@/app/schedule/page";
import EmployeesPage from "@/app/employees/page";

export default function Index() {
    const [stepIndex, setStepIndex] = useState(0);

    const steps = [
        {
            id: 1,
            label: "Step 1",
            sidebarTitle: "Branch Info",
            title: "Branch Information",
            subtitle: "Create branch Info",
            content: (
                <Branch />
            ),
        },
        {
            id: 2,
            label: "Step 2",
            sidebarTitle: "Department Info",
            title: "Department Information",
            subtitle: "Now, add your departments.",
            content: (
                <Department />),
        },
        {
            id: 3,
            label: "Step 3",
            sidebarTitle: "Device Info",
            title: "Department Information",
            subtitle: "Now, add your departments.",
            content: (
                <Device />),
        },
        {
            id: 4,
            label: "Step 4",
            sidebarTitle: "Shift Info",
            title: "Department Information",
            subtitle: "Now, add your departments.",
            content: <ShiftPage />,
        },
        {
            id: 5,
            label: "Step 5",
            sidebarTitle: "Employee Info",
            title: "Department Information",
            subtitle: "Now, add your departments.",
            content: <EmployeesPage />,
        },
        {
            id: 6,
            label: "Step 6",
            sidebarTitle: "Assign Schedule",
            title: "Department Information",
            subtitle: "Now, add your departments.",
            content: <SchedulePage />,
        },
    ];

    const currentStep = steps[stepIndex];
    const isLastStep = stepIndex === steps.length - 1;


    const handleNext = async () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            setOpen(false); // close dialog on finish
        }
    };

    const handleBack = async () => {
        setStepIndex(stepIndex - 1);
    };

    return (
        <Card className="flex flex-col md:flex-row border-none shadow-none rounded-none h-[calc(100vh-64px)]">
            {/* Sidebar Stepper */}
            <CardContent className="w-full md:w-[280px] shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 p-6 bg-gray-50 dark:bg-[#0a1128]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">settings</span>
                    </div>
                    <div>
                        <div className="text-gray-900 dark:text-white font-bold text-base leading-tight">Setup</div>
                        <div className="text-gray-400 dark:text-slate-500 text-[10px]">Step {stepIndex + 1} of {steps.length}</div>
                    </div>
                </div>

                {/* Steps */}
                <nav className="flex md:flex-col gap-1.5">
                    {steps.map((step, index) => {
                        const isActive = index === stepIndex;
                        const isCompleted = index < stepIndex;
                        const stepNum = index + 1;

                        return (
                            <button
                                key={step.id}
                                onClick={() => setStepIndex(index)}
                                className={[
                                    "w-full text-left rounded-xl px-4 py-3.5 transition-all flex items-center gap-3.5 cursor-pointer group",
                                    isActive
                                        ? "bg-indigo-600 dark:bg-indigo-500/15 text-white dark:text-indigo-300 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10"
                                        : isCompleted
                                            ? "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                            : "text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/5",
                                ].join(" ")}
                            >
                                {/* Step Number Circle */}
                                <div className={[
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                                    isActive
                                        ? "bg-white/20 dark:bg-indigo-400/20 text-white dark:text-indigo-300"
                                        : isCompleted
                                            ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                            : "bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-slate-600 group-hover:bg-gray-300 dark:group-hover:bg-white/10",
                                ].join(" ")}>
                                    {isCompleted ? (
                                        <span className="material-symbols-outlined text-[16px]">check</span>
                                    ) : (
                                        stepNum
                                    )}
                                </div>

                                {/* Step Info */}
                                <div className="flex-1 min-w-0">
                                    <div className={[
                                        "font-semibold text-sm leading-tight truncate",
                                        isActive ? "text-white dark:text-indigo-200" : "",
                                    ].join(" ")}>
                                        {step.sidebarTitle}
                                    </div>
                                    <div className={[
                                        "text-[10px] mt-0.5",
                                        isActive ? "text-white/60 dark:text-indigo-300/50" : "text-gray-400 dark:text-slate-600",
                                    ].join(" ")}>
                                        {step.subtitle || step.label}
                                    </div>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-indigo-400 shrink-0 animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </nav>

            </CardContent>


            {/* Step Content with Framer Motion */}
            <div className="flex-1 overflow-y-auto bg-gray-100/50 dark:bg-[#0b1326]">
                <div className="flex flex-col h-full">
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={stepIndex}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="h-full p-8"
                            >
                                {currentStep.content}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between items-center px-8 py-5 border-t border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#0a1128]/50 backdrop-blur">
                        <div className="text-xs text-gray-400 dark:text-slate-500">
                            Step {stepIndex + 1} of {steps.length} — <span className="font-semibold text-gray-600 dark:text-slate-300">{currentStep.sidebarTitle}</span>
                        </div>
                        <div className="flex gap-3">
                            {stepIndex > 0 && (
                                <button onClick={handleBack}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-slate-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </button>
                            )}
                            <button onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition-all">
                                {isLastStep ? (
                                    <><Check className="h-4 w-4" /> Finish</>
                                ) : (
                                    <>Next <ArrowRight className="h-4 w-4" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
