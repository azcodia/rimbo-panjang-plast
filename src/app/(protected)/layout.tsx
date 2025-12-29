"use client";

import Sidebar from "@/components/sidebar/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white relative transition-colors duration-200 overflow-y-auto scrollbar-auto-hide">
      <Sidebar />

      <div className="flex-col flex-1 w-[10px] ml-[270px] bg-white rounded-md">
        <main className="flex-1 bg-white rounded-md">{children}</main>
      </div>
    </div>
  );
}
