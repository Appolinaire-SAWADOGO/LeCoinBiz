import { RESERVED_USERNAMES } from "@/constants";
import { isValidEmail } from "@/utils/auth";
import { z } from "zod";

export const ProfileSchema = z.object({
  firstAndLastName: z
    .string()
    .min(3, "Le nom complet doit contenir au moins 3 caractères")
    .max(50, "Le nom complet ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Le nom ne peut contenir que des lettres, espaces, apostrophes ou tirets"
    )
    .regex(/^[a-zA-ZÀ-ÿ]/, "Le nom doit commencer par une lettre")
    .regex(/[a-zA-ZÀ-ÿ]$/, "Le nom doit se terminer par une lettre")
    .refine(
      (name: string) => name.trim().includes(" "),
      "Veuillez entrer votre prénom et nom (au moins 2 mots)"
    )
    .refine(
      (name: string) => !name.includes("  "),
      "Le nom ne peut pas contenir deux espaces consécutifs"
    )
    .refine(
      (name: string) => !name.includes("--"),
      "Le nom ne peut pas contenir deux tirets consécutifs"
    )
    .refine(
      (name: string) => !name.includes("''"),
      "Le nom ne peut pas contenir deux apostrophes consécutives"
    )
    .refine((name: string) => {
      const words = name.trim().split(/\s+/);
      return words.every((word) => word.length >= 2);
    }, "Chaque partie du nom doit contenir au moins 2 caractères")
    .refine((name: string) => {
      const words = name.trim().split(/\s+/);
      return words.length >= 2 && words.length <= 4;
    }, "Le nom doit contenir entre 2 et 4 mots")
    .transform((name: string) =>
      name
        .trim()
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    )
    .optional(),

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

  phoneNumber: z
    .string()
    .refine((val) => !val || (val.length >= 8 && /^\d{8}$/.test(val)), {
      message: "Le numéro de téléphone doit comporter exactement 8 chiffres.",
    }),

  whatsappNumber: z
    .string()
    .refine((val) => !val || (val.length >= 8 && /^\d{8}$/.test(val)), {
      message: "Le numéro WhatsApp doit comporter exactement 8 chiffres.",
    }),

  email: z
    .string()
    .trim()
    .max(150, "L'email ne peut pas dépasser 150 caracteres.")
    .refine((val) => isValidEmail(val), {
      message: "Veuillez entrer une adresse email valide.",
    }),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(20, "Le mot de passe ne peut pas dépasser 20 caractères")
    .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(
      /[^a-zA-Z0-9]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    ),
});
