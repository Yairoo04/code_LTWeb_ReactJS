'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './SearchPage.module.scss';
import '@/styles/globals.scss';
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import ProductCard from '@/pages/main_Page/Product/ProductCard';
import FlashSale from '@/pages/main_Page/FlashSale/FlashSale';
import { megaMenuData } from "@/lib/data.js";

// ===============================
//  Kiểu dữ liệu sản phẩm
// ===============================
type BackendProduct = {
  ProductId: number;
  Name: string;
  Description: string;
  Price: number;
  DiscountPrice?: number | null;
  ImageUrl: string;
  Stock?: number;
};

type FrontendProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  category?: string | null;
  stock?: number;
  image_url?: string;
  ImageUrl?: string; // Thêm để support parse nhiều ảnh
  created_at?: string;
};

// ===============================
//  Chuyển đổi dữ liệu backend → frontend
// ===============================
const mapToFrontendProduct = (product: BackendProduct): FrontendProduct => ({
  id: product.ProductId,
  name: product.Name,
  description: product.Description,
  price: product.Price,
  discountPrice: product.DiscountPrice ?? null,
  ImageUrl: product.ImageUrl, // Thêm ImageUrl để ProductCard parse được
  image_url: product.ImageUrl,
  stock: product.Stock ?? 0,
});

// ===============================
//  Fetch API search
// ===============================
async function fetchSearchResults(query: string) {
  if (!query) return [];
  // Sửa endpoint: dùng /api/products với keyword param
  const res = await fetch(`http://localhost:4000/api/products?keyword=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch search results');
  const json = await res.json();
  return json.success ? json.data : [];
}

// ===============================
//  Component chính
// ===============================
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);

  // ===============================
  //  Xác định danh mục tương ứng trong megaMenuData
  // ===============================
  const getCategoryData = () => {
    const lowerQuery = query.toLowerCase();
    return (
      megaMenuData.find((cat) => lowerQuery.includes(cat.title.toLowerCase())) || null
    );
  };

  const categoryData = getCategoryData();

  // ===============================
  //  Hàm xử lý đổi filter (chuyển router)
  // ===============================
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHref = e.target.value;
    if (selectedHref && selectedHref !== '#') router.push(selectedHref);
  };

  // ===============================
  //  Fetch sản phẩm từ API
  // ===============================
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const backendProducts: BackendProduct[] = await fetchSearchResults(query);
        const frontendProducts = backendProducts.map(mapToFrontendProduct);
        setProducts(frontendProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  // ===============================
  //  Loading / Empty states
  // ===============================
  if (loading) return <p>Loading...</p>;
  if (!query) return <p>Không có truy vấn tìm kiếm.</p>;

  const hasMore = visibleCount < products.length;
  const loadMore = () => setVisibleCount((prev) => prev + 4);

  // ===============================
  //  Render giao diện
  // ===============================
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

            {/* Bộ lọc động */}
            {categoryData && (
              <div className={styles.filterBar}>
                {categoryData.subItems.map((subItem, index) => (
                  <select
                    key={index}
                    className={styles.filterSelect}
                    onChange={handleFilterChange}
                  >
                    <option>{subItem.name}</option>
                    {subItem.filters.map((filter, i) => (
                      <option key={i} value={filter.href}>
                        {filter.text}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}

            {/* Grid sản phẩm */}
            <div className={styles.productGrid}>
              {products.length > 0 ? (
                products.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>Không tìm thấy sản phẩm nào.</p>
              )}
            </div>

            {hasMore && products.length > 0 && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreButton} onClick={loadMore}>
                  Xem thêm sản phẩm
                </button>
              </div>
            )}
          </div>
        </ContainerFluid>

        <FlashSale
          className="flash-sale-search"
          h2Title="⚡ FLASH SALE 10H MỖI NGÀY"
          showImg_Sale={false}
          showDotActive={false}
        />
      </main>
      <Footer />
    </>
  );
}
