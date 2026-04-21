"use client";

import { usePathname } from "next/navigation";
import LeftMenu from "@/components/leftMenu";
import Header from "@/components/Header";
import MainContentWrapper from "@/components/MainContentWrapper";
import dynamic from "next/dynamic";

const VoiceButton = dynamic(() => import("@/components/Voice/VoiceButton"), { ssr: false });

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  // Normalize: strip trailing slash so checks work whether `trailingSlash` is on or off.
  const path = pathname?.replace(/\/$/, "") || "";
  const isStaffRoute = path.startsWith("/staff");
  const isLoginRoute = path === "/login" || path.startsWith("/login/");

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
      <VoiceButton />
    </>
  );
}
