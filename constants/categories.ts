import Animaux from "@/assets/images/categories/Animaux.png";
import Art from "@/assets/images/categories/Art.png";
import Bebe from "@/assets/images/categories/Bebe.png";
import Computer from "@/assets/images/categories/Computer.png";
import Cosmetic from "@/assets/images/categories/Cosmetic.png";
import House from "@/assets/images/categories/House.png";
import Meubles from "@/assets/images/categories/Meubles.png";
import Outils from "@/assets/images/categories/Outils.png";
import Services from "@/assets/images/categories/Services.png";
import Sport from "@/assets/images/categories/Sport.png";
import Vehicules from "@/assets/images/categories/Vehicules.png";
import Accessoires from "@/assets/images/sub-categories/Accessoires.png";
import AccessoiresBebe from "@/assets/images/sub-categories/AccessoiresBebe.png";
import AccessoiresEtAlimentationAnimaux from "@/assets/images/sub-categories/AccessoiresEtAlimentationAnimaux.png";
import AppareilsElectromenagers from "@/assets/images/sub-categories/AppareilsElectromenagers.png";
import BricolageEtOutils from "@/assets/images/sub-categories/BricolageEtOutils.png";
import BureauxEtFournitures from "@/assets/images/sub-categories/BureauxEtFournitures.png";
import BurreauxEtMagasin from "@/assets/images/sub-categories/BurreauxEtMagasin.png";
import BœufsEtVaches from "@/assets/images/sub-categories/BœufsEtVaches.png";
import CamionsEtBus from "@/assets/images/sub-categories/CamionsEtBus.png";
import Chaussures from "@/assets/images/sub-categories/Chaussures.png";
import ChiensEtChats from "@/assets/images/sub-categories/ChiensEtChats.png";
import CoursEtFormations from "@/assets/images/sub-categories/CoursEtFormations.png";
import CuisineEtUstensiles from "@/assets/images/sub-categories/CuisineEtUstensiles.png";
import InstrumentsDeMusique from "@/assets/images/sub-categories/InstrumentsDeMusique.png";
import Jeux from "@/assets/images/sub-categories/Jeux.png";
import JouetsBebe from "@/assets/images/sub-categories/JouetsBebe.png";
import Livres from "@/assets/images/sub-categories/Livres.png";
import Location from "@/assets/images/sub-categories/Location.png";
import MaisonAVendre from "@/assets/images/sub-categories/MaisonAVendre.png";
import MaterielAgricole from "@/assets/images/sub-categories/MaterielAgricole.png";
import MaterielDeConstruction from "@/assets/images/sub-categories/MaterielDeConstruction.png";
import MaterielDeSport from "@/assets/images/sub-categories/MaterielDeSport.png";
import MeublesEtDeco from "@/assets/images/sub-categories/MeublesEtDeco.png";
import MontresEtBijoux from "@/assets/images/sub-categories/MontresEtBijoux.png";
import MotosEtTricycles from "@/assets/images/sub-categories/MotosEtTricycles.png";
import MoutonsEtChevres from "@/assets/images/sub-categories/MoutonsEtChevres.png";
import ObjetsArt from "@/assets/images/sub-categories/ObjetsArt.png";
import OrdinateursEtTablettes from "@/assets/images/sub-categories/OrdinateursEtTablettes.png";
import Outillage from "@/assets/images/sub-categories/Outillage.png";
import PeintureEtDecoration from "@/assets/images/sub-categories/PeintureEtDecoration.png";
import PiecesEtAccessoires from "@/assets/images/sub-categories/PiecesEtAccessoires.png";
import PoterieEtSculpture from "@/assets/images/sub-categories/PoterieEtSculpture.png";
import ProduitsDeBeaute from "@/assets/images/sub-categories/ProduitsDeBeaute.png";
import ReparationEtMaintenance from "@/assets/images/sub-categories/ReparationEtMaintenance.png";
import ServicesADomicile from "@/assets/images/sub-categories/ServicesADomicile.png";
import ServicesDeReparations from "@/assets/images/sub-categories/ServicesDeReparations.png";
import ServicesEvenementiel from "@/assets/images/sub-categories/ServicesEvenementiel.png";
import TelephonesPortables from "@/assets/images/sub-categories/TelephonesPortables.png";
import Terrain from "@/assets/images/sub-categories/Terrain.png";
import TissageEtCouture from "@/assets/images/sub-categories/TissageEtCouture.png";
import TissusEtPagnes from "@/assets/images/sub-categories/TissusEtPagnes.png";
import TransportEtDemenagement from "@/assets/images/sub-categories/TransportEtDemenagement.png";
import Vetements from "@/assets/images/sub-categories/Vetements.png";
import VetementsBebe from "@/assets/images/sub-categories/VetementsBebe.png";
import Voitures from "@/assets/images/sub-categories/Voitures.png";
import Volaille from "@/assets/images/sub-categories/Volaille.png";

