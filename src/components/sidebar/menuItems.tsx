import { LayoutDashboard, Boxes, Cog, PackageSearch } from "lucide-react";
import { ReactNode } from "react";

export type MenuItem = {
  label: string;
  path?: string;
  icon?: ReactNode;
  children?: { label: string; path: string; icon?: ReactNode }[];
  group?: string;
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    group: "Menu",
    icon: <LayoutDashboard size={18} strokeWidth={2} />,
  },
  {
    label: "Pengaturan Barang",
    group: "Stok & Atribut",
    icon: <Boxes size={18} strokeWidth={2} />,
    children: [
      {
        label: "Spesifikasi",
        path: "/item-arrangement/grouping",
        icon: <Cog size={18} strokeWidth={2} />,
      },
      {
        label: "Stok",
        path: "/profile",
        icon: <PackageSearch size={18} strokeWidth={2} />,
      },
    ],
  },
];
