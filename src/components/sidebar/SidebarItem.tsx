"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MenuItem } from "./menuItems";

type SidebarItemProps = {
  item: MenuItem;
  pathname: string;
};

export default function SidebarItem({ item, pathname }: SidebarItemProps) {
  const [open, setOpen] = useState(false);

  const isActive =
    pathname === item.path ||
    (item.children?.some((c) => c.path === pathname) ?? false);

  const toggleMenu = () => setOpen(!open);

  if (item.children) {
    return (
      <li className="relative">
        <button
          onClick={toggleMenu}
          className="w-full text-left py-1.5 px-3 flex items-center justify-between hover:bg-gray-50 rounded relative"
        >
          <div className="flex items-center gap-3 ml-2">
            <span className={`${isActive ? "text-success" : "text-gray-400"}`}>
              {item.icon}
            </span>
            <span
              className={`text-xs font-semibold ${
                isActive ? "text-success" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </div>
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 text-gray-400 ${
              open ? "rotate-0" : "rotate-180"
            }`}
          />
          {isActive && (
            <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2.5 h-9 bg-success rounded-3xl transition-all duration-300"></span>
          )}
        </button>

        {open && (
          <ul className="pl-6 space-y-1">
            {item.children.map((child) => {
              const childActive = pathname === child.path;
              return (
                <li key={child.label} className="relative">
                  <Link
                    href={child.path}
                    className="flex items-center gap-3 py-1 px-3 my-2 hover:bg-gray-50 relative"
                  >
                    <span
                      className={`${
                        childActive ? "text-success" : "text-gray-400"
                      } ml-2`}
                    >
                      {child.icon}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        childActive ? "text-success" : "text-gray-400"
                      }`}
                    >
                      {child.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="relative">
      <Link
        href={item.path!}
        className="flex items-center gap-3 py-1.5 px-3 hover:bg-gray-50 relative"
      >
        <span className={`${isActive ? "text-success" : "text-gray-400"} ml-2`}>
          {item.icon}
        </span>
        <span
          className={`text-xs font-semibold ${
            isActive ? "text-success" : "text-gray-400"
          }`}
        >
          {item.label}
        </span>
        {isActive && (
          <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2.5 h-9 bg-success rounded-3xl transition-all duration-300"></span>
        )}
      </Link>
    </li>
  );
}
