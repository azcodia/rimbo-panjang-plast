"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../store/slice/authSlice";
import SidebarGroup from "./SidebarGroup";
import { MenuItem, menuItems } from "./menuItems";

export default function Sidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    dispatch(logoutAction());
    window.location.href = "/login";
  };

  const groupedMenu = menuItems.reduce(
    (acc: Record<string, MenuItem[]>, item) => {
      const groupName = item.group || "Others";
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(item);
      return acc;
    },
    {}
  );

  return (
    <aside className="w-64 bg-white shadow-md rounded-lg m-4 flex flex-col">
      <div className="flex justify-center items-center pb-6 pt-4">
        <div className="border-b p-2.5">
          <Image src="/images/logo.png" width={200} height={125} alt="Logo" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {Object.entries(groupedMenu).map(([groupName, items]) => (
          <SidebarGroup
            key={groupName}
            groupName={groupName}
            items={items}
            pathname={pathname}
          />
        ))}
      </nav>

      <div className="px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-danger-light text-white rounded hover:bg-danger"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