import { CategoriesType } from "@/types";

/* --- CATEGORIES PRINCIPALES (adaptées au Burkina Faso) --- */
export const CATEGORIES: CategoriesType = [
  {
    id: 1,
    name: "Véhicules",
    icon: Vehicules,
  },
  {
    id: 2,
    name: "Immobilier",
    icon: House,
  },
  {
    id: 3,
    name: "Informatique & High-Tech",
    icon: Computer,
  },
  {
    id: 4,
    name: "Maison & Électroménager",
    icon: Meubles,
  },
  {
    id: 5,
    name: "Mode & Beauté",
    icon: Cosmetic,
  },
  {
    id: 6,
    name: "Bébé & Enfant",
    icon: Bebe,
  },
  {
    id: 7,
    name: "Matériel Professionnel",
    icon: Outils,
  },
  {
    id: 8,
    name: "Animaux & Élevage",
    icon: Animaux,
  },
  {
    id: 9,
    name: "Sports & Loisirs",
    icon: Sport,
  },
  {
    id: 10,
    name: "Services",
    icon: Services,
  },
  {
    id: 11,
    name: "Artisanat & Culture",
    icon: Art,
  },
];

/* --- Noms des catégories --- */
export const CATEGORIES_NAMES = CATEGORIES.map((category) => category.name);

