/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

admin.initializeApp();

setGlobalOptions({
  maxInstances: 10,
  cpu: 0.333,
  memory: "256MiB",
});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// ads
export { activateAd } from "./ads/activateAd";
export { addAdFavorite } from "./ads/addAdFavorite";
export { adOgPage } from "./ads/adOgPage";
export { ifAdIsAddedToFavorites } from "./ads/checkFavorite";
export { deleteAd } from "./ads/deleteAd";
export { deleteImgs } from "./ads/deleteImgs";
export { detectAdCategory } from "./ads/detectAdCategory";
export { disableAd } from "./ads/disableAd";
export { editAd } from "./ads/editAd";
export { getAdById } from "./ads/getAdById";
export { getAdsByUserId } from "./ads/getAdsByUserId";
export { getBoostAds } from "./ads/getBoostAds";
export { getFilterAds } from "./ads/getFilterAds";
export { getHomeAds } from "./ads/getHomeAds";
export { getSimilarAds } from "./ads/getSimilarAds";
export { getSuggestionSearchAds } from "./ads/getSuggestionSearchAds";
export { getUserAdsCount } from "./ads/getUserAdsCount";
export { incrementAdClics } from "./ads/incrementAdClics";
export { postAnAd } from "./ads/postAnAd";
export { reportAd } from "./ads/reportAd";
export { transformAdForAlgolia } from "./ads/transformAdForAlgolia";

// auth/signIn
export { deleteAccount } from "./auth/signIn/deleteAccount";

// auth/signUp
export { createUserWithEmail } from "./auth/signUp/createUserWithEmail";
export { createUserWithGoogle } from "./auth/signUp/createUserWithGoogle";
export { createUserWithPhone } from "./auth/signUp/createUserWithPhone";

// favorites
export { getFavoriteAdsByUserId } from "./favorites/getFavoriteAdsByUserId";

// notifications
export { createGeneralNotification } from "./notifications/createGeneralNotification";
export { dailyNotification } from "./notifications/dailyNotification";
export { getNotifications } from "./notifications/getNotifications";

// user
export { checkUserExistsByEmail } from "./user/checkUserExistsByEmail";
export { editUserProfile } from "./user/editUserProfile";
export { getUserById } from "./user/getUserById";

// admin
// ads
export { adminActivateAd } from "./admin/ads/adminActivateAd";
export { adminChangeAdCatAndSubCatById } from "./admin/ads/adminChangeAdCatAndSubCatById";
export { adminGetReportAds } from "./admin/ads/adminGetReportAds";
export { adminIgnoreAdReport } from "./admin/ads/adminIgnoreAdReport";
export { adminSetAdPending } from "./admin/ads/adminSetAdPending";
// bootAdPayment
export { adminGetBoostPayments } from "./admin/boostAdPayment/adminGetBootPayments";

// users
export { adminGetUsers } from "./admin/users/adminGetUsers";

// banner
export { getBanners } from "./banner/getBanners";
export { postBanner } from "./banner/postBanner";

// boostAdPayment
export { createBoostPayment } from "./boostAdPayment/createBoostPayment";
export { refreshBoostStatuses } from "./boostAdPayment/refreshBoostStatuses ";
export { validateBoostPayment } from "./boostAdPayment/validateBoostPayment";
