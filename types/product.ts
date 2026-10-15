import type { CategoryId } from "@/config/categories";
export type ProductData = {
  _id: string;
  name: string;
  price: number;
  category: CategoryId;
  image: string;
  images?: string[];
  description: string;
  ingredients: string;
  howToUse: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
};
