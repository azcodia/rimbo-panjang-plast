import {
  LayoutDashboard,
  Boxes,
  Cog,
  PackageSearch,
  UserPlus2Icon,
  LandmarkIcon,
} from "lucide-react";
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
    label: "Item Arrangement",
    group: "Stock, Atribut & Other",
    icon: <Boxes size={22.5} strokeWidth={2.2} />,
    children: [
      {
        label: "Spesifikasi",
        path: "/item-arrangement/atribut",
        icon: <Cog size={22.5} strokeWidth={2.2} />,
      },
      {
        label: "Stock",
        path: "/item-arrangement/stock",
        icon: <PackageSearch size={22.5} strokeWidth={2.2} />,
      },
    ],
  },
  {
    label: "Customer",
    path: "/customers/customer",
    group: "Stock, Atribut & Other",
    icon: <UserPlus2Icon size={22.5} strokeWidth={2.2} />,
  },
  {
    label: "Bank",
    path: "/banks/bank",
    group: "Stock, Atribut & Other",
    icon: <LandmarkIcon size={22.5} strokeWidth={2.2} />,
  },
  {
    label: "Transaction",
    group: "Transaction",
    icon: <Boxes size={22.5} strokeWidth={2.2} />,
    children: [
      {
        label: "Re Stock",
        path: "/transactions/re-stock",
        icon: <Cog size={22.5} strokeWidth={2.2} />,
      },
      {
        label: "Delivery",
        path: "/transactions/delivery",
        icon: <PackageSearch size={22.5} strokeWidth={2.2} />,
      },
    ],
  },
];
