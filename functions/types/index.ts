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
