import { onDocumentWritten } from "firebase-functions/v2/firestore";

export const transformAdForAlgolia = onDocumentWritten(
  "Ads/{adId}",
  (event) => {
    type AdStatusType = "ACTIVATED" | "PENDING" | "DISABLED";

    type AnnouncementType = {
      id: string;
      title: string;
      description: string;
      price: number;
      category: string;
      subCategory: string;
      city: string;
      phoneNumber: string;
      whatsappNumber: string;
      userId: string;
      conditions: string[];
      options: {
        label: string;
        active: boolean;
      }[];
      images: string[];
      stats: {
        clicks: number;
        favorites: number;
        views: number;
      };
      status: AdStatusType;
      createdAt: {
        seconds: number;
        nanoseconds: number;
      };
      updatedAt: {
        seconds: number;
        nanoseconds: number;
      };
    };

    const ad = event.data?.after?.data as AnnouncementType | undefined;
    const id = event.data?.after?.ref.id;

    if (!ad || !id) return null;

    return {
      objectID: id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      category: ad.category,
      subCategory: ad.subCategory,
      city: ad.city,
      userId: ad.userId,
      images: ad.images || [],
      imageNames: (ad.images || [])
        .map((url) => url.split("/").pop()?.split(".")[0])
        .join(" "),
      conditions: ad.conditions || [],
      conditionsText: (ad.conditions || []).map(String).join(" "),
      options: ad.options,
      optionsText: (ad.options || [])
        .filter((opt: any) => opt.active)
        .map((opt: any) => opt.label)
        .join(" "),
      clicks: ad.stats.clicks,
      status: ad.status,
      createdAt: ad.createdAt?.seconds
        ? ad.createdAt.seconds * 1000
        : Date.now(),
    };
  },
);

// Create InstantSearch application
// Use create-instantsearch-app to create an example search experience with your data

// npx create-instantsearch-app@latest instantsearch-app \
//     --name 'instantsearch-app' \
//     --template 'InstantSearch.js' \
//     --app-id 'YB56OO54E2' \
//     --api-key 'd9ae7c052fd60fa5a20695d069e489c2' \
//     --index-name 'Ads' \
//     --attributes-to-display 'title,description,category' \
//     --no-interactive \
//     --image-attribute 'images'

// Start your local application
// Once your InstantSearch application is done downloading, navigate to the application and run the following command to start it up.

// npm start