/* --- SOUS-CATEGORIES DÉTAILLÉES (tableau séparé) --- */
export const SUB_CATEGORIES = [
  { id: 1, categoryId: 2, name: "Maisons à vendre", icon: MaisonAVendre },
  { id: 2, categoryId: 2, name: "Locations", icon: Location },
  { id: 3, categoryId: 2, name: "Terrains", icon: Terrain },
  { id: 4, categoryId: 2, name: "Bureaux & magasins", icon: BurreauxEtMagasin },

  { id: 5, categoryId: 1, name: "Voitures", icon: Voitures },
  { id: 6, categoryId: 1, name: "Motos & tricycles", icon: MotosEtTricycles },
  { id: 7, categoryId: 1, name: "Camions & bus", icon: CamionsEtBus },
  {
    id: 8,
    categoryId: 1,
    name: "Pièces & accessoires",
    icon: PiecesEtAccessoires,
  },

  {
    id: 9,
    categoryId: 3,
    name: "Téléphones portables",
    icon: TelephonesPortables,
  },
  {
    id: 10,
    categoryId: 3,
    name: "Ordinateurs & tablettes",
    icon: OrdinateursEtTablettes,
  },
  { id: 11, categoryId: 3, name: "Accessoires", icon: Accessoires },
  {
    id: 12,
    categoryId: 3,
    name: "Réparation & maintenance",
    icon: ReparationEtMaintenance,
  },

  { id: 13, categoryId: 4, name: "Meubles & déco", icon: MeublesEtDeco },
  {
    id: 14,
    categoryId: 4,
    name: "Appareils électroménagers",
    icon: AppareilsElectromenagers,
  },
  {
    id: 15,
    categoryId: 4,
    name: "Cuisine & ustensiles",
    icon: CuisineEtUstensiles,
  },
  {
    id: 16,
    categoryId: 4,
    name: "Bricolage & outils",
    icon: BricolageEtOutils,
  },

  { id: 17, categoryId: 5, name: "Vêtements", icon: Vetements },
  { id: 18, categoryId: 5, name: "Chaussures", icon: Chaussures },
  { id: 19, categoryId: 5, name: "Montres & bijoux", icon: MontresEtBijoux },
  { id: 20, categoryId: 5, name: "Produits de beauté", icon: ProduitsDeBeaute },
  { id: 21, categoryId: 5, name: "Tissus & pagnes", icon: TissusEtPagnes },

  { id: 22, categoryId: 6, name: "Vêtements pour bébé", icon: VetementsBebe },
  { id: 23, categoryId: 6, name: "jouets pour bébé", icon: JouetsBebe },
  {
    id: 24,
    categoryId: 6,
    name: "Accessoires pour bébé",
    icon: AccessoiresBebe,
  },

  { id: 25, categoryId: 7, name: "Matériel de sport", icon: MaterielDeSport },
  {
    id: 26,
    categoryId: 7,
    name: "Instruments de musique",
    icon: InstrumentsDeMusique,
  },
  { id: 27, categoryId: 7, name: "Livres", icon: Livres },
  { id: 28, categoryId: 7, name: "Jeux", icon: Jeux },

  {
    id: 29,
    categoryId: 8,
    name: "Matériel de construction",
    icon: MaterielDeConstruction,
  },
  { id: 30, categoryId: 8, name: "Matériel agricole", icon: MaterielAgricole },
  { id: 31, categoryId: 8, name: "Outillage", icon: Outillage },
  {
    id: 32,
    categoryId: 8,
    name: "Bureaux & fournitures",
    icon: BureauxEtFournitures,
  },

  { id: 33, categoryId: 9, name: "Bœufs & vaches", icon: BœufsEtVaches },
  { id: 34, categoryId: 9, name: "Moutons & chèvres", icon: MoutonsEtChevres },
  { id: 35, categoryId: 9, name: "Volaille", icon: Volaille },
  { id: 36, categoryId: 9, name: "Chiens & chats", icon: ChiensEtChats },
  {
    id: 37,
    categoryId: 9,
    name: "Accessoires & alimentation d'animaux",
    icon: AccessoiresEtAlimentationAnimaux,
  },

  { id: 38, categoryId: 10, name: "Objets d’art", icon: ObjetsArt },
  {
    id: 39,
    categoryId: 10,
    name: "Poterie & sculpture",
    icon: PoterieEtSculpture,
  },
  { id: 40, categoryId: 10, name: "Tissage & couture", icon: TissageEtCouture },
  {
    id: 41,
    categoryId: 10,
    name: "Peinture & décoration",
    icon: PeintureEtDecoration,
  },

  {
    id: 42,
    categoryId: 11,
    name: "Cours & formations",
    icon: CoursEtFormations,
  },
  {
    id: 43,
    categoryId: 11,
    name: "Transport & déménagement",
    icon: TransportEtDemenagement,
  },
  {
    id: 44,
    categoryId: 11,
    name: "Services de réparations",
    icon: ServicesDeReparations,
  },
  {
    id: 45,
    categoryId: 11,
    name: "Services événementiel",
    icon: ServicesEvenementiel,
  },
  {
    id: 46,
    categoryId: 11,
    name: "Services à domicile",
    icon: ServicesADomicile,
  },
];

export const subCategoriesNames = (categoryName: string) => {
  const categoryId = CATEGORIES.find(
    (category) => category.name === categoryName
  )?.id;
  return SUB_CATEGORIES.filter(
    (subCategory) => subCategory.categoryId === categoryId
  ).map((subCategory) => subCategory.name);
};

export const subCategories = (categoryName: string) => {
  const categoryId = CATEGORIES.find(
    (category) => category.name === categoryName
  )?.id;
  return SUB_CATEGORIES.filter(
    (subCategory) => subCategory.categoryId === categoryId
  );
};
