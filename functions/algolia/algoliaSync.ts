import firestore from "@react-native-firebase/firestore";
import { algoliasearch } from "algoliasearch";

// Configuration Algolia
const ALGOLIA_APP_ID = process.env.EXPO_PUBLIC_ALGOLIA_APP_ID as string; // ← Remplacez par votre Application ID
const ALGOLIA_WRITE_KEY = process.env.EXPO_PUBLIC_ALGOLIA_WRITE_KEY as string; // ← Remplacez par votre Write API Key
// ⚠️ ATTENTION : Ne jamais exposer la Write API Key côté client en production !

// API v5 : deux arguments séparés (appId, apiKey)
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);

interface SyncConfig {
  firestoreCollection: string;
  algoliaIndex: string;
  transform?: (data: any, id: string) => any;
  searchableAttributes?: string[];
}

/**
 * Transforme un document Firestore pour Algolia
 */
const defaultTransform = (data: any, id: string) => {
  return {
    objectID: id,
    ...data,
    // Convertir les timestamps Firestore en nombre
    ...(data.createdAt && {
      createdAt: data.createdAt.toMillis
        ? data.createdAt.toMillis()
        : data.createdAt,
    }),
    ...(data.updatedAt && {
      updatedAt: data.updatedAt.toMillis
        ? data.updatedAt.toMillis()
        : data.updatedAt,
    }),
  };
};

/**
 * Synchronisation initiale : indexe tous les documents existants
 */
export const initialSync = async (config: SyncConfig) => {
  const {
    firestoreCollection,
    algoliaIndex,
    transform = defaultTransform,
  } = config;

  console.log(
    `🔄 Synchronisation initiale: ${firestoreCollection} → ${algoliaIndex}`
  );

  try {
    const snapshot = await firestore().collection(firestoreCollection).get();

    const records = snapshot.docs.map((doc) => transform(doc.data(), doc.id));

    if (records.length > 0) {
      // API v5 : saveObjects directement sur le client
      await client.saveObjects({
        indexName: algoliaIndex,
        objects: records,
      });
      console.log(`✅ ${records.length} documents indexés dans Algolia`);
    } else {
      console.log("ℹ️ Aucun document à indexer");
    }

    // Configuration des attributs de recherche si spécifiés
    if (config.searchableAttributes) {
      await client.setSettings({
        indexName: algoliaIndex,
        indexSettings: {
          searchableAttributes: config.searchableAttributes,
        },
      });
      console.log("✅ Attributs de recherche configurés");
    }

    return { success: true, count: records.length };
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation initiale:", error);
    throw error;
  }
};

/**
 * Synchronisation en temps réel : écoute les changements Firestore
 */
export const realtimeSync = (config: SyncConfig) => {
  const {
    firestoreCollection,
    algoliaIndex,
    transform = defaultTransform,
  } = config;

  console.log(`👂 Écoute en temps réel: ${firestoreCollection}`);

  const unsubscribe = firestore()
    .collection(firestoreCollection)
    .onSnapshot(
      async (snapshot) => {
        if (!snapshot) return;

        // Traiter chaque modification
        for (const change of snapshot.docChanges()) {
          const docData = change.doc.data();
          const docId = change.doc.id;

          try {
            if (change.type === "added" || change.type === "modified") {
              const record = transform(docData, docId);
              // API v5 : saveObject sur le client
              await client.saveObject({
                indexName: algoliaIndex,
                body: record,
              });
              console.log(`✅ Document ${change.type}: ${docId}`);
            }

            if (change.type === "removed") {
              // API v5 : deleteObject sur le client
              await client.deleteObject({
                indexName: algoliaIndex,
                objectID: docId,
              });
              console.log(`🗑️ Document supprimé: ${docId}`);
            }
          } catch (error) {
            console.error(`❌ Erreur sur document ${docId}:`, error);
          }
        }
      },
      (error) => {
        console.error("❌ Erreur lors de l'écoute en temps réel:", error);
      }
    );

  return unsubscribe;
};

/**
 * Supprime tous les objets d'un index Algolia
 */
export const clearIndex = async (indexName: string) => {
  await client.clearObjects({ indexName });
  console.log(`🗑️ Index ${indexName} vidé`);
};

/**
 * Exemple d'utilisation
 */
export const setupSync = async () => {
  // Configuration pour synchroniser la collection "Ads"
  const adsConfig: SyncConfig = {
    firestoreCollection: "Ads",
    algoliaIndex: "Ads",
    searchableAttributes: [
      "title",
      "description",
      "category",
      "subCategory",
      "city",
      "conditions",
      "options",
    ],
    transform: (data, id) => ({
      objectID: id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      city: data.city,
      images: data.images || [],
      userId: data.userId,
      conditions: data.conditions || [],
      subCategory: data.subCategory || [],
      options: data.options,
      createdAt: data.createdAt?.toMillis?.() || Date.now(),
      updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
    }),
  };

  // Synchronisation initiale
  await initialSync(adsConfig);

  // Démarrer l'écoute en temps réel
  const unsubscribe = realtimeSync(adsConfig);

  // Retourner la fonction pour arrêter l'écoute
  return unsubscribe;
};

// Export du client pour des opérations personnalisées
export { client as algoliaClient };
