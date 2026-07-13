import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

const db = admin.firestore();

export const adOgPage = onRequest(
  { region: "europe-southwest1" },
  async (req, res) => {
    const adId = req.path.split("/").filter(Boolean).pop();

    let ad: any = null;
    try {
      if (adId) {
        const doc = await db.collection("Ads").doc(adId).get();
        if (doc.exists) ad = doc.data();
      }
    } catch (error) {
      console.error("adOgPage error:", error);
    }

    const title = ad?.title ?? "Annonce LeCoinBiz";
    const description = ad?.price
      ? `${ad.price} FCFA - Disponible sur LeCoinBiz`
      : "Découvrez cette annonce sur LeCoinBiz";
    const image =
      ad?.images?.[0] ?? "https://lecoinbiz-e43b7.web.app/default-share.png";
    const pageUrl = `https://lecoinbiz-e43b7.web.app/annonce/${adId}`;

    res.set("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:type" content="product" />
  <meta name="twitter:card" content="summary_large_image" />
  <title>${title} - LeCoinBiz</title>
</head>
<body>
  <p>Redirection vers l'application LeCoinBiz...</p>
  <script>
    var playStoreUrl = "https://play.google.com/store/apps/details?id=com.appolinaire_sdg.LeCoinBiz";
    var ua = navigator.userAgent || navigator.vendor;
    if (/android/i.test(ua)) {
      window.location.href = playStoreUrl;
    } else {
      window.location.href = "https://lecoinbiz.com";
    }
  </script>
</body>
</html>`);
  },
);
