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
import { CategoriesType } from "@/types";

export const CATEGORIES: CategoriesType = [
  {
    id: 1,
    name: "Imobilier",
    icon: House,
    subcategories: [
      "Vente de maisons et appartements",
      "Location longue durée",
      "Location saisonnière",
      "Terrains à vendre",
      "Bureaux & Commerces",
    ],
  },
  {
    id: 2,
    name: "Véhicules",
    icon: Vehicules,
    subcategories: [
      "Voitures d'occasion",
      "Motos & scooters",
      "Véhicules utilitaires",
      "Camions & bus",
      "Pièces détachées & accessoires",
    ],
  },
  {
    id: 3,
    name: "Informatique & High-Tech",
    icon: Computer,
    subcategories: [
      "Téléphones & tablettes",
      "Ordinateurs & accessoires",
      "TV & home cinéma",
      "Jeux vidéo & consoles",
      "Photo & caméras",
    ],
  },
  {
    id: 4,
    name: "Maison & Équipement",
    icon: Meubles,
    subcategories: [
      "Meubles & décoration",
      "Électroménager",
      "Cuisine & vaisselle",
      "Bricolage & outillage",
      "Jardin & plein air",
    ],
  },
  {
    id: 5,
    name: "Mode & Beauté",
    icon: Cosmetic,
    subcategories: [
      "Vêtements homme",
      "Vêtements femme",
      "Chaussures",
      "Montres & bijoux",
      "Cosmétiques & soins",
    ],
  },
  {
    id: 6,
    name: "Bébé & Enfant",
    icon: Bebe,
    subcategories: [
      "Vêtements bébé",
      "Poussettes & sièges auto",
      "Jouets",
      "Lits & mobilier bébé",
      "Équipements de puériculture",
    ],
  },
  {
    id: 7,
    name: "Loisirs & Sports",
    icon: Sport,
    subcategories: [
      "Vélos & trottinettes",
      "Matériel de sport",
      "Instruments de musique",
      "Livres & BD",
      "Jeux de société",
    ],
  },
  {
    id: 8,
    name: "Matériel Professionnel",
    icon: Outils,
    subcategories: [
      "Matériel de chantier",
      "Outillage pro",
      "Équipement de bureau",
      "Stock & liquidation",
      "Matériel agricole",
    ],
  },
  {
    id: 9,
    name: "Art, Collection & Antiquités",
    icon: Art,
    subcategories: [
      "Objets de collection",
      "Œuvres d'art",
      "Antiquités",
      "Timbres & monnaies",
      "Vin & spiritueux",
    ],
  },
  {
    id: 10,
    name: "Animaux",
    icon: Animaux,
    subcategories: [
      "Chiens & chats",
      "Oiseaux & rongeurs",
      "Poissons & aquariums",
      "Accessoires & nourriture",
      "Services pour animaux",
    ],
  },
  {
    id: 11,
    name: "Services",
    icon: Services,
    subcategories: [
      "Cours & formations",
      "Réparations & bricolage",
      "Événementiel & mariage",
      "Transport & déménagement",
      "Aide à domicile",
    ],
  },
];

export const CATEGORIES_NAMES =  CATEGORIES.map((category) => category.name);
