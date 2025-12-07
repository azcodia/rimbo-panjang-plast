"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-white relative transition-colors duration-200">
      <Sidebar />

      <div className="flex-col flex-1 w-[10px] ml-[315px] bg-white rounded-md">
        <header className="mt-4 mr-4 py-4 px-6 flex justify-between items-center bg-grayd shadow-md rounded-md mb-3">
          <h1 className="text-xl font-semibold">
            {(pathname.split("/").pop() || "dashboard")
              .charAt(0)
              .toUpperCase() +
              (pathname.split("/").pop() || "dashboard").slice(1)}
          </h1>
        </header>

        <main className="flex-1 py-2 mr-4 bg-grayd rounded-md">{children}</main>
      </div>
    </div>
  );
}
