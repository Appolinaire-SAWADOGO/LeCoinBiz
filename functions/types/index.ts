export type CategoriesType = {
  id: number;
  name: string;
}[];

export type BannerType = {
  id: string;
  image: string;
  title: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  expiredAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type AdStatusType = "ACTIVATED" | "PENDING" | "DISABLED";

export type AdBoostStatusType =
  | "pending_verification"
  | "active"
  | "scheduled"
  | "expired";

export type AnnouncementType = {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  subCategory: string;
  city: string;
  address?: {
    lat: number;
    lng: number;
    formattedAddress: string;
  };
  phoneNumber: string;
  whatsappNumber: string;
  userId: string;
  options: {
    label: string;
    active: boolean;
  }[];
  images: string[];
  video?: string;
  stats: {
    clicks: number;
    favorites: number;
    views: number;
  };
  status: AdStatusType;
  boostStatus?: AdBoostStatusType;
  pendingBoostPaymentId?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  boostExpiredAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  boostStartAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
};
