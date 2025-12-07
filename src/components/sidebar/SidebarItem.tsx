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
          className="w-full text-left py-1.5 px-3 flex items-center justify-between rounded-md relative group"
        >
          <div className="flex items-center gap-3 ml-2">
            <span
              className={`${
                isActive
                  ? "text-success group-hover:text-success-light"
                  : "text-gray-400 group-hover:text-gray-500"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`hover:text-gray-500 text-xs font-semibold ${
                isActive
                  ? "text-success group-hover:text-success-light"
                  : "text-gray-400 group-hover:text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </div>
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 text-gray-400 group-hover:text-gray-500 ${
              open ? "rotate-0" : "rotate-180"
            }`}
          />
          {isActive && (
            <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2.5 h-9 bg-success text-success-light rounded-md transition-all duration-300"></span>
          )}
        </button>

        {open && (
          <ul className="pl-6 space-y-1">
            {item.children.map((child) => {
              const childActive = pathname === child.path;
              return (
                <li key={child.label} className="relative group">
                  <Link
                    href={child.path}
                    className="flex items-center gap-3 py-1 px-3 my-2 group-hover:text-gray-500 relative"
                  >
                    <span
                      className={`hover:text-gray-500 ${
                        childActive
                          ? "text-success group-hover:text-success-light"
                          : "text-gray-400 group-hover:text-gray-500"
                      } ml-2`}
                    >
                      {child.icon}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        childActive
                          ? "text-success group-hover:text-success-light"
                          : "text-gray-400 group-hover:text-gray-500"
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
        className="flex items-center gap-3 py-1.5 px-3 relative group"
      >
        <span
          className={`hover:text-gray-500 ${
            isActive
              ? "text-success-light"
              : "text-gray-400 group-hover:text-gray-500"
          } ml-2`}
        >
          {item.icon}
        </span>
        <span
          className={`hover:text-gray-500 text-xs font-semibold ${
            isActive
              ? "text-success-light"
              : "text-gray-400 group-hover:text-gray-500"
          }`}
        >
          {item.label}
        </span>
        {isActive && (
          <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2.5 h-9 bg-gradient-to-r from-success to-success-light rounded-md transition-all duration-300"></span>
        )}
      </Link>
    </li>
  );
}
