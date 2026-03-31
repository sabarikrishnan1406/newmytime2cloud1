"use client";

import "./staff.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/staff/dashboard", icon: "grid_view", label: "Dashboard" },
  { href: "/staff/attendance", icon: "calendar_today", label: "Attendance" },
  { href: "/staff/payroll", icon: "payments", label: "Payroll" },
  { href: "/staff/profile", icon: "person", label: "Profile" },
];

export default function StaffLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="staff-portal flex min-h-screen antialiased overflow-x-hidden">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-6 gap-8 bg-[#050B18]/90 border-r border-white/5 staff-sidebar-glow z-50">
        {/* Logo */}
        <div className="w-12 h-12 staff-glass-card rounded-2xl flex items-center justify-center border-[#81ecff]/20">
          <span className="material-symbols-outlined text-[#81ecff] scale-125">fingerprint</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col items-center gap-6 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#81ecff]/10 text-[#81ecff]"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-6">
          <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 bg-[#0A1628]">
            <span className="material-symbols-outlined text-slate-400 w-full h-full flex items-center justify-center text-2xl">person</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-20 flex-1 min-h-screen overflow-y-auto h-screen">{children}</main>
    </div>
  );
}
