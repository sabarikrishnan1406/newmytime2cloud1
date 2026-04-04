"use client";

import VisitorLogs from "@/components/Visitor/VisitorLogs";

export default function LogsPage() {
  return (
    <div className="p-5 overflow-y-auto max-h-[calc(100vh-64px)]">
      <VisitorLogs />
    </div>
  );
}
