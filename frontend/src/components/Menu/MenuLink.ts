import { IconType } from "react-icons";
import { MdArchive, MdAttachMoney, MdDirectionsBus, MdLocationOn, MdPeople } from "react-icons/md";

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
    href: "/trucks",

    logo: MdDirectionsBus
  },
  {
    id: "locations",
    title: "menu.locations.locations",
    children: [
      {
        id: "buildings",
        title: "menu.locations.buildings",
        href: "/locations/buildings"
      },
      {
        id: "ships",
        title: "menu.locations.ships",
        href: "/locations/ships"
      },
      {
        id: "tanks",
        title: "menu.locations.freestands",
        href: "/locations/tanks"
      }
    ],

    logo: MdLocationOn
  },
  {
    id: "debtor",
    title: "menu.debtors.debtors",
    href: "/debtors",

    logo: MdAttachMoney
  },
  {
    id: "users",
    title: "menu.users",
    href: "/users",

    logo: MdPeople
  },
  {
    id: "stats",
    title: "menu.statistics",
    href: "/locale",

    logo: MdArchive
  }
];
