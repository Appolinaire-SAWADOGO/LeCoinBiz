import { BURKINA_CITIES } from "@/constants/burkinaCities";
import { CATEGORIES_NAMES } from "@/constants/categories";
import { z } from "zod";

export const PostAnAddSchema = z.object({
  title: z
    .string({ message: "Le titre de l’annonce est requis." })
    .min(10, "Le titre doit comporter au moins 10 caractères.")
    .max(100, "Le titre ne doit pas dépasser 100 caractères."),

  price: z
    .number({ message: "Le prix est requis." })
    .min(100, "Le prix doit être d’au moins 100 F CFA.")
    .max(10000000, "Le prix ne peut pas dépasser 10 000 000 F CFA."),

  category: z
    .enum(CATEGORIES_NAMES, { message: "La catégorie est requise." })
    .refine((val) => CATEGORIES_NAMES.includes(val), {
      message: "Veuillez sélectionner une catégorie valide.",
    }),

  description: z
    .string({ message: "La description de l’annonce est requise." })
    .min(20, "La description doit comporter au moins 20 caractères.")
    .max(1000, "La description ne doit pas dépasser 1 000 caractères."),

  conditions: z
    .array(z.string())
    .max(10, "Vous ne pouvez pas ajouter plus de 10 conditions.")
    .refine((arr) => arr.length > 0, {
      message: "Veuillez ajouter au moins une condition.",
    })
    .refine((arr) => arr.every((c) => c.trim().length >= 5), {
      message: "Chaque condition doit contenir au moins 5 caractères.",
    }),

  images: z
    .array(z.string())
    .min(1, "Veuillez ajouter au moins une image.")
    .max(4, "Vous ne pouvez pas ajouter plus de 4 images."),

  options: z
    .array(
      z.object({
        label: z.string(),
        active: z.boolean(),
      })
    )
    .length(2),

  city: z
    .enum(BURKINA_CITIES, { message: "La ville est requise." })
    .refine((val) => BURKINA_CITIES.includes(val), {
      message: "Veuillez sélectionner une ville valide.",
    }),

  phoneNumber: z
    .string({ message: "Le numéro de téléphone est requis." })
    .min(8, "Le numéro de téléphone doit comporter au moins 8 chiffres.")
    .regex(
      /^\d{8}$/,
      "Le numéro de téléphone doit comporter exactement 8 chiffres."
    ),

  whatsappNumber: z
    .string({ message: "Le numéro WhatsApp est requis." })
    .min(8, "Le numéro WhatsApp doit comporter au moins 8 chiffres.")
    .regex(
      /^\d{8}$/,
      "Le numéro WhatsApp doit comporter exactement 8 chiffres."
    ),
});
