import { BURKINA_CITIES } from "@/constants/burkinaCities";
import { CATEGORIES_NAMES } from "@/constants/categories";
import z from "zod";

const CATEGORIES_NAMES_WITH_ALL = [
  "Toutes les catégories",
  ...CATEGORIES_NAMES,
];

const BURKINA_CITIES_WITH_ALL = ["Toutes les villes", ...BURKINA_CITIES];

export const FilterModalFormSchema = z
  .object({
    search: z
      .string()
      .trim()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine(
        (val) => val === undefined || /^[A-Za-z0-9À-ÿ\s'-]+$/.test(val),
        "Caractères non autorisés"
      )
      .refine(
        (val) => val === undefined || (val.length >= 2 && val.length <= 50),
        "Recherche trop courte ou trop longue"
      ),

    category: z.enum(CATEGORIES_NAMES_WITH_ALL as [string, ...string[]]),
    subCategory: z.string().optional(),
    city: z.enum(BURKINA_CITIES_WITH_ALL as [string, ...string[]]),
    min: z.string().optional(),
    max: z.string().optional(),
    tempPub: z.string(),
    options: z
      .array(
        z.object({
          label: z.string(),
          active: z.boolean(),
        })
      )
      .length(3),
  })
  .refine(
    (data) => {
      const min = data.min ? Number(data.min) : null;
      const max = data.max ? Number(data.max) : null;

      if (min !== null && (isNaN(min) || min < 100 || min > 10000000)) {
        return false;
      }
      if (max !== null && (isNaN(max) || max < 100 || max > 10000000)) {
        return false;
      }

      if (min !== null && max !== null && min > max) {
        return false;
      }

      return true;
    },
    {
      message:
        "Les prix doivent être compris entre 100 et 10 000 000 F CFA, et le minimum ne peut pas dépasser le maximum.",
      path: ["max"],
    }
  );
