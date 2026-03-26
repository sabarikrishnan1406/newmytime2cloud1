// app/layout.js
import "./globals.css";
import LeftMenu from "@/components/leftMenu";
import Header from "@/components/Header";
import MainContentWrapper from "@/components/MainContentWrapper";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { AuthProvider } from "@/context/AuthContext";
import { LiveAttendanceProvider } from "@/context/LiveAttendanceContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Chart.js */}
        <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>

        {/* ✅ Source Sans Pro (EXACT) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
        />

        {/* ✅ Material Icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        {/* ✅ Material Icons Outlined */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined"
        />

        {/* ✅ Material Symbols Outlined */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />

        {/* ✅ IMPORTANT: apply font to body only (do NOT use *), so icons keep their own font */}
        <style>{`
          body {
            font-family: 'Source Sans Pro', Arial, sans-serif;
          }
        `}</style>
      </head>

      <body className="text-slate-200 overflow-hidden">
        <DarkModeProvider>
          <AuthProvider>
            <LiveAttendanceProvider>
              <Header />
              <div className="flex flex-1">
                <LeftMenu />
                <MainContentWrapper>{children}</MainContentWrapper>
              </div>
            </LiveAttendanceProvider>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}