"use client";

import { MenuItem } from "./menuItems";
import SidebarItem from "./SidebarItem";

type SidebarGroupProps = {
  groupName: string;
  items: MenuItem[];
  pathname: string;
};

export default function SidebarGroup({
  groupName,
  items,
  pathname,
}: SidebarGroupProps) {
  return (
    <div className="mb-3">
      <h3 className="text-gray-400 uppercase text-sm font-semibold px-5 mb-2">
        {groupName}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <SidebarItem key={item.label} item={item} pathname={pathname} />
        ))}
      </ul>
    </div>
  );
}
