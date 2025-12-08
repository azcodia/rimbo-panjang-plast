"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../store/slice/authSlice";
import SidebarGroup from "./SidebarGroup";
import { MenuItem, menuItems } from "./menuItems";
import Button from "../ui/Button";

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
    <aside className="bg-grayd rounded-md m-4 flex-col hidden xl:block w-[280px] fixed left-18 top-0 bottom-0">
      <div className="flex  pb-6 pt-4">
        <div className="border-b p-2.5">
          <Image src="/images/logo.png" width={180} height={125} alt="Logo" />
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

      <div className="px-4 py-4 absolute bottom-4 left-0 w-full">
        <Button
          type="button"
          text="Logout"
          onClick={handleLogout}
          className="w-full py-3 bg-danger text-white rounded-md hover:bg-danger-light"
        />
      </div>
    </aside>
  );
}
