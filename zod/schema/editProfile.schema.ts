import { z } from "zod";

export const EditProfileSchema = z.object({
  image: z.string().optional(),
  firstAndLastName: z.string().optional(),
  userName: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.date().optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 8 && /^\d{8}$/.test(val)), {
      message: "Le numéro de téléphone doit comporter exactement 8 chiffres.",
    }),
  whatsappNumber: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 8 && /^\d{8}$/.test(val)), {
      message: "Le numéro WhatsApp doit comporter exactement 8 chiffres.",
    }),
  email: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Adresse e-mail invalide",
    }),
  passWord: z.string().optional(),
});
