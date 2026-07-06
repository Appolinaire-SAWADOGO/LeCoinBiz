import * as admin from "firebase-admin";
import * as path from "path";

const serviceAccount = require(
  path.join(__dirname, "../serviceAccountKey.json"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function touchAllAds() {
  const snap = await db.collection("Ads").get();
  console.log(`${snap.size} documents trouvés.`);

  const batchSize = 400; // limite Firestore : 500 max par batch
  let batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    batch.update(doc.ref, {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    count++;

    if (count % batchSize === 0) {
      await batch.commit();
      console.log(`${count} documents committés...`);
      batch = db.batch();
    }
  }

  await batch.commit();
  console.log(`Terminé : ${count} documents touchés au total.`);
}

touchAllAds()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erreur:", err);
    process.exit(1);
  });
