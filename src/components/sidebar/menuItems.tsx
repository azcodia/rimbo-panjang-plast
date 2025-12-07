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
    icon: <LayoutDashboard size={22.5} strokeWidth={2.2} />,
  },
  {
    label: "Pengaturan Barang",
    group: "Stok & Atribut",
    icon: <Boxes size={22.5} strokeWidth={2.2} />,
    children: [
      {
        label: "Spesifikasi",
        path: "/item-arrangement/atribut",
        icon: <Cog size={22.5} strokeWidth={2.2} />,
      },
      {
        label: "Stok",
        path: "/item-arrangement/stock",
        icon: <PackageSearch size={22.5} strokeWidth={2.2} />,
      },
    ],
  },
];
