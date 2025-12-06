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
    ImageUrl: string;
    IsPublished: boolean;
    CreatedAt: string;
    UpdatedAt: string | null;
  };
  
  export type FrontendProduct = {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    categoryId?: number | null;
    image_url?: string;
    stock?: number;
    specs?: { SpecName: string; SpecValue: string; Warranty: string }[];
  };
  
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
  };
  
  export type FilterKey = keyof FilterState;
  
  export type FilterConfig = {
    key: FilterKey;
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
  };
  