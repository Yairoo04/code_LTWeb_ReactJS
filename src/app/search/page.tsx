// app/search/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import styles from './SearchPage.module.scss';
import '@/styles/globals.scss';

import Header from '@/components/Header/Header.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import ProductCard from '@/pages/main_Page/Product/ProductCard';
import ProductCardSkeleton from '@/pages/main_Page/Product/ProductCardSkeleton';
import FlashSale from '@/pages/main_Page/FlashSale/FlashSale';

import { CATEGORY_FILTER_CONFIG } from '@/lib/products/filterConfig';
import type { FilterState } from '@/lib/products/types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

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

  // rating từ API
  AverageRating?: number | null;
  TotalReviews?: number | null;
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

  // đồng bộ với ProductCard
  averageRating?: number | null;
  totalReviews?: number | null;
  AverageRating?: number | null;
  TotalReviews?: number | null;
};

// ===============================
//  Sort config
// ===============================
const sortOptions = [
  { value: 'popular', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
];

// ===============================
//  Helpers
// ===============================
const mapToFrontendProduct = (product: BackendProduct): FrontendProduct => ({
  id: product.ProductId,
  name: product.Name,
  description: product.Description ?? '',
  price: product.Price,
  discountPrice: product.DiscountPrice ?? null,
  ImageUrl: product.ImageUrl,
  image_url: product.ImageUrl,
  stock: product.Stock ?? 0,
  categoryId: product.CategoryId ?? null,

  // normalize rating
  averageRating:
    typeof product.AverageRating === 'number' ? product.AverageRating : null,
  totalReviews:
    typeof product.TotalReviews === 'number' ? product.TotalReviews : 0,
  AverageRating:
    typeof product.AverageRating === 'number' ? product.AverageRating : null,
  TotalReviews:
    typeof product.TotalReviews === 'number' ? product.TotalReviews : 0,
});

// normalize cho trường hợp lỡ sau này dùng string[]
const normalizeFilterValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};

// Auto detect category từ kết quả + query
const detectCategory = (products: FrontendProduct[], query: string): string => {
  // 1) Ưu tiên theo CategoryId
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
        entries[0],
      );
      const ratio = bestCount / totalWithCategory;
      if (ratio >= 0.6) {
        return bestCat; // "1", "2", ...
      }
    }
  }

  // 2) Fallback theo text query
  const lower = query.toLowerCase();

  if (lower.includes('laptop')) return '1';
  if (lower.includes('chuột') || lower.includes('mouse')) return '5';
  if (lower.includes('bàn phím') || lower.includes('keyboard')) return '4';
  if (lower.includes('màn hình') || lower.includes('monitor')) return '3';
  if (
    lower.includes('pc') ||
    lower.includes('desktop') ||
    lower.includes('máy tính bàn')
  )
    return '2';

  // 3) Không rõ thì coi như "all"
  return 'all';
};

async function fetchSearchResults(query: string): Promise<BackendProduct[]> {
  if (!query) return [];
  const res = await fetch(
    `${API_BASE}/api/products?keyword=${encodeURIComponent(query)}`,
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
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>(
    [],
  );
  const [visibleCount, setVisibleCount] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('popular');

  const prevCategoryRef = useRef<string>('');

  const [filters, setFilters] = useState<FilterState>({
    category: '',
    brand: '',
    price: '',
    cpu: '',
    usage: '',
    series: '',
    screenSize: '',
    ram: '',
    ssd: '',
    vga: '',
    dpi: '',
    resolution: '',
    panelType: '',
    keyboardType: '',
    layout: '',
    psu: '',
  });

  // Active category để lấy filter config
  const activeCategory = normalizeFilterValue(filters.category) || '1';
  const rawFilterConfig =
    CATEGORY_FILTER_CONFIG[activeCategory] ??
    CATEGORY_FILTER_CONFIG['1'] ??
    [];

  // Ẩn ô "Danh mục" khỏi UI
  const visibleFilterConfig = rawFilterConfig.filter(
    (cfg) => cfg.key !== 'category',
  );

  // Fetch sản phẩm theo query
  useEffect(() => {
    if (!query) {
      setProducts([]);
      setFilteredProducts([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const backendProducts = await fetchSearchResults(query);
        const mapped = backendProducts.map(mapToFrontendProduct);

        // Lấy specs cho filter sâu
        const detailed = await Promise.all(
          mapped.map(async (p) => {
            try {
              const detailRes = await fetch(
                `${API_BASE}/api/products?productId=${p.id}&details=true`,
              );
              const detailData = await detailRes.json();
              if (detailData.success) {
                p.specs = detailData.data.specs;
              }
            } catch (err) {
              console.error('Error fetching product details:', err);
            }
            return p;
          }),
        );

        setProducts(detailed);
        setFilteredProducts(detailed);
        setVisibleCount(4);
        setHasMore(detailed.length > 4);

        // Reset filter khi đổi query
        setFilters({
          category: '',
          brand: '',
          price: '',
          cpu: '',
          usage: '',
          series: '',
          screenSize: '',
          ram: '',
          ssd: '',
          vga: '',
          dpi: '',
          resolution: '',
          panelType: '',
          keyboardType: '',
          layout: '',
          psu: '',
        });
        prevCategoryRef.current = '';
      } catch (err) {
        console.error(err);
        setProducts([]);
        setFilteredProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Auto detect category ẩn từ results + query
  useEffect(() => {
    if (!products.length && !query) return;
    const detected = detectCategory(products, query);
    setFilters((prev) => ({
      ...prev,
      category: detected === 'all' ? '' : detected,
    }));
  }, [products, query]);

  // Reset filter phụ khi category đổi
  useEffect(() => {
    const normalizedCategory = normalizeFilterValue(filters.category);
    if (normalizedCategory !== prevCategoryRef.current) {
      setFilters((prev) => ({
        ...prev,
        category: normalizedCategory,
        brand: '',
        price: '',
        cpu: '',
        usage: '',
        series: '',
        screenSize: '',
        ram: '',
        ssd: '',
        vga: '',
        dpi: '',
        resolution: '',
        panelType: '',
        keyboardType: '',
        layout: '',
        psu: '',
      }));
      prevCategoryRef.current = normalizedCategory;
    }
  }, [filters.category]);

  // Apply filter + sort
  useEffect(() => {
    let result = [...products];

    const category = normalizeFilterValue(filters.category);
    const brand = normalizeFilterValue(filters.brand);
    const cpu = normalizeFilterValue(filters.cpu);
    const price = normalizeFilterValue(filters.price);
    const usage = normalizeFilterValue(filters.usage);
    const series = normalizeFilterValue(filters.series);
    const screenSize = normalizeFilterValue(filters.screenSize);
    const ram = normalizeFilterValue(filters.ram);
    const ssd = normalizeFilterValue(filters.ssd);
    const vga = normalizeFilterValue(filters.vga);
    const dpi = normalizeFilterValue(filters.dpi);
    const resolution = normalizeFilterValue(filters.resolution);
    const panelType = normalizeFilterValue(filters.panelType);
    const keyboardType = normalizeFilterValue(filters.keyboardType);
    const layout = normalizeFilterValue(filters.layout);
    const psu = normalizeFilterValue(filters.psu);

    if (category) {
      result = result.filter((p) => {
        if (p.categoryId !== null && String(p.categoryId) === category) {
          if (category === '2' && p.name.toLowerCase().includes('laptop'))
            return false;
          return true;
        }
        let keyword = '';
        if (category === '1') keyword = 'laptop';
        else if (category === '2') keyword = 'pc';
        else if (category === '3') keyword = 'màn hình';
        else if (category === '4') keyword = 'bàn phím';
        else if (category === '5') keyword = 'chuột';
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
          p.description.toLowerCase().includes(brand.toLowerCase()),
      );

    if (cpu)
      result = result.filter(
        (p) =>
          p.specs?.some(
            (s) =>
              s.SpecName.toLowerCase().includes('cpu') &&
              s.SpecValue.toLowerCase().includes(cpu.toLowerCase()),
          ) || p.description.toLowerCase().includes(cpu.toLowerCase()),
      );

    if (series)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(series.toLowerCase()),
      );

    if (usage)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(usage.toLowerCase()) ||
          p.description.toLowerCase().includes(usage.toLowerCase()),
      );

    if (screenSize)
      result = result.filter(
        (p) =>
          p.specs?.some(
            (s) =>
              (s.SpecName.toLowerCase().includes('màn hình') ||
                s.SpecName.toLowerCase().includes('screen') ||
                s.SpecName.toLowerCase().includes('kích thước')) &&
              s.SpecValue.toLowerCase().includes(screenSize.toLowerCase()),
          ) ||
          p.description.toLowerCase().includes(screenSize.toLowerCase()),
      );

    if (ram)
      result = result.filter(
        (p) =>
          p.specs?.some(
            (s) =>
              s.SpecName.toLowerCase().includes('ram') &&
              s.SpecValue.toLowerCase().includes(ram.toLowerCase()),
          ) || p.description.toLowerCase().includes(ram.toLowerCase()),
      );

    if (ssd)
      result = result.filter(
        (p) =>
          p.specs?.some(
            (s) =>
              (s.SpecName.toLowerCase().includes('ssd') ||
                s.SpecName.toLowerCase().includes('ổ cứng')) &&
              s.SpecValue.toLowerCase().includes(ssd.toLowerCase()),
          ) || p.description.toLowerCase().includes(ssd.toLowerCase()),
      );

    if (vga)
      result = result.filter(
        (p) =>
          p.specs?.some(
            (s) =>
              s.SpecName.toLowerCase().includes('vga') &&
              s.SpecValue.toLowerCase().includes(vga.toLowerCase()),
          ) || p.description.toLowerCase().includes(vga.toLowerCase()),
      );

    const extractMaxDpi = (value: string): number | null => {
      const cleaned = value.replace(/[.,]/g, '');
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
          if (
            !(
              specName.includes('độ phân giải') || specName.includes('dpi')
            )
          ) {
            return false;
          }
          const maxDpi = extractMaxDpi(s.SpecValue);
          if (maxDpi == null) return false;
          return maxDpi <= dpiLimit;
        }),
      );
    }

    if (resolution) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes('độ phân giải') &&
            s.SpecValue.toLowerCase().includes(resolution.toLowerCase()),
        ),
      );
    }

    if (panelType) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes('tấm nền') &&
            s.SpecValue.toLowerCase().includes(panelType.toLowerCase()),
        ),
      );
    }

    if (keyboardType) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes('loại bàn phím') &&
            s.SpecValue.toLowerCase().includes(keyboardType.toLowerCase()),
        ),
      );
    }

    if (layout) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes('layout') &&
            s.SpecValue.toLowerCase().includes(layout.toLowerCase()),
        ),
      );
    }

    if (psu) {
      result = result.filter((p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes('psu') &&
            s.SpecValue.toLowerCase().includes(psu.toLowerCase()),
        ),
      );
    }

    if (price) {
      const [min, max] = price.split('-').map(Number);
      result = result.filter((p) => {
        const realPrice = p.discountPrice || p.price;
        return realPrice >= min && (max ? realPrice <= max : true);
      });
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
      );
    } else if (sortBy === 'price-desc') {
      result.sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
      );
    }

    const initialCount = 4;
    setFilteredProducts(result);
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
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }) as FilterState);
  };

  return (
    <>
      <Header />
      <main className={styles.searchPage}>
        <ContainerFluid>
          <div className={styles.searchPageResults}>
            <h1 className={styles.title}>KẾT QUẢ TÌM KIẾM</h1>
            <p className={styles.subtitle}>
              Tìm kiếm theo: <strong>{query || '—'}</strong>
            </p>

            {/* Thanh filter + sort (ẩn ô danh mục) */}
            <div className={styles.filterBar}>
              <div className={styles.filterWrap}>
                {visibleFilterConfig.map((f) => (
                  <select
                    key={f.key}
                    name={f.key}
                    value={normalizeFilterValue(filters[f.key] as any)}
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
              {loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className={styles.notFoundProduct}>
                  {query
                    ? 'Không tìm thấy sản phẩm nào.'
                    : 'Không có truy vấn tìm kiếm.'}
                </p>
              )}
            </div>

            {!loading && hasMore && filteredProducts.length > 0 && (
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
