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
};

const mapToFrontendProduct = (apiProduct: ApiProduct): FrontendProduct => ({
  id: apiProduct.ProductId,
  name: apiProduct.Name,
  description: apiProduct.Description,
  price: apiProduct.Price,
  discountPrice: apiProduct.DiscountPrice,
  categoryId: apiProduct.CategoryId,
  image_url: apiProduct.ImageUrl,
  stock: apiProduct.Stock,
  totalReviews: (apiProduct as any).totalReviews ?? 0,
  averageRating: (apiProduct as any).averageRating ?? 0,
});

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

  // Set filters từ slug + preset
  useEffect(() => {
    if (!slug) return;

    const s = slug.toLowerCase();

    // 1. preset từ mega menu nếu có
    const preset = presetMap.get(pathname);
    if (preset) {
      setFilters((prev) => ({
        ...prev,
        ...preset,
      }));
      return;
    }

    // 2. fallback suy luận từ slug
    const nf: FilterState = { ...emptyFilters };

    // Category
    if (s.includes("laptop")) nf.category = "1";
    else if (s.includes("pc")) nf.category = "2";
    else if (s.includes("man-hinh")) nf.category = "3";
    else if (s.includes("ban-phim")) nf.category = "4";
    else if (s.includes("chuot")) nf.category = "5";

    // Brand
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
    ];
    const foundSeries = seriesKeywords.find((k) => s.includes(k));
    if (foundSeries) nf.series = foundSeries;

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
