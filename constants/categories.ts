import { CategoriesType, SubCategoriesType } from "@/types";

export const CATEGORIES: CategoriesType = [
  { id: 1, name: "Véhicules", icon: "car" },
  { id: 2, name: "Immobilier", icon: "home" },
  { id: 3, name: "Informatique & High-Tech", icon: "laptop" },
  { id: 4, name: "Maison & Électroménager", icon: "sofa" },
  { id: 5, name: "Mode & Beauté", icon: "hanger" },
  { id: 6, name: "Bébé & Enfant", icon: "baby-carriage" },
  { id: 7, name: "Matériel Professionnel", icon: "wrench" },
  { id: 8, name: "Animaux & Élevage", icon: "paw" },
  { id: 9, name: "Sports & Loisirs", icon: "dumbbell" },
  { id: 10, name: "Services", icon: "briefcase" },
  { id: 11, name: "Artisanat & Culture", icon: "palette" },
  { id: 12, name: "Alimentation & Restauration", icon: "food" },
  { id: 13, name: "Santé & Bien-être", icon: "medical-bag" },
];

export const CATEGORIES_NAMES = CATEGORIES.map((category) => category.name);

export const categoryIcon = (categoryName: string) =>
  CATEGORIES.find((category) => category.name === categoryName)?.icon;

export const SUB_CATEGORIES: SubCategoriesType = [
  // Véhicules
  { id: 1, categoryId: 1, name: "Vélos", icon: "bicycle" },
  { id: 2, categoryId: 1, name: "Motos & tricycles", icon: "motorbike" },
  { id: 3, categoryId: 1, name: "Voitures", icon: "car" },
  { id: 4, categoryId: 1, name: "Camions & bus", icon: "truck" },
  { id: 5, categoryId: 1, name: "Pièces & accessoires", icon: "cog" },
  { id: 6, categoryId: 1, name: "Location de véhicules", icon: "car-key" },

  // Immobilier
  { id: 7, categoryId: 2, name: "Maisons à vendre", icon: "home" },
  { id: 8, categoryId: 2, name: "Locations", icon: "key" },
  { id: 9, categoryId: 2, name: "Terrains", icon: "map-marker" },
  {
    id: 10,
    categoryId: 2,
    name: "Bureaux & magasins",
    icon: "office-building",
  },
  { id: 11, categoryId: 2, name: "Hôtels & hébergements", icon: "bed" },

  // Informatique & High-Tech
  { id: 12, categoryId: 3, name: "Téléphones portables", icon: "cellphone" },
  { id: 13, categoryId: 3, name: "Ordinateurs & tablettes", icon: "laptop" },
  { id: 14, categoryId: 3, name: "Accessoires", icon: "headphones" },
  {
    id: 15,
    categoryId: 3,
    name: "Appareils électroniques",
    icon: "television",
  },
  { id: 16, categoryId: 3, name: "Réparation & maintenance", icon: "tools" },

  // Maison & Électroménager
  { id: 17, categoryId: 4, name: "Meubles & déco", icon: "sofa" },
  {
    id: 18,
    categoryId: 4,
    name: "Appareils électroménagers",
    icon: "washing-machine",
  },
  {
    id: 19,
    categoryId: 4,
    name: "Cuisine & ustensiles",
    icon: "silverware-fork-knife",
  },
  { id: 20, categoryId: 4, name: "Bricolage & outils", icon: "hammer" },

  // Mode & Beauté
  { id: 21, categoryId: 5, name: "Vêtements", icon: "tshirt-crew" },
  { id: 22, categoryId: 5, name: "Chaussures", icon: "shoe-formal" },
  { id: 23, categoryId: 5, name: "Montres & bijoux", icon: "watch" },
  { id: 24, categoryId: 5, name: "Sacs & maroquinerie", icon: "bag-personal" },
  { id: 25, categoryId: 5, name: "Accessoires divers", icon: "hanger" },
  { id: 26, categoryId: 5, name: "Produits de beauté", icon: "lipstick" },
  { id: 27, categoryId: 5, name: "Tissus & pagnes", icon: "content-cut" },
  {
    id: 28,
    categoryId: 5,
    name: "Services de beauté",
    icon: "mirror-rectangle",
  },

  // Bébé & Enfant
  {
    id: 29,
    categoryId: 6,
    name: "Vêtements pour bébé",
    icon: "baby-face-outline",
  },
  { id: 30, categoryId: 6, name: "jouets pour bébé", icon: "teddy-bear" },
  {
    id: 31,
    categoryId: 6,
    name: "Accessoires pour bébé",
    icon: "baby-carriage",
  },

  // Matériel Professionnel
  { id: 32, categoryId: 7, name: "Matériel de construction", icon: "hard-hat" },
  { id: 33, categoryId: 7, name: "Matériel agricole", icon: "tractor" },
  { id: 34, categoryId: 7, name: "Bureaux & fournitures", icon: "printer" },
  { id: 35, categoryId: 7, name: "Outillage", icon: "toolbox" },

  // Animaux & Élevage
  { id: 36, categoryId: 8, name: "Bœufs & vaches", icon: "cow" },
  { id: 37, categoryId: 8, name: "Moutons & chèvres", icon: "sheep" },
  { id: 38, categoryId: 8, name: "Volaille", icon: "turkey" },
  { id: 39, categoryId: 8, name: "Chiens & chats", icon: "dog" },
  { id: 40, categoryId: 8, name: "Porcs", icon: "pig" },
  { id: 41, categoryId: 8, name: "Lapins", icon: "rabbit" },
  {
    id: 42,
    categoryId: 8,
    name: "Accessoires & alimentation d'animaux",
    icon: "food-drumstick",
  },

  // Sports & Loisirs
  { id: 43, categoryId: 9, name: "Instruments de musique", icon: "music" },
  { id: 44, categoryId: 9, name: "Équipements sportifs", icon: "dumbbell" },
  { id: 45, categoryId: 9, name: "Livres", icon: "book-open-variant" },
  { id: 46, categoryId: 9, name: "Jeux", icon: "gamepad-variant" },
  { id: 47, categoryId: 10, name: "Tourisme & Guide", icon: "compass" },

  // Services
  { id: 48, categoryId: 10, name: "Cours & formations", icon: "school" },
  {
    id: 49,
    categoryId: 10,
    name: "Transport & déménagement",
    icon: "truck-delivery",
  },
  { id: 50, categoryId: 10, name: "Services de réparations", icon: "wrench" },
  {
    id: 51,
    categoryId: 10,
    name: "Services événementiel",
    icon: "party-popper",
  },
  { id: 52, categoryId: 10, name: "Services à domicile", icon: "home-heart" },
  { id: 53, categoryId: 10, name: "Services divers", icon: "dots-horizontal" },

  // Artisanat & Culture
  { id: 54, categoryId: 11, name: "Objets d'art", icon: "image-frame" },
  { id: 55, categoryId: 11, name: "Poterie & sculpture", icon: "pot-steam" },
  {
    id: 56,
    categoryId: 11,
    name: "Tissage & couture",
    icon: "scissors-cutting",
  },
  { id: 57, categoryId: 11, name: "Peinture & décoration", icon: "brush" },
  { id: 58, categoryId: 11, name: "Matériel d'artisanat", icon: "toolbox" },

  // Alimentation & Restauration
  {
    id: 59,
    categoryId: 12,
    name: "Plats cuisinés & street food",
    icon: "food-takeout-box",
  }, //allocot, frites, etc.
  { id: 60, categoryId: 12, name: "Épicerie & produits locaux", icon: "store" },
  { id: 61, categoryId: 12, name: "Boissons", icon: "cup" },

  // Santé & Bien-être
  {
    id: 62,
    categoryId: 13,
    name: "Médicaments & produits de santé",
    icon: "pill",
  },
  { id: 63, categoryId: 13, name: "Matériel médical", icon: "stethoscope" },
  { id: 64, categoryId: 13, name: "Optique & lunetterie", icon: "glasses" },
  {
    id: 65,
    categoryId: 13,
    name: "Plantes médicinales & tradipraticiens",
    icon: "leaf",
  },
];

export const subCategoriesNames = (categoryName: string) => {
  const categoryId = CATEGORIES.find(
    (category) => category.name === categoryName,
  )?.id;
  return SUB_CATEGORIES.filter(
    (subCategory) => subCategory.categoryId === categoryId,
  ).map((subCategory) => subCategory.name);
};

export const subCategories = (categoryName: string) => {
  const categoryId = CATEGORIES.find(
    (category) => category.name === categoryName,
  )?.id;
  return SUB_CATEGORIES.filter(
    (subCategory) => subCategory.categoryId === categoryId,
  );
};

export const subCategoryIcon = (subCategoryName: string) =>
  SUB_CATEGORIES.find((subCategory) => subCategory.name === subCategoryName)
    ?.icon;
