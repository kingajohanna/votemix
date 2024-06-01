import { PersonData } from "../components/EditablePersonTable";
import { PartyData } from "../components/EditableTable";

export const initialEP: PartyData[] = [
  { id: 1, name: "Fidesz-KDNP", percentage: 0, mandates: 0, color: "#F58D42" },
  {
    id: 2,
    name: "Tisza Párt",
    percentage: 0,
    mandates: 0,
    color: "#E56750",
  },
  {
    id: 3,
    name: "DK–MSZP–Párbeszéd",
    percentage: 0,
    mandates: 0,
    color: "#1063a9",
  },
  { id: 6, name: "MKKP", percentage: 0, mandates: 0, color: "#da0000" },
  {
    id: 4,
    name: "Mi Hazánk",
    percentage: 0,
    mandates: 0,
    color: "#6a8c1c",
  },
  { id: 5, name: "Momentum", percentage: 0, mandates: 0, color: "#9069d4" },
  {
    id: 9,
    name: "Mindenki Magyarországa Néppárt",
    percentage: 0,
    mandates: 0,
    color: "#011166",
  },
  { id: 7, name: "Jobbik", percentage: 0, mandates: 0, color: "#111" },
  {
    id: 8,
    name: "Második Reformkor",
    percentage: 0,
    mandates: 0,
    color: "#f2db7d",
  },

  { id: 10, name: "LMP", percentage: 0, mandates: 0, color: "#7dc340" },
  { id: 11, name: "MEMO", percentage: 0, mandates: 0, color: "#e51e25" },
];

export const initialBpList: PartyData[] = [
  { id: 1, name: "Fidesz-KDNP", percentage: 0, mandates: 0, color: "#F58D42" },
  {
    id: 3,
    name: "DK–MSZP–Párbeszéd",
    percentage: 0,
    mandates: 0,
    color: "#1063a9",
  },
  {
    id: 2,
    name: "Tisza Párt",
    percentage: 0,
    mandates: 0,
    color: "#E56750",
  },
  { id: 7, name: "MKKP", percentage: 0, mandates: 0, color: "#da0000" },
  { id: 4, name: "VDBP-LMP", percentage: 0, mandates: 0, color: "#7dc340" },
  { id: 6, name: "Momentum", percentage: 0, mandates: 0, color: "#9069d4" },
  {
    id: 5,
    name: "Mi Hazánk",
    percentage: 0,
    mandates: 0,
    color: "#6a8c1c",
  },
  {
    id: 8,
    name: "Nép Pártján",
    percentage: 0,
    mandates: 0,
    color: "#023756",
  },
  {
    id: 9,
    name: "Munkáspárt",
    percentage: 0,
    mandates: 0,
    color: "#c5161d",
  },
  {
    id: 10,
    name: "Szolidaritás-Lokálpatrióták7-Helló Pesterzsébetiek",
    percentage: 0,
    mandates: 0,
    color: "#505761",
  },
];

export const initialMayor: PersonData[] = [
  {
    id: 2,
    name: "Karácsony Gergely",
    percentage: 0,
    party: "DK–MSZP–Párbeszéd",
    color: "#1063a9",
  },
  {
    id: 1,
    name: "Szentkirályi Alexandra",
    percentage: 0,
    color: "#F58D42",
    party: "Fidesz-KDNP",
  },
  {
    id: 3,
    name: "Vitézy Dávid",
    percentage: 0,
    party: "VDBP-LMP",
    color: "#A0CDFF",
  },
  {
    id: 4,
    name: "Grundtner András",
    percentage: 0,
    party: "Mi Hazánk",
    color: "#6a8c1c",
  },
];

export const initialNine: PersonData[] = [
  {
    id: 1,
    name: "Gyurákovics Andrea",
    percentage: 0,
    party: "Fidesz-KDNP",
    color: "#F58D42",
  },
  {
    id: 2,
    name: "Baranyi Krisztina",
    percentage: 0,
    party: "BKFE",
    color: "#e40e7e",
  },
  {
    id: 3,
    name: "Dr. Gegesy Ferenc",
    percentage: 0,
    party: "Független",
    color: "#e6f238",
  },
  {
    id: 4,
    name: "Kvacskay Károly",
    percentage: 0,
    party: "Mi Hazánk",
    color: "#6a8c1c",
  },
  {
    id: 5,
    name: "Cséplő Dániel",
    percentage: 0,
    party: "Szol-LP7-HPE",
    color: "#505761",
  },
];

export const initialTwelve: PersonData[] = [
  {
    id: 2,
    name: "Kovács Gergely",
    percentage: 0,
    party: "MKKP",
    color: "#da0000",
  },
  {
    id: 1,
    name: "Fonti Krisztina",
    percentage: 0,
    party: "Fidesz-KDNP",
    color: "#F58D42",
  },

  {
    id: 3,
    name: "Binder Csaba",
    percentage: 0,
    party: "Mi Hazánk",
    color: "#6a8c1c",
  },
  {
    id: 4,
    name: "Dr. Vincze Géza",
    percentage: 0,
    party: "Szol-LP7-HPE",
    color: "#505761",
  },
];
