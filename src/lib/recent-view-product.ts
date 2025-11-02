// lib/recent-view-product.ts
export type RecentViewProduct = {
  Id: number;
  UserId: number;
  ProductId: number;
  Name: string;
  Description: string | null;
  CategoryId: number | null;
  SKU: string | null;
  Price: number;
  DiscountPrice: number;
  Stock: number;
  ImageUrl: string | null;
  IsPublished: boolean;
  ViewedAt: string;
};