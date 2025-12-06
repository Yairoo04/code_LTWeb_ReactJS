'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './SearchPage.module.scss';
import '@/styles/globals.scss';
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import ProductCard from '@/pages/main_Page/Product/ProductCard';
import FlashSale from '@/pages/main_Page/FlashSale/FlashSale';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ===============================
//  Kiểu dữ liệu sản phẩm
// ===============================
type BackendProduct = {
  ProductId: number;
  Name: string;
  Description: string;
  CategoryId?: number | null;
  Price: number;
  DiscountPrice?: number | null;
  ImageUrl: string;
  Stock?: number;
};

type SpecItem = {
  SpecName: string;
  SpecValue: string;
  Warranty: string;
};

type FrontendProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  categoryId?: number | null;
  stock?: number;
  image_url?: string;
  ImageUrl?: string;
  specs?: SpecItem[];
  created_at?: string;
};

// ===============================
//  Filter types + config
// ===============================
type FilterState = {
  category: string;
  brand: string;
  price: string;
  cpu: string;
  usage: string;
  series: string;
  screenSize: string;
  ram: string;
  ssd: string;
  vga: string;
  dpi: string; // Chuột
  resolution: string; // Màn hình
  panelType: string; // Màn hình
  keyboardType: string; // Bàn phím
  layout: string; // Bàn phím
  psu: string; // PC
};

type FilterKey = keyof FilterState;

type FilterConfig = {
  key: FilterKey;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
};

