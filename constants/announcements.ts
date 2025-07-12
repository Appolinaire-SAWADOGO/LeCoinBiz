import { AnnouncementsType } from "@/types";

export const announcements: AnnouncementsType[] = [
  // High-Tech & Multimédia
  {
    id: 1,
    name: "Ordinateur portable HP EliteBook",
    price: 799,
    category: "High-Tech & Multimédia",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    description:
      'Ordinateur portable HP EliteBook en excellent état avec processeur Core i7 de 10ème génération, 16GB de RAM DDR4, SSD NVMe ultra-rapide de 512GB, écran 15.6" Full HD anti-reflet. Clavier rétroéclairé et webcam HD intégrée. Idéal pour le travail ou les études.',
    condition: "Occasion comme neuf",
    freeDelivery: true,
    subPhotos: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?1",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?2",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?3",
    ],
    location: {
      city: "Paris",
      district: "15ème arrondissement",
      distance: "2 km",
      pays: "France",
    },
  },
  {
    id: 2,
    name: "iPhone 13 Pro 128GB",
    price: 899,
    category: "High-Tech & Multimédia",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb",
    description:
      'iPhone 13 Pro 128GB reconditionné par un professionnel avec batterie à 100% de sa capacité. Écran Super Retina XDR 6.1" sans aucune rayure, triple caméra professionnelle avec mode Night Mode. Livré avec une coque de protection en silicone originale Apple et câble Lightning.',
    condition: "Reconditionné",
    freeDelivery: false,
    subPhotos: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?1",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?2",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?3",
    ],
    location: {
      city: "Bruxelles",
      district: "Ixelles",
      distance: "5 km",
      pays: "Belgique",
    },
  },

  // Véhicules
  {
    id: 3,
    name: "Peugeot 208 GT Line",
    price: 18500,
    category: "Véhicules",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d",
    description:
      "Peugeot 208 GT Line année 2019 avec seulement 45 000 km au compteur. Motorisation diesel économique 1.5L BlueHDi 100ch. Toit ouvrant panoramique, jantes alliage 17\", système audio premium Focal, régulateur de vitesse. Contrôle technique récent et carnet d'entretien complet.",
    condition: "Occasion",
    freeDelivery: false,
    subPhotos: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?1",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?2",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?3",
    ],
    location: {
      city: "Genève",
      district: "Eaux-Vives",
      distance: "10 km",
      pays: "Suisse",
    },
  },
  {
    id: 4,
    name: "Casque moto Shoei Neotec II",
    price: 499,
    category: "Véhicules",
    image: "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad",
    description:
      "Casque intégral modulable Shoei Neotec II neuf jamais porté, taille L (58-59cm). Système de ventilation CWR-1, visière Pinlock anti-buée incluse, intérieur en 3D Max-Dry System ultra-confortable. Certifié ECE 22.05. Disponible immédiatement avec facture d'achat.",
    condition: "Neuf",
    freeDelivery: true,
    subPhotos: [
      "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?1",
      "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?2",
      "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?3",
    ],
    location: {
      city: "Montréal",
      district: "Vieux-Port",
      distance: "1 km",
      pays: "Canada",
    },
  },

  // Immobilier
  {
    id: 5,
    name: "Appartement T3 centre-ville",
    price: 1200,
    category: "Immobilier",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    description:
      "Magnifique appartement T3 de 70m² en plein cœur de la ville. Composé d'un séjour lumineux, deux chambres spacieuses, cuisine équipée moderne et salle de bain avec baignoire. Proche de tous commerces et transports en commun (métro à 50m). Chauffage collectif et ascenseur. Disponible immédiatement.",
    condition: "Location",
    freeDelivery: false,
    subPhotos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?1",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?2",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?3",
    ],
    location: {
      city: "Berlin",
      district: "Mitte",
      distance: "0.5 km",
      pays: "Allemagne",
    },
  },

  // Mode
  {
    id: 6,
    name: "Veste en cuir véritable",
    price: 150,
    category: "Mode & Accessoires",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
    description:
      "Veste en cuir véritable de haute qualité, taille M (38-40), couleur noire intemporelle. Doublure en soie, fermeture à glissière métallique robuste et quatre poches fonctionnelles. Portée seulement quelques fois, aucun défaut visible. Parfaite pour un look élégant ou décontracté.",
    condition: "Très bon état",
    freeDelivery: true,
    subPhotos: [
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?1",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?2",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?3",
    ],
    location: {
      city: "Londres",
      district: "Soho",
      distance: "3 km",
      pays: "Royaume-Uni",
    },
  },

  // Maison
  {
    id: 7,
    name: "Canapé d'angle en tissu",
    price: 450,
    category: "Maison & Déco",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    description:
      "Canapé d'angle spacieux en tissu résistant de couleur gris anthracite. Configuration 3 places + méridienne pour un couchage confortable. Mécanisme d'assise relevable. Quelques légères traces d'usure mais structure parfaite. Possibilité de livraison sur demande (frais supplémentaires selon distance).",
    condition: "Occasion",
    freeDelivery: false,
    subPhotos: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?1",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?2",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?3",
    ],
    location: {
      city: "Barcelone",
      district: "Gothic Quarter",
      distance: "7 km",
      pays: "Espagne",
    },
  },

  // Puériculture
  {
    id: 8,
    name: "Poussette double BabyJogger",
    price: 299,
    category: "Puériculture",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
    description:
      "Poussette double BabyJogger City Select en excellent état général. Modèle convertible pouvant accueillir deux enfants de 0 à 4 ans. Inclut housse de pluie originale, pare-soleil et filet à provisions. Roues tout-terrain avec suspension, système de pliage simple et compact. Parfait pour les jumeaux ou enfants d'âges différents.",
    condition: "Bon état",
    freeDelivery: true,
    subPhotos: [
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?1",
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?2",
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?3",
    ],
    location: {
      city: "Rome",
      district: "Trastevere",
      distance: "4 km",
      pays: "Italie",
    },
  },

  // Sports
  {
    id: 9,
    name: "Vélo de route Cannondale",
    price: 850,
    category: "Loisirs & Sports",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
    description:
      "Vélo de route Cannondale Synapse en aluminium taille 54cm, idéal pour des cyclistes entre 1m70 et 1m80. Groupe Shimano 105 11 vitesses, freins à disques hydrauliques, pneus Continental Gatorskin 28mm quasi-neufs. Utilisé seulement quelques sorties, révision complète récente. Livré avec pédales automatiques et support de fixation murale.",
    condition: "Occasion",
    freeDelivery: false,
    subPhotos: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?1",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?2",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?3",
    ],
    location: {
      city: "Amsterdam",
      district: "Jordaan",
      distance: "2 km",
      pays: "Pays-Bas",
    },
  },

  // Professionnel
  {
    id: 10,
    name: "Groupe électrogène professionnel",
    price: 1200,
    category: "Professionnel & Matériel",
    image: "https://images.unsplash.com/photo-1610041321327-b794c052db27",
    description:
      "Groupe électrogène professionnel Honda EU22i de 2200W (2.2kVA) avec seulement 200 heures d'utilisation. Moteur 4 temps ultra-silencieux (53dB), démarrage électrique + manuel, consommation optimisée. Parfait pour chantiers, événements ou backup électrique. Livré avec câbles de puissance et notice d'utilisation complète. Garantie 3 mois.",
    condition: "Occasion",
    freeDelivery: true,
    subPhotos: [
      "https://images.unsplash.com/photo-1610041321327-b794c052db27?1",
      "https://images.unsplash.com/photo-1610041321327-b794c052db27?2",
      "https://images.unsplash.com/photo-1610041321327-b794c052db27?3",
    ],
    location: {
      city: "Luxembourg",
      district: "Ville Haute",
      distance: "8 km",
      pays: "Luxembourg",
    },
  },
];
