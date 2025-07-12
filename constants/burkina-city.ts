import { BurkinaCitiesByRegionType } from "@/types";

export const burkinaCitiesByRegion: BurkinaCitiesByRegionType = [
  {
    region: "Centre",
    cities: [
      "Ouagadougou",
      "Tanghin",
      "Pissy",
      "Kossodo",
      "Dassasgho",
      "Tampouy",
    ],
  },
  {
    region: "Hauts-Bassins",
    cities: ["Bobo-Dioulasso", "Houndé", "Orodara", "Toussiana", "Satiri"],
  },
  {
    region: "Centre-Ouest",
    cities: ["Koudougou", "Réo", "Léo", "Sapouy"],
  },
  {
    region: "Centre-Sud",
    cities: ["Manga", "Pô", "Kombissiri"],
  },
  {
    region: "Est",
    cities: ["Fada N'Gourma", "Bogandé", "Diapaga", "Gayéri", "Kantchari"],
  },
  {
    region: "Nord",
    cities: ["Ouahigouya", "Titao", "Gourcy", "Séguénéga"],
  },
  {
    region: "Sahel",
    cities: ["Dori", "Djibo", "Gorom-Gorom", "Sebba"],
  },
  {
    region: "Centre-Nord",
    cities: ["Kaya", "Kongoussi", "Boulsa", "Barsalogho"],
  },
  {
    region: "Centre-Est",
    cities: ["Tenkodogo", "Koupéla", "Zabré", "Bittou"],
  },
  {
    region: "Plateau-Central",
    cities: ["Ziniaré", "Zorgho", "Boussé"],
  },
  {
    region: "Sud-Ouest",
    cities: ["Gaoua", "Diébougou", "Kampti", "Batié"],
  },
  {
    region: "Boucle du Mouhoun",
    cities: ["Dédougou", "Nouna", "Tougan", "Boromo"],
  },
  {
    region: "Cascades",
    cities: ["Banfora", "Sindou", "Niangoloko"],
  },
];

export const burkinaCity = (withAllCity = true) => {
  if (withAllCity)
    return [
      "Tout le Burkina Faso",
      ...burkinaCitiesByRegion.flatMap((region) => region.cities),
    ];
  return [...burkinaCitiesByRegion.flatMap((region) => region.cities)];
};
