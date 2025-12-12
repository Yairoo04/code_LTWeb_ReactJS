// src/hooks/useCollectionProducts.ts
import { useEffect, useState } from "react";
import type {
  ApiProduct,
  FrontendProduct,
  FilterState,
} from "@/lib/products/types";
import { applyFiltersAndSort } from "@/lib/products/applyFilters";
import { presetMap } from "@/lib/products/presets";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const emptyFilters: FilterState = {
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
  socket: "",
  watt: "",
  capacity: "",
};

const mapToFrontendProduct = (apiProduct: ApiProduct): FrontendProduct => {
  let images: string[] = [];

  try {
    const parsed = JSON.parse(apiProduct.ImageUrl ?? "[]");
    if (Array.isArray(parsed)) images = parsed;
  } catch {
    images = (apiProduct.ImageUrl ?? "")
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  }

  return {
    id: apiProduct.ProductId,
    name: apiProduct.Name,
    description: apiProduct.Description,
    price: apiProduct.Price,
    discountPrice: apiProduct.DiscountPrice,
    categoryId: apiProduct.CategoryId,
    image_url: images,   // ← CHUẨN: luôn là array
    stock: apiProduct.Stock,
    totalReviews: (apiProduct as any).totalReviews ?? 0,
    averageRating: (apiProduct as any).averageRating ?? 0,
  };
};


export const useCollectionProducts = (slug: string, pathname: string) => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>(
    []
  );
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;

    const s = slug.toLowerCase();

    const preset = presetMap.get(pathname);
    if (preset) {
      setFilters((prev) => ({
        ...prev,
        ...preset,
      }));
      return;
    }

    const nf: FilterState = { ...emptyFilters };

    if (s.includes("laptop")) nf.category = "1";
    else if (s.includes("pc")) nf.category = "2";
    else if (s.includes("man-hinh")) nf.category = "3";
    else if (s.includes("ban-phim")) nf.category = "4";
    else if (s.includes("chuot")) nf.category = "5";
    else if (s.includes("mainboard") || s.includes("bo-mach-chu")) nf.category = "6";
    else if (s.includes("vga") || s.includes("card-man-hinh")) nf.category = "6";
    else if (s.includes("case") || s.includes("vo-may-tinh")) nf.category = "7";
    else if (s.includes("psu") || s.includes("nguon")) nf.category = "7";
    else if (s.includes("cooling") || s.includes("tan-nhiet")) nf.category = "7";
    else if (s.includes("ram")) nf.category = "8";
    else if (s.includes("storage") || s.includes("o-cung")) nf.category = "8";

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
      "corsair",
      "lian li",
      "deepcool",
      "samsung",
      "wd",
      "v-color",
      "kingston",
    ];
    const foundBrand = brands.find((b) => s.includes(b));
    if (foundBrand) nf.brand = foundBrand;

    // CPU
    if (s.includes("intel")) nf.cpu = "intel";
    else if (s.includes("amd")) nf.cpu = "amd";

    // Price
    if (s.includes("duoi-15")) nf.price = "0-15000000";
    else if (s.includes("15tr-den-20tr")) nf.price = "15000000-20000000";
    else if (s.includes("tren-20")) nf.price = "20000000-999999999";

    // Usage
    if (s.includes("hoc-sinh") || s.includes("hoc-tap")) nf.usage = "học sinh";
    else if (s.includes("do-hoa")) nf.usage = "đồ họa";
    else if (s.includes("mong-nhe")) nf.usage = "mỏng nhẹ";
    else if (s.includes("gaming")) nf.usage = "gaming";
    else if (s.includes("workstation")) nf.usage = "workstation";

    // Series
    const seriesKeywords = [
      "xps",
      "vivobook",
      "zenbook",
      "loq",
      "predator",
      "rog",
      "tuf",
      "pavilion",
      "rtx 5060",
      "rtx 5060 ti",
      "rtx 5070",
      "rtx 5070 ti",
      "rtx 5080",
      "rtx 5090",
      "z790",
      "z890",
      "dominator",
      "fury beast",
      "aorus",
    ];
    const foundSeries = seriesKeywords.find((k) => s.includes(k));
    if (foundSeries) nf.series = foundSeries;

    // Socket
    const sockets = ["lga 1700", "am5"];
    const foundSocket = sockets.find((sk) => s.includes(sk.toLowerCase()));
    if (foundSocket) nf.socket = foundSocket;

    // Watt for PSU
    const watts = ["850w", "1000w", "1500w", "1600w"];
    const foundWatt = watts.find((w) => s.includes(w));
    if (foundWatt) nf.watt = foundWatt;

    // Capacity for RAM/Storage
    const capacities = ["128gb", "500gb", "1tb", "2tb", "32gb", "64gb"];
    const foundCapacity = capacities.find((c) => s.includes(c));
    if (foundCapacity) nf.capacity = foundCapacity;

    setFilters(nf);
  }, [slug, pathname]);

  // Fetch products + specs
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (data.success) {
          const mapped: FrontendProduct[] = data.data.map(mapToFrontendProduct);
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
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters + sort
  useEffect(() => {
    const result = applyFiltersAndSort(products, filters, sortBy);
    setFilteredProducts(result);
    setVisibleCount(5);
    setHasMore(result.length > 5);
  }, [products, filters, sortBy]);

  const loadMore = () => {
    setVisibleCount((prev) => {
      const newCount = prev + 5;
      setHasMore(newCount < filteredProducts.length);
      return newCount;
    });
  };

  return {
    products,
    filteredProducts,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    visibleCount,
    hasMore,
    loadMore,
    isLoading,
  };
};