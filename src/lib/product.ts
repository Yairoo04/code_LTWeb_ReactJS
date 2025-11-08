export type Product = {
  ProductId: number;
  Name: string;
  Description: string;
  Price: number;
  DiscountPrice: number | null;
  CategoryId: number | null;
  SKU: string;
  Stock: number;
  ImageUrl: string;
  IsPublished: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
  Category?: string;
};