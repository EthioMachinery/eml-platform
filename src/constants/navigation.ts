import {
  LayoutDashboard,
  Search,
  Upload,
  Truck,
  Users,
  Briefcase,
  Wrench,
  ShieldCheck,
  Fuel,
  Building2,
} from "lucide-react";

export const NAVIGATION = [
  {
    key: "dashboard",

    href: "/dashboard",

    icon: LayoutDashboard,
  },

  {
    key: "browse",

    href: "/browse",

    icon: Search,
  },

  {
    key: "upload",

    href: "/upload",

    icon: Upload,
  },

  {
    key: "fleet",

    href: "/fleet",

    icon: Truck,
  },

  {
    key: "operators",

    href: "/operators",

    icon: Users,
  },

  {
    key: "jobs",

    href: "/jobs",

    icon: Briefcase,
  },

  {
    key: "mechanics",

    href: "/mechanics",

    icon: Wrench,
  },

  {
    key: "insurance",

    href: "/insurance",

    icon: ShieldCheck,
  },

  {
    key: "fuel",

    href: "/fuel",

    icon: Fuel,
  },

  {
    key: "enterprise",

    href: "/enterprise",

    icon: Building2,
  },
] as const;