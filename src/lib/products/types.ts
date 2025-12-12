// src/lib/products/types.ts

export type ApiProduct = {
  ProductId: number;
  Name: string;
  Description: string;
  CategoryId: number | null;
  SKU: string;
  Price: number;
  DiscountPrice: number | null;
  Stock: number;
  ImageUrl: string;  // String JSON từ API
  IsPublished: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
  totalReviews: number;
  averageRating: number;
};

export interface FrontendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  categoryId: number | null;
  image_url: string[];  // Array sau khi parse
  stock: number;
  totalReviews: number;
  averageRating: number;
  specs?: any[];  // Nếu có specs từ API
}

export type FilterState = {
  category: string;
  brand: string;
  price: string;
  cpu: string;
  usage: string | string[];
  series: string;
  screenSize: string;
  ram: string;
  ssd: string;
  vga: string;
  dpi: string;
  resolution: string;
  panelType: string;
  keyboardType: string;
  layout: string;
  psu: string;
  socket?: string;  // Thêm cho mainboard (category 6)
  watt?: string;    // Thêm cho PSU (category 7)
  capacity?: string; // Thêm cho RAM/Storage (category 8)
};

export type FilterKey = keyof FilterState;

export type FilterConfig = {
  key: FilterKey;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
};