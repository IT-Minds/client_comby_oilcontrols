import { IconType } from "react-icons";
import { MdArchive, MdAttachMoney, MdDirectionsBus, MdLocationOn } from "react-icons/md";

export interface ChildLink {
  id: string;
  title: string;
  href: string;
}

export interface MenuLink {
  id: string;
  title: string;

  logo: IconType;

  children?: ChildLink[];

  href?: string;
}

export const testLinks: MenuLink[] = [
  {
    id: "trucks",
    title: "Trucks",
    children: [
      {
        id: "trucks-list",
        title: "View Trucks",
        href: "/demo"
      },
      {
        id: "trucks-create",
        title: "Create New Truck",
        href: "/demo"
      }
    ],

    logo: MdDirectionsBus
  },
  {
    id: "locations",
    title: "Locations",
    children: [
      {
        id: "buildings",
        title: "Building Overview",
        href: "/demo"
      },
      {
        id: "ships",
        title: "Ships Overview",
        href: "/demo"
      },
      {
        id: "tanks",
        title: "Free-standing Tank Overview",
        href: "/demo"
      }
    ],

    logo: MdLocationOn
  },
  {
    id: "debtor",
    title: "Debtor",
    children: [
      {
        id: "debtor-list",
        title: "View Debtors",
        href: "/demo"
      },
      {
        id: "debtor-create",
        title: "Create New Debtor",
        href: "/demo"
      }
    ],

    logo: MdAttachMoney
  },
  {
    id: "stats",
    title: "Statistics",
    href: "/demo",

    logo: MdArchive
  }
];
