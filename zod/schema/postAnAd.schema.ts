import { BURKINA_CITIES } from "@/constants/burkinaCities";
import { z } from "zod";

export const PostAnAddSchema = z.object({
  title: z
    .string({ message: "Le titre de l'annonce est requis." })
    .min(3, "Le titre doit comporter au moins 3 caractère.")
    .max(100, "Le titre ne doit pas dépasser 100 caractères."),

  price: z
    .number({ message: "Le prix est requis." })
    .min(1, "Le prix doit être d'au moins 1 F CFA.")
    .max(10000000, "Le prix ne peut pas dépasser 10 000 000 F CFA."),

  description: z
    .string()
    .max(1000, "La description ne doit pas dépasser 1 000 caractères.")
    .optional(),

  images: z
    .array(z.string())
    .min(1, "Veuillez ajouter au moins une image.")
    .max(4, "Vous ne pouvez pas ajouter plus de 4 images."),

  // ← NOUVEAU
  video: z.string().optional(),

  options: z
    .array(
      z.object({
        label: z.string(),
        active: z.boolean(),
      }),
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
      "Le numéro de téléphone doit comporter exactement 8 chiffres.",
    ),

  whatsappNumber: z
    .string({ message: "Le numéro WhatsApp est requis." })
    .min(8, "Le numéro WhatsApp doit comporter au moins 8 chiffres.")
    .regex(
      /^\d{8}$/,
      "Le numéro WhatsApp doit comporter exactement 8 chiffres.",
    ),
});
