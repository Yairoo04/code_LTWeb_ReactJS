// app/tim-kiem/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './SearchPage.module.scss'; // Assume you create this SCSS file
import '@/styles/globals.scss'; // Assume you create this SCSS file
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import ProductCard from '@/pages/main_Page/Product/ProductCard'; // Adjust path as needed
import FlashSale from '@/pages/main_Page/FlashSale/FlashSale';

// Assume a Product type from backend
type BackendProduct = {
  ProductId: number;
  Name: string;
  Description: string;
  Price: number;
  DiscountPrice?: number | null;
  ImageUrl: string;
  Stock?: number;
  // Add more fields as needed
};

// FrontendProduct type from ProductCard
type FrontendProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  category?: string | null;
  stock?: number;
  image_url?: string;
  created_at?: string;
};

// Function to map BackendProduct to FrontendProduct
const mapToFrontendProduct = (product: BackendProduct): FrontendProduct => ({
  id: product.ProductId,
  name: product.Name,
  description: product.Description,
  price: product.Price,
  discountPrice: product.DiscountPrice ?? null,
  image_url: product.ImageUrl,
  stock: product.Stock ?? 0,
  // category and created_at can be added if available
});

// Function to fetch search results
async function fetchSearchResults(query: string) {
  if (!query) {
    return [];
  }
  const res = await fetch(`http://localhost:4000/api/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch search results');
  }
  const { data } = await res.json();
  return data || [];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!query) {
    return <p>Không có truy vấn tìm kiếm.</p>;
  }

  const hasMore = visibleCount < products.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <>
      <Header />
      <main className={styles.searchPage}>
        <ContainerFluid>
          <div className={styles.searchPageResults}>
            <h1 className={styles.title}>TÌM KIẾM</h1>
            <p className={styles.subtitle}>Tìm kiếm theo <strong>{query}</strong>.</p>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
              <select className={styles.filterSelect}>
                <option>Bộ lọc</option>
                {/* Add options */}
              </select>
              <select className={styles.filterSelect}>
                <option>Giá</option>
                {/* Add price ranges */}
              </select>
              <select className={styles.filterSelect}>
                <option>Hãng</option>
                {/* Add brands */}
              </select>
              <select className={styles.filterSelect}>
                <option>CPU</option>
                {/* Add CPU options */}
              </select>
              <select className={styles.filterSelect}>
                <option>Kích thước màn hình</option>
                {/* Add screen sizes */}
              </select>
              <select className={styles.filterSelect}>
                <option>Nhu cầu sử dụng</option>
                {/* Add usage types */}
              </select>
              <select className={styles.filterSelect}>
                <option>RAM</option>
                {/* Add RAM options */}
              </select>
              <select className={styles.filterSelect}>
                <option>SSD</option>
                {/* Add SSD options */}
              </select>
              <select className={styles.filterSelect}>
                <option>VGA</option>
                {/* Add VGA options */}
              </select>
            </div>

            {/* Product Grid */}
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

            {/* Pagination - Placeholder, implement if needed */}
            {/* <div className={styles.pagination}>...</div> */}
          </div>
        </ContainerFluid>

        <FlashSale className="flash-sale-search" h2Title="⚡ FLASH SALE 10H MỖI NGÀY" showImg_Sale={false} showDotActive={false} />
      </main>

      <Footer />
    </>
  );
}