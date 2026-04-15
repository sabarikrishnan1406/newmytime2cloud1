"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import LeaveTypesPage from "@/app/leave-dashboard/leave-types/page";
import LeaveGroupsPage from "@/app/leave-dashboard/leave-groups/page";

export default function LeaveSettingsPage() {
  const [activeTab, setActiveTab] = useState("types");

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-600 dark:text-white flex items-center gap-2">
          Leave
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure leave types and group policies</p>
      </div>

      <div className="border-b border-white/10">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("types")}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "types"
                ? "text-primary border-primary"
                : "text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            LEAVE TYPES
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "groups"
                ? "text-primary border-primary"
                : "text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            GROUPS
          </button>
        </div>
      </div>

      {activeTab === "types" ? <LeaveTypesPage /> : <LeaveGroupsPage />}
    </div>
  );
}
