import { MAIN_ROUTES } from "@/routes";
import { T_NavLink } from "@/types";

export const BottombarLinks: T_NavLink[] = [
  {
    href: MAIN_ROUTES.HOME,
    icon: "/assets/icons/home.svg",
    label: "Home",
  },
  {
    href: MAIN_ROUTES.EXPLORE,
    icon: "/assets/icons/wallpaper.svg",
    label: "Explore",
  },
  {
    href: MAIN_ROUTES.SAVED,
    icon: "/assets/icons/save.svg",
    label: "Saved",
  },
  {
    href: MAIN_ROUTES.CREATE_POST,
    icon: "/assets/icons/gallery-add.svg",
    label: "Create",
  },
];

export const SidebarLinks: T_NavLink[] = [
  {
    href: MAIN_ROUTES.HOME,
    icon: "/assets/icons/home.svg",
    label: "Home",
  },
  {
    href: MAIN_ROUTES.EXPLORE,
    icon: "/assets/icons/wallpaper.svg",
    label: "Explore",
  },
  {
    href: MAIN_ROUTES.PEOPLE,
    icon: "/assets/icons/people.svg",
    label: "People",
  },
  {
    href: MAIN_ROUTES.SAVED,
    icon: "/assets/icons/save.svg",
    label: "Saved",
  },
  {
    href: MAIN_ROUTES.CREATE_POST,
    icon: "/assets/icons/gallery-add.svg",
    label: "Create",
  },
];

export const demoTags: string[] = [
  "mountain",
  "funny",
  "sport",
  "modeling",
  "life style",
];
