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
    title: "menu.trucks.trucks",
    children: [
      {
        id: "trucks-list",
        title: "menu.trucks.overview",
        href: "/trucks/overview"
      },
      {
        id: "trucks-create",
        title: "menu.trucks.create",
        href: "/demo"
      }
    ],

    logo: MdDirectionsBus
  },
  {
    id: "locations",
    title: "menu.locations.locations",
    children: [
      {
        id: "buildings",
        title: "menu.locations.buildings",
        href: "/demo"
      },
      {
        id: "ships",
        title: "menu.locations.ships",
        href: "/demo"
      },
      {
        id: "tanks",
        title: "menu.locations.freestands",
        href: "/demo"
      },
      {
        id: "location-create",
        title: "menu.locations.create",
        href: "/demo"
      }
    ],

    logo: MdLocationOn
  },
  {
    id: "debtor",
    title: "menu.debtors.debtors",
    children: [
      {
        id: "debtor-list",
        title: "menu.debtors.overview",
        href: "/demo"
      },
      {
        id: "debtor-create",
        title: "menu.debtors.create",
        href: "/demo"
      }
    ],

    logo: MdAttachMoney
  },
  {
    id: "stats",
    title: "menu.statistics",
    href: "/locale",

    logo: MdArchive
  }
];
