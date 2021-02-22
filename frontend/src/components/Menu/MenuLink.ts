import { IconType } from "react-icons";
import { MdArchive, MdAttachMoney, MdDirectionsBus, MdLocationOn, MdPeople } from "react-icons/md";
import { WiDaySnow } from "react-icons/wi";
import { Action } from "services/backend/nswagts";

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
  access: Action;
}

export const testLinks: MenuLink[] = [
  {
    id: "trucks",
    title: "menu.trucks.trucks",
    href: "/trucks",

    logo: MdDirectionsBus,
    access: Action.GET_TRUCK
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

    logo: MdLocationOn,
    access: Action.GET_LOCATION
  },
  {
    id: "debtor",
    title: "menu.debtors.debtors",
    href: "/debtors",

    logo: MdAttachMoney,
    access: Action.GET_DEBTOR
  },
  {
    id: "debtor",
    title: "menu.temperature.temperature",
    href: "/temperature",

    logo: WiDaySnow,
    access: Action.SET_TEMPERATURE
  },
  {
    id: "users",
    title: "menu.users",
    href: "/users",

    logo: MdPeople,
    access: Action.GET_ROLES
  },
  {
    id: "stats",
    title: "menu.statistics",
    href: "/locale",

    logo: MdArchive,
    access: Action.GET_DEBTOR
  }
];
