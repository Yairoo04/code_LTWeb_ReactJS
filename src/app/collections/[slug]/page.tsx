"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSortDown } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "@/pages/main_Page/Product/ProductCard";
import styles from "./CollectionsSlug.module.scss";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ContainerFluid from "@/pages/main_Page/ContainerFluid/container-fluid";
import RecentView from "@/pages/main_Page/RecentViewProducts/RecentView";
import CategoryCollection from "@/pages/main_Page/sectionCollection/CategoryCollection";
import classNames from "classnames";
import { megaMenuData } from "@/lib/data";

// -------------------------
// TYPES
// -------------------------
type ApiProduct = {
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

type FrontendProduct = {
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

type FilterState = {
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

type FilterKey = keyof FilterState;

type FilterConfig = {
  key: FilterKey;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
};

// -------------------------
// API + HELPERS
// -------------------------
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const mapToFrontendProduct = (apiProduct: ApiProduct): FrontendProduct => ({
  id: apiProduct.ProductId,
  name: apiProduct.Name,
  description: apiProduct.Description,
  price: apiProduct.Price,
  discountPrice: apiProduct.DiscountPrice,
  categoryId: apiProduct.CategoryId,
  image_url: apiProduct.ImageUrl,
  stock: apiProduct.Stock,
});

// -------------------------
// SORT OPTIONS
// -------------------------
const sortOptions = [
  { value: "popular", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

// -------------------------
// FILTER CONFIG PER CATEGORY
// -------------------------
const CATEGORY_FILTER_CONFIG: Record<string, FilterConfig[]> = {
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
        { value: "học sinh", label: "Học sinh - Sinh viên" },
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
        { value: "2", label: "PC" },
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
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "asus", label: "ASUS" },
        { value: "gigabyte", label: "Gigabyte" },
        { value: "msi", label: "MSI" },
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
        { value: "3", label: "Màn hình" },
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
        { value: "4", label: "Bàn phím" },
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
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "logitech", label: "Logitech" },
        { value: "razer", label: "Razer" },
        { value: "steelseries", label: "SteelSeries" },
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

// -------------------------
// BUILD PRESET MAP FROM MEGA MENU DATA
// -------------------------
const buildPresetMap = () => {
  const map = new Map<string, Partial<FilterState>>();

  megaMenuData.forEach((item) => {
    item.subItems.forEach((sub) => {
      sub.filters.forEach((f) => {
        if (f.filters) {
          map.set(f.href, f.filters);
        }
      });
    });
  });

  return map;
};

const presetMap = buildPresetMap();

// -------------------------
// MAIN COMPONENT
// -------------------------
const CollectionPage = () => {
  const { slug } = useParams() as { slug: string };
  const pathname = `/collections/${slug}`;

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  // -------------------------
  // FILTERS
  // -------------------------
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

  const activeCategory = filters.category || "1"; // Fallback to Laptop if not set
  const activeFilterConfig = CATEGORY_FILTER_CONFIG[activeCategory] ?? CATEGORY_FILTER_CONFIG["1"];

  // -------------------------
  // TITLE + FILTER PRESETS
  // -------------------------
  useEffect(() => {
    if (!slug) return;

    // 1. Title
    const s = slug.toLowerCase();
    setTitle(
      slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );

    // 2. Nếu có preset trong megaMenuData → xài luôn
    const preset = presetMap.get(pathname);

    if (preset) {
      setFilters((prev) => ({
        ...prev,
        ...preset,
      }));
      return; // khỏi cần đoán nữa
    }

    // 3. Không có preset → fallback qua logic suy luận từ slug
    const newFilters: FilterState = {
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
    };

    // 1️⃣ Category
    if (s.includes("laptop")) newFilters.category = "1";
    else if (s.includes("pc")) newFilters.category = "2";
    else if (s.includes("man-hinh")) newFilters.category = "3";
    else if (s.includes("ban-phim")) newFilters.category = "4";
    else if (s.includes("chuot")) newFilters.category = "5";

    // 2️⃣ Brand
    const brands = [
      "asus",
      "acer",
      "msi",
      "lenovo",
      "dell",
      "hp",
      "lg",
      "gigabyte",
      "viewsonic",
      "keychron",
      "logitech",
    ];
    const foundBrand = brands.find((b) => s.includes(b));
    if (foundBrand) newFilters.brand = foundBrand;

    // 3️⃣ CPU
    if (s.includes("intel")) newFilters.cpu = "intel";
    else if (s.includes("amd")) newFilters.cpu = "amd";

    // 4️⃣ Price
    if (s.includes("duoi-15")) newFilters.price = "0-15000000";
    else if (s.includes("15tr-den-20tr")) newFilters.price = "15000000-20000000";
    else if (s.includes("tren-20")) newFilters.price = "20000000-999999999";

    // 5️⃣ Usage
    if (s.includes("hoc-sinh") || s.includes("hoc-tap")) newFilters.usage = "học sinh";
    else if (s.includes("do-hoa")) newFilters.usage = "đồ họa";
    else if (s.includes("mong-nhe")) newFilters.usage = "mỏng nhẹ";
    else if (s.includes("gaming")) newFilters.usage = "gaming";

    // 6️⃣ Series
    const seriesKeywords = [
      "xps",
      "vivobook",
      "zenbook",
      "loq",
      "predator",
      "rog",
      "tuf",
      "pavilion",
    ];
    const foundSeries = seriesKeywords.find((k) => s.includes(k));
    if (foundSeries) newFilters.series = foundSeries;

    setFilters(newFilters);
  }, [slug, pathname]);

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map(mapToFrontendProduct);
          const detailed = await Promise.all(
            mapped.map(async (p) => {
              const detailRes = await fetch(
                `${API_BASE}/api/products?productId=${p.id}&details=true`
              );
              const detailData = await detailRes.json();
              if (detailData.success) {
                p.specs = detailData.data.specs;
              }
              return p;
            })
          );
          setProducts(detailed);
          setFilteredProducts(detailed);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // -------------------------
  // APPLY FILTERS
  // -------------------------
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
        // Strict match CategoryId if not null
        if (p.categoryId !== null && String(p.categoryId) === category) {
          // Additional check for category "2" (PC): Exclude if name includes "laptop"
          if (category === "2" && p.name.toLowerCase().includes("laptop")) return false;
          return true;
        }
        // Fallback for null/mismatch CategoryId: Check name/desc
        let keyword = '';
        if (category === '1') keyword = 'laptop';
        else if (category === '2') keyword = 'pc';
        else if (category === '3') keyword = 'màn hình';
        else if (category === '4') keyword = 'bàn phím';
        else if (category === '5') keyword = 'chuột';
        return keyword && (p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword));
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
        p.specs?.some((s) =>
          s.SpecName.toLowerCase().includes("cpu") &&
          s.SpecValue.toLowerCase().includes(cpu.toLowerCase())
        ) || p.description.toLowerCase().includes(cpu.toLowerCase())
      );

    if (series)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(series.toLowerCase())
      );

    if (usage) {
      const nameDescFilter = (p: FrontendProduct, keyword: string) => {
        const kw = keyword.toLowerCase();
        const name = p.name.toLowerCase();
        const desc = p.description.toLowerCase();
        return name.includes(kw) || desc.includes(kw);
      };

      const usageList = Array.isArray(usage)
        ? usage.map((u) => u.toLowerCase())
        : [usage.toLowerCase()];

      result = result.filter((p) =>
        usageList.some((u) => nameDescFilter(p, u))
      );
    }


    if (screenSize)
      result = result.filter((p) =>
        p.specs?.some((s) =>
          (s.SpecName.toLowerCase().includes("màn hình") || s.SpecName.toLowerCase().includes("screen") || s.SpecName.toLowerCase().includes("kích thước")) &&
          s.SpecValue.toLowerCase().includes(screenSize.toLowerCase())
        ) || p.description.toLowerCase().includes(screenSize.toLowerCase())
      );

    if (ram)
      result = result.filter((p) =>
        p.specs?.some((s) =>
          s.SpecName.toLowerCase().includes("ram") &&
          s.SpecValue.toLowerCase().includes(ram.toLowerCase())
        ) || p.description.toLowerCase().includes(ram.toLowerCase())
      );

    if (ssd)
      result = result.filter((p) =>
        p.specs?.some((s) =>
          (s.SpecName.toLowerCase().includes("ssd") || s.SpecName.toLowerCase().includes("ổ cứng")) &&
          s.SpecValue.toLowerCase().includes(ssd.toLowerCase())
        ) || p.description.toLowerCase().includes(ssd.toLowerCase())
      );

    if (vga)
      result = result.filter((p) =>
        p.specs?.some((s) =>
          s.SpecName.toLowerCase().includes("vga") &&
          s.SpecValue.toLowerCase().includes(vga.toLowerCase())
        ) || p.description.toLowerCase().includes(vga.toLowerCase())
      );

    const extractMaxDpi = (value: string): number | null => {
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
        p.specs?.some((s) =>
          s.SpecName.toLowerCase().includes("độ phân giải") &&
          s.SpecValue.toLowerCase().includes(resolution.toLowerCase())
        )
      );
    }

    if (panelType) {
      result = result.filter((p) =>
        p.specs?.some((s) =>
          s.SpecName.toLowerCase().includes("tấm nền") &&
          s.SpecValue.toLowerCase().includes(panelType.toLowerCase())
        )
      );
    }

    if (keyboardType) {
      result = result.filter((p) =>
        p.specs?.some((s) =>
          s.SpecName.toLowerCase().includes("loại bàn phím") &&
          s.SpecValue.toLowerCase().includes(keyboardType.toLowerCase())
        )
      );
    }

    if (layout) {
      result = result.filter((p) =>
        p.specs?.some((s) =>
          s.SpecName.toLowerCase().includes("layout") &&
          s.SpecValue.toLowerCase().includes(layout.toLowerCase())
        )
      );
    }

    if (psu) {
      result = result.filter((p) =>
        p.specs?.some((s) =>
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
    setVisibleCount(5);
    setHasMore(result.length > 5);
  }, [filters, sortBy, products]);

  // -------------------------
  // LOAD MORE
  // -------------------------
  const loadMore = () => {
    const newCount = visibleCount + 5;
    setVisibleCount(newCount);
    setHasMore(newCount < filteredProducts.length);
  };

  const handleSortChange = (newValue: string) => {
    setSortBy(newValue);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------
  // SORT HANDLING
  // -------------------------
  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Nổi bật";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(`.${styles.selectWrapper}`)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <>
      <Header />

      <main className={styles.mainCollections}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbWrap}>
          <ContainerFluid>
            <div className={styles.breadcrumbList}>
              <ol className={styles.breadcrumbArrow}>
                <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <strong>{title}</strong>
                </li>
              </ol>
            </div>
          </ContainerFluid>
        </div>

        <ContainerFluid>

          <div className={styles.collectionsContainer}>
            {/* Sort bar */}
            <div className={styles.filterBar}>
              <section className={styles.filterWrap}>
                {activeFilterConfig.map((f) => (
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
              </section>

              <section className={styles.collectionSortby}>
                <div className={styles.selectWrapper}>
                  <div
                    className={classNames(styles.listboxButton, 'js-sort', { [styles.active]: isOpen })}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
                      enableBackground="new 0 0 512 512"
                    >
                      <g>
                        <path
                          fill="#111111"
                          fillRule="nonzero"
                          d="M9 7v15.584l1.293-1.291 1.414 1.414L8 26.414l-3.707-3.707 1.414-1.414L7 22.584V7zm9 15v2h-5v-2zm3-5v2h-8v-2zm3-5v2H13v-2zm3-5v2H13V7z"
                        />
                      </g>
                    </svg>
                    <div className={styles.sortbyControl}>
                      <span className={styles.listboxText}>Xếp theo:</span>
                      <span className={`${styles.listboxValue} current-sort`}>{currentLabel}</span>
                      <FontAwesomeIcon icon={faSortDown} className={styles.dropdownIcon} />
                    </div>
                  </div>

                  {isOpen && (
                    <ul className={styles.dropdownMenu}>
                      {sortOptions.map((opt) => (
                        <li
                          key={opt.value}
                          className={classNames(styles.dropdownItem, { [styles.selected]: opt.value === sortBy })}
                          onClick={() => {
                            handleSortChange(opt.value);
                            setIsOpen(false);
                          }}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </div>

            {/* Product Grid */}
            <div className={styles.productGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className={styles.notFoundProduct}>Không tìm thấy sản phẩm nào.</p>
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
      </main>

      <RecentView />
      <CategoryCollection />
      <Footer />
    </>
  );
};

export default CollectionPage;