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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="mt-4 mr-4 rounded-lg bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {(pathname.split("/").pop() || "dashboard")
              .charAt(0)
              .toUpperCase() +
              (pathname.split("/").pop() || "dashboard").slice(1)}
          </h1>
        </header>

        <main className="flex-1 py-3 mr-4 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