const sortOptions = [
  { value: "popular", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const CATEGORY_FILTER_CONFIG: Record<string, FilterConfig[]> = {
  // Default
  all: [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [
        { value: "1", label: "Laptop" },
        { value: "2", label: "PC" },
        { value: "3", label: "Màn hình" },
        { value: "4", label: "Bàn phím" },
        { value: "5", label: "Chuột" },
      ],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-5000000", label: "Dưới 5 triệu" },
        { value: "5000000-10000000", label: "5 - 10 triệu" },
        { value: "10000000-20000000", label: "10 - 20 triệu" },
        { value: "20000000-999999999", label: "Trên 20 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "dell", label: "Dell" },
        { value: "asus", label: "ASUS" },
        { value: "hp", label: "HP" },
        { value: "lenovo", label: "Lenovo" },
        { value: "acer", label: "Acer" },
        { value: "viewsonic", label: "Viewsonic" },
        { value: "keychron", label: "Keychron" },
        { value: "logitech", label: "Logitech" },
        { value: "gigabyte", label: "Gigabyte" },
        { value: "msi", label: "MSI" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "cao cấp", label: "Cao cấp" },
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
        { value: "đồ họa", label: "Đồ họa" },
        { value: "mỏng nhẹ", label: "Mỏng nhẹ" },
      ],
    },
  ],

  // Laptop (CategoryId: 1)
  "1": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [
        { value: "1", label: "Laptop" },
        { value: "2", label: "PC" },
        { value: "3", label: "Màn hình" },
        { value: "4", label: "Bàn phím" },
        { value: "5", label: "Chuột" },
      ],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-5000000", label: "Dưới 5 triệu" },
        { value: "5000000-10000000", label: "5 - 10 triệu" },
        { value: "10000000-20000000", label: "10 - 20 triệu" },
        { value: "20000000-999999999", label: "Trên 20 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "dell", label: "Dell" },
        { value: "asus", label: "ASUS" },
        { value: "hp", label: "HP" },
        { value: "lenovo", label: "Lenovo" },
        { value: "acer", label: "Acer" },
        { value: "gigabyte", label: "Gigabyte" },
        { value: "msi", label: "MSI" },
      ],
    },
    {
      key: "cpu",
      label: "CPU",
      placeholder: "CPU",
      options: [
        { value: "intel core i5", label: "Intel Core i5" },
        { value: "intel core i7", label: "Intel Core i7" },
        { value: "ryzen 5", label: "AMD Ryzen 5" },
        { value: "ryzen 7", label: "AMD Ryzen 7" },
        { value: "intel đời 13", label: "Core Intel 13th" },
      ],
    },
    {
      key: "screenSize",
      label: "Kích thước màn hình",
      placeholder: "Kích thước màn hình",
      options: [
        { value: '13"', label: '13"' },
        { value: '14"', label: '14"' },
        { value: '15.6"', label: '15.6"' },
      ],
    },
    {
      key: "ram",
      label: "RAM",
      placeholder: "RAM",
      options: [
        { value: "8gb", label: "8GB" },
        { value: "16gb", label: "16GB" },
        { value: "32gb", label: "32GB" },
      ],
    },
    {
      key: "ssd",
      label: "SSD",
      placeholder: "SSD",
      options: [
        { value: "512gb", label: "512GB" },
        { value: "1tb", label: "1TB" },
      ],
    },
    {
      key: "vga",
      label: "VGA",
      placeholder: "VGA",
      options: [
        { value: "rtx 2050", label: "RTX 2050" },
        { value: "rtx 3050", label: "RTX 3050" },
        { value: "rtx 4060", label: "RTX 4060" },
        { value: "intel iris xe", label: "Intel Iris Xe" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
        { value: "đồ họa", label: "Đồ họa" },
        { value: "mỏng nhẹ", label: "Mỏng nhẹ" },
      ],
    },
  ],

  // PC (CategoryId: 2)
  "2": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [
        { value: "1", label: "Laptop" },
        { value: "2", label: "PC" },
        { value: "3", label: "Màn hình" },
        { value: "4", label: "Bàn phím" },
        { value: "5", label: "Chuột" },
      ],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-10000000", label: "Dưới 10 triệu" },
        { value: "10000000-20000000", label: "10 - 20 triệu" },
        { value: "20000000-30000000", label: "20 - 30 triệu" },
        { value: "30000000-999999999", label: "Trên 30 triệu" },
      ],
    },
    {
      key: "cpu",
      label: "CPU",
      placeholder: "CPU",
      options: [
        { value: "amd ryzen 9", label: "AMD Ryzen 9" },
        { value: "intel core i9", label: "Intel Core i9" },
      ],
    },
    {
      key: "ram",
      label: "RAM",
      placeholder: "RAM",
      options: [
        { value: "32gb", label: "32GB" },
        { value: "64gb", label: "64GB" },
        { value: "96gb", label: "96GB" },
      ],
    },
    {
      key: "ssd",
      label: "SSD",
      placeholder: "SSD",
      options: [
        { value: "1tb", label: "1TB" },
        { value: "2tb", label: "2TB" },
      ],
    },
    {
      key: "vga",
      label: "VGA",
      placeholder: "VGA",
      options: [
        { value: "rtx 5090", label: "RTX 5090" },
        { value: "rtx 3060", label: "RTX 3060" },
      ],
    },
    {
      key: "psu",
      label: "Nguồn (PSU)",
      placeholder: "Nguồn (PSU)",
      options: [
        { value: "1200w", label: "1200W" },
        { value: "1000w", label: "1000W" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "workstation", label: "Workstation" },
      ],
    },
  ],

  // Màn hình (CategoryId: 3)
  "3": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [
        { value: "1", label: "Laptop" },
        { value: "2", label: "PC" },
        { value: "3", label: "Màn hình" },
        { value: "4", label: "Bàn phím" },
        { value: "5", label: "Chuột" },
      ],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-2000000", label: "Dưới 2 triệu" },
        { value: "2000000-5000000", label: "2 - 5 triệu" },
        { value: "5000000-10000000", label: "5 - 10 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "viewsonic", label: "Viewsonic" },
        { value: "lg", label: "LG" },
        { value: "asus", label: "ASUS" },
      ],
    },
    {
      key: "screenSize",
      label: "Kích thước",
      placeholder: "Kích thước",
      options: [
        { value: "23.8 inch", label: "23.8 inch" },
        { value: "24 inch", label: "24 inch" },
        { value: "27 inch", label: "27 inch" },
      ],
    },
    {
      key: "resolution",
      label: "Độ phân giải",
      placeholder: "Độ phân giải",
      options: [
        { value: "full hd", label: "Full HD (1920x1080)" },
        { value: "2k", label: "2K (2560x1440)" },
        { value: "4k", label: "4K (3840x2160)" },
      ],
    },
    {
      key: "panelType",
      label: "Tấm nền",
      placeholder: "Tấm nền",
      options: [
        { value: "va", label: "VA" },
        { value: "ips", label: "IPS" },
        { value: "oled", label: "OLED" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
      ],
    },
  ],

  // Bàn phím (CategoryId: 4)
  "4": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [
        { value: "1", label: "Laptop" },
        { value: "2", label: "PC" },
        { value: "3", label: "Màn hình" },
        { value: "4", label: "Bàn phím" },
        { value: "5", label: "Chuột" },
      ],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-500000", label: "Dưới 500k" },
        { value: "500000-1000000", label: "500k - 1 triệu" },
        { value: "1000000-2000000", label: "1 - 2 triệu" },
        { value: "2000000-5000000", label: "2 - 5 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "corsair", label: "Corsair" },
        { value: "dare-u", label: "Dare-U" },
        { value: "filco", label: "Filco" },
        { value: "keychron", label: "Keychron" },
        { value: "razer", label: "Razer" },
        { value: "royal", label: "Royal" },
        { value: "logitech", label: "Logitech" },
        { value: "akko", label: "AKKO" },
      ],
    },
    {
      key: "keyboardType",
      label: "Loại bàn phím",
      placeholder: "Loại bàn phím",
      options: [
        { value: "low-profile", label: "Low-Profile" },
        { value: "mechanical", label: "Mechanical" },
      ],
    },
    {
      key: "layout",
      label: "Layout",
      placeholder: "Layout",
      options: [
        { value: "75%", label: "75%" },
        { value: "fullsize", label: "Fullsize" },
        { value: "tenkeyless", label: "Tenkeyless" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
      ],
    },
  ],

  // Chuột (CategoryId: 5)
  "5": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [
        { value: "1", label: "Laptop" },
        { value: "2", label: "PC" },
        { value: "3", label: "Màn hình" },
        { value: "4", label: "Bàn phím" },
        { value: "5", label: "Chuột" },
      ],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-500000", label: "Dưới 500k" },
        { value: "500000-1000000", label: "500k - 1 triệu" },
        { value: "1000000-3000000", label: "1 - 3 triệu" },
        { value: "2000000-5000000", label: "2 - 5 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "asus", label: "Asus" },
        { value: "corsair", label: "Corsair" },
        { value: "dare-u", label: "Dare-U" },
        { value: "razer", label: "Razer" },
        { value: "logitech", label: "Logitech" },
        { value: "viper", label: "Viper" },
      ],
    },
    {
      key: "dpi",
      label: "DPI",
      placeholder: "DPI",
      options: [
        { value: "8000", label: "≤ 8.000 DPI" },
        { value: "16000", label: "≤ 16.000 DPI" },
        { value: "25000", label: "≤ 25.000 DPI" },
        { value: "30000", label: "≤ 30.000 DPI" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
      ],
    },
  ],
};

// ===============================
//  Map backend → frontend
// ===============================
const mapToFrontendProduct = (product: BackendProduct): FrontendProduct => ({
  id: product.ProductId,
  name: product.Name,
  description: product.Description ?? "",
  price: product.Price,
  discountPrice: product.DiscountPrice ?? null,
  ImageUrl: product.ImageUrl,
  image_url: product.ImageUrl,
  stock: product.Stock ?? 0,
  categoryId: product.CategoryId ?? null,
});

// ===============================
//  Detect category từ results + query
// ===============================
const detectCategory = (
  products: FrontendProduct[],
  query: string
): string => {
  // 1) Ưu tiên theo CategoryId từ backend
  if (products.length > 0) {
    const counts: Record<string, number> = {};
    let totalWithCategory = 0;

    for (const p of products) {
      if (p.categoryId != null) {
        const key = String(p.categoryId);
        counts[key] = (counts[key] || 0) + 1;
        totalWithCategory++;
      }
    }

    if (totalWithCategory > 0) {
      const entries = Object.entries(counts);
      const [bestCat, bestCount] = entries.reduce(
        (best, cur) => (cur[1] > best[1] ? cur : best),
        entries[0]
      );
      const ratio = bestCount / totalWithCategory;
      if (ratio >= 0.6) {
        return bestCat; // "1" | "2" | ...
      }
    }
  }

  // 2) Fallback theo query text
  const lower = query.toLowerCase();

  if (lower.includes("laptop")) return "1";
  if (lower.includes("chuột") || lower.includes("mouse")) return "5";
  if (lower.includes("bàn phím") || lower.includes("keyboard")) return "4";
  if (lower.includes("màn hình") || lower.includes("monitor")) return "3";
  if (
    lower.includes("pc") ||
    lower.includes("desktop") ||
    lower.includes("máy tính bàn")
  )
    return "2";

  // 3) Không đoán được gì rõ ràng → dùng filter chung
  return "all";
};

// ===============================
//  Fetch API search
// ===============================
async function fetchSearchResults(query: string): Promise<BackendProduct[]> {
  if (!query) return [];
  const res = await fetch(
    `${API_BASE}/api/products?keyword=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error('Failed to fetch search results');
  const json = await res.json();
  return json.success ? json.data : [];
}

// ===============================
//  Component chính
// ===============================
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("popular");

  const prevCategoryRef = useRef<string>("");

  const [filters, setFilters] = useState<FilterState>({
    category: "",
    brand: "",
    price: "",
    cpu: "",
    usage: "",
    series: "",
    screenSize: "",
    ram: "",
    ssd: "",
    vga: "",
    dpi: "",
    resolution: "",
    panelType: "",
    keyboardType: "",
    layout: "",
    psu: "",
  });

  // Category active để lấy config filter
  const activeCategory = filters.category || "all";
  const rawFilterConfig =
    CATEGORY_FILTER_CONFIG[activeCategory] ?? CATEGORY_FILTER_CONFIG["all"];

  // Ẩn ô "Danh mục" khỏi UI
  const visibleFilterConfig = rawFilterConfig.filter(
    (cfg) => cfg.key !== "category"
  );

  // Fetch sản phẩm theo query
  useEffect(() => {
    if (!query) {
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const backendProducts = await fetchSearchResults(query);
        const mapped = backendProducts.map(mapToFrontendProduct);

        // Nếu muốn có specs để filter sâu, gọi thêm details như ở CollectionsAll
        const detailed = await Promise.all(
          mapped.map(async (p) => {
            try {
              const detailRes = await fetch(
                `${API_BASE}/api/products?productId=${p.id}&details=true`
              );
              const detailData = await detailRes.json();
              if (detailData.success) {
                p.specs = detailData.data.specs;
              }
            } catch (err) {
              console.error("Error fetching product details:", err);
            }
            return p;
          })
        );

        setProducts(detailed);
        setFilteredProducts(detailed);
        setVisibleCount(4);
        setHasMore(detailed.length > 4);

        // Reset filter khi đổi query
        setFilters({
          category: "",
          brand: "",
          price: "",
          cpu: "",
          usage: "",
          series: "",
          screenSize: "",
          ram: "",
          ssd: "",
          vga: "",
          dpi: "",
          resolution: "",
          panelType: "",
          keyboardType: "",
          layout: "",
          psu: "",
        });
        prevCategoryRef.current = "";
      } catch (err) {
        console.error(err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Auto detect category từ results + query -> set vào filters.category (ẩn)
  useEffect(() => {
    if (!products.length && !query) return;
    const detected = detectCategory(products, query);
    setFilters((prev) => ({
      ...prev,
      category: detected === "all" ? "" : detected,
    }));
  }, [products, query]);

  // Reset các filter phụ khi đổi category (do auto detect)
  useEffect(() => {
    if (filters.category !== prevCategoryRef.current) {
      setFilters((prev) => ({
        category: prev.category,
        brand: "",
        price: "",
        cpu: "",
        usage: "",
        series: "",
        screenSize: "",
        ram: "",
        ssd: "",
        vga: "",
        dpi: "",
        resolution: "",
        panelType: "",
        keyboardType: "",
        layout: "",
        psu: "",
      }));
      prevCategoryRef.current = filters.category;
    }
  }, [filters.category]);

  // Áp dụng filter + sort
  useEffect(() => {
    let result = [...products];

    const {
      category,
      brand,
      cpu,
      price,
      usage,
      series,
      screenSize,
      ram,
      ssd,
      vga,
      dpi,
      resolution,
      panelType,
      keyboardType,
      layout,
      psu,
    } = filters;

    if (category) {
      result = result.filter((p) => {
        if (p.categoryId !== null && String(p.categoryId) === category) {
          if (category === "2" && p.name.toLowerCase().includes("laptop")) return false;
          return true;
        }
        let keyword = "";
        if (category === "1") keyword = "laptop";
        else if (category === "2") keyword = "pc";
        else if (category === "3") keyword = "màn hình";
        else if (category === "4") keyword = "bàn phím";
        else if (category === "5") keyword = "chuột";
        return (
          keyword &&
          (p.name.toLowerCase().includes(keyword) ||
            p.description.toLowerCase().includes(keyword))
        );
      });
    }

    if (brand)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(brand.toLowerCase()) ||
          p.description.toLowerCase().includes(brand.toLowerCase())
      );

    if (cpu)
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("cpu") &&
            s.SpecValue.toLowerCase().includes(cpu.toLowerCase())
        ) || p.description.toLowerCase().includes(cpu.toLowerCase())
      );

    if (series)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(series.toLowerCase())
      );

    if (usage)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(usage.toLowerCase()) ||
          p.description.toLowerCase().includes(usage.toLowerCase())
      );

    if (screenSize)
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            (s.SpecName.toLowerCase().includes("màn hình") ||
              s.SpecName.toLowerCase().includes("screen") ||
              s.SpecName.toLowerCase().includes("kích thước")) &&
            s.SpecValue.toLowerCase().includes(screenSize.toLowerCase())
        ) || p.description.toLowerCase().includes(screenSize.toLowerCase())
      );

    if (ram)
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("ram") &&
            s.SpecValue.toLowerCase().includes(ram.toLowerCase())
        ) || p.description.toLowerCase().includes(ram.toLowerCase())
      );

    if (ssd)
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            (s.SpecName.toLowerCase().includes("ssd") ||
              s.SpecName.toLowerCase().includes("ổ cứng")) &&
            s.SpecValue.toLowerCase().includes(ssd.toLowerCase())
        ) || p.description.toLowerCase().includes(ssd.toLowerCase())
      );

    if (vga)
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("vga") &&
            s.SpecValue.toLowerCase().includes(vga.toLowerCase())
        ) || p.description.toLowerCase().includes(vga.toLowerCase())
      );

    const extractMaxDpi = (value: string): number | null => {
      // Bỏ dấu . và , trong số: 25.000 -> 25000, 30,000 -> 30000
      const cleaned = value.replace(/[.,]/g, "");

      const matches = cleaned.match(/\d+/g);
      if (!matches) return null;

      const nums = matches.map((n) => parseInt(n, 10));
      return Math.max(...nums);
    };

    if (dpi) {
      const dpiLimit = parseInt(dpi, 10);

      result = result.filter((p) =>
        p.specs?.some((s) => {
          const specName = s.SpecName.toLowerCase();

          // Chỉ xử lý những dòng liên quan tới DPI
          if (!(specName.includes("độ phân giải") || specName.includes("dpi"))) {
            return false;
          }

          const maxDpi = extractMaxDpi(s.SpecValue);
          if (maxDpi == null) return false;

          return maxDpi <= dpiLimit;
        })
      );
    }

    if (resolution) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("độ phân giải") &&
            s.SpecValue.toLowerCase().includes(resolution.toLowerCase())
        )
      );
    }

    if (panelType) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("tấm nền") &&
            s.SpecValue.toLowerCase().includes(panelType.toLowerCase())
        )
      );
    }

    if (keyboardType) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("loại bàn phím") &&
            s.SpecValue.toLowerCase().includes(keyboardType.toLowerCase())
        )
      );
    }

    if (layout) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("layout") &&
            s.SpecValue.toLowerCase().includes(layout.toLowerCase())
        )
      );
    }

    if (psu) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("psu") &&
            s.SpecValue.toLowerCase().includes(psu.toLowerCase())
        )
      );
    }

    if (price) {
      const [min, max] = price.split("-").map(Number);
      result = result.filter((p) => {
        const realPrice = p.discountPrice || p.price;
        return realPrice >= min && (max ? realPrice <= max : true);
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort(
        (a, b) =>
          (a.discountPrice || a.price) - (b.discountPrice || b.price)
      );
    } else if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          (b.discountPrice || b.price) - (a.discountPrice || a.price)
      );
    }

    setFilteredProducts(result);
    const initialCount = 4;
    setVisibleCount(initialCount);
    setHasMore(result.length > initialCount);
  }, [filters, sortBy, products]);

  const loadMore = () => {
    const newCount = visibleCount + 4;
    setVisibleCount(newCount);
    setHasMore(newCount < filteredProducts.length);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name as FilterKey]: value }));
  };

  if (loading) return <p>Loading...</p>;
  if (!query) return <p>Không có truy vấn tìm kiếm.</p>;

  return (
    <>
      <Header />
      <main className={styles.searchPage}>
        <ContainerFluid>
          <div className={styles.searchPageResults}>
            <h1 className={styles.title}>KẾT QUẢ TÌM KIẾM</h1>
            <p className={styles.subtitle}>
              Tìm kiếm theo: <strong>{query}</strong>
            </p>

            {/* Thanh filter + sort (không có ô danh mục) */}
            <div className={styles.filterBar}>
              <div className={styles.filterWrap}>
                {visibleFilterConfig.map((f) => (
                  <select
                    key={f.key}
                    name={f.key}
                    value={filters[f.key]}
                    onChange={handleFilterChange}
                    className={styles.filterSelect}
                  >
                    <option value="">{f.placeholder}</option>
                    {f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>

              <div className={styles.sortWrap}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid sản phẩm */}
            <div className={styles.productGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className={styles.notFoundProduct}>
                  Không tìm thấy sản phẩm nào.
                </p>
              )}
            </div>

            {hasMore && filteredProducts.length > 0 && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreButton} onClick={loadMore}>
                  Xem thêm sản phẩm
                </button>
              </div>
            )}
          </div>
        </ContainerFluid>

        <FlashSale
          className="flash-sale-2"
          h2Title="⚡ GEAR ARENA WEEK"
          showTitle={false}
          showReadMore={false}
          campaignCode="GEAR_ARENA_WEEK"
        />
      </main>
      <Footer />
    </>
  );
}
