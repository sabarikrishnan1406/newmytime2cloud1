"use client";

import { usePathname } from "next/navigation";
import LeftMenu from "@/components/leftMenu";
import Header from "@/components/Header";
import MainContentWrapper from "@/components/MainContentWrapper";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isStaffRoute = pathname?.startsWith("/staff");
  const isLoginRoute = pathname === "/login";

  // Staff and login pages render their own layout
  if (isStaffRoute || isLoginRoute) {
    return <>{children}</>;
  }

  // Admin/Manager layout with Header + LeftMenu
  return (
    <>
      <Header />
      <div className="flex flex-1">
        <LeftMenu />
        <MainContentWrapper>{children}</MainContentWrapper>
      </div>
    </>
  );
}
