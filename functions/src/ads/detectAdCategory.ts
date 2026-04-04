import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { CATEGORIES_NAMES, SUB_CATEGORIES } from "../../constants/categories";
import { db } from "../../firebase";

export const detectAdCategory = onDocumentWritten(
  {
    document: "Ads/{adId}",
    region: "europe-southwest1",
    secrets: ["GEMINI_API_KEY"],
  },
  async (event) => {
    const before = event.data?.before;
    const after = event.data?.after;

    // Doc supprimé → rien à faire
    if (!after?.exists) return;

    const afterData = after.data()!;
    const beforeData = before?.exists ? before.data()! : null;

    const isCreation = beforeData === null;
    const titleChanged = beforeData?.title !== afterData.title;
    const descriptionChanged =
      beforeData?.description !== afterData.description;

    // On ne re-détecte que si : création, ou titre/description modifié
    if (!isCreation && !titleChanged && !descriptionChanged) return;

    // Titre requis minimum pour la détection
    if (!afterData.title) {
      console.warn(
        `Ads/${event.params.adId} : pas de titre, catégorisation ignorée.`,
      );
      return;
    }

    let category: string | null = null;
    let subCategory: string | null = null;

    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // On inclut la description seulement si elle est définie et non vide
      const descriptionPart = afterData.description?.trim()
        ? `\nDescription: "${afterData.description.trim()}".`
        : "";

      const result = await model.generateContent([
        {
          text: `Titre: "${afterData.title}".${descriptionPart}
Catégories disponibles: ${CATEGORIES_NAMES.join(", ")}.
Sous-catégories disponibles: ${SUB_CATEGORIES.map((s) => s.name).join(", ")}.
Réponds UNIQUEMENT en JSON valide: {"category": "nom_exact", "subCategory": "nom_exact"}`,
        },
      ]);

      const clean = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      const detected = JSON.parse(clean);

      category = detected.category ?? null;
      subCategory = detected.subCategory ?? null;
    } catch (e: any) {
      console.error(
        `Erreur Gemini pour Ads/${event.params.adId} :`,
        e?.message,
      );
    }

    // Mise à jour uniquement des champs de catégorie (pas de updatedAt pour ne
    // pas re-déclencher la logique de modification côté client)
    await db.collection("Ads").doc(event.params.adId).update({
      category,
      subCategory,
    });

    // console.log(
    //   `Ads/${event.params.adId} → category: ${category}, subCategory: ${subCategory}`,
    // );
  },
);
