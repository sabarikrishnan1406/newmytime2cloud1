"use client";

import "./staff.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/staff/dashboard", icon: "grid_view", label: "Dashboard" },
  { href: "/staff/attendance", icon: "event_available", label: "Attendance" },
  { href: "/staff/schedule", icon: "schedule", label: "Schedule" },
  { href: "/staff/documents", icon: "description", label: "Documents" },
  { href: "/staff/reports", icon: "bar_chart", label: "Reports" },
];

export default function StaffLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="staff-portal flex min-h-screen antialiased overflow-x-hidden">
      {/* SIDE NAVIGATION */}
      <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-6 gap-4 bg-[#070e1b]/80 backdrop-blur-xl border-r border-[#81ecff]/10 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-50">
        {/* Logo */}
        <div className="mb-2">
          <div className="w-10 h-10 bg-[#00e3fd] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(129,236,255,0.4)]">
            <span className="material-symbols-outlined text-[#004d57] font-bold text-[20px]">bolt</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col items-center gap-4 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`w-10 h-10 flex items-center justify-center rounded-2xl hover:scale-110 transition-all duration-200 ${
                  isActive
                    ? "bg-[#00e3fd]/10 text-[#81ecff] shadow-[0_0_15px_rgba(129,236,255,0.2)]"
                    : "text-[#a5abbd] hover:bg-[#81ecff]/5"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Settings & Profile */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <button className="w-10 h-10 flex items-center justify-center text-[#a5abbd] hover:bg-[#81ecff]/5 rounded-2xl hover:scale-110 transition-all duration-200">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-9 h-9 rounded-lg overflow-hidden ring-2 ring-[#81ecff]/20 bg-[#1c2639]">
            <span className="material-symbols-outlined text-[#a5abbd] w-full h-full flex items-center justify-center text-xl">person</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-16 flex-1 min-h-screen overflow-y-auto h-screen">{children}</main>
    </div>
  );
}
