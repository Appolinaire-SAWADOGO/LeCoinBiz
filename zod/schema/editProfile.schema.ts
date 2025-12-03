import { RESERVED_USERNAMES } from "@/constants";
import { z } from "zod";

export const EditProfileSchema = z.object({
  image: z.string().optional(),
  firstAndLastName: z.string().optional(),
  userName: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_-]*$/,
      "Le nom d'utilisateur doit commencer par une lettre et ne contenir que des lettres, chiffres, tirets ou underscores"
    )
    .refine(
      (username: string) => !username.includes("__"),
      "Le nom d'utilisateur ne peut pas contenir deux underscores consécutifs"
    )
    .refine(
      (username: string) => !username.includes("--"),
      "Le nom d'utilisateur ne peut pas contenir deux tirets consécutifs"
    )
    .refine(
      (username: string) => !username.endsWith("_") && !username.endsWith("-"),
      "Le nom d'utilisateur ne peut pas se terminer par un tiret ou underscore"
    )
    .refine(
      (username) => !RESERVED_USERNAMES.includes(username.toLowerCase()),
      "Ce nom d'utilisateur est réservé et ne peut pas être utilisé"
    )
    .transform((username: string) => username.toLowerCase())
    .optional(),
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
