'use client';

import React, { useState, useEffect } from 'react';
import RecentViewProductCard from './recentViewProductCard';
import { RecentViewProduct } from '@/lib/recent-view-product';
import styles from './RecentViewProductSlider.module.scss';
import { useRecentView } from './RecentViewContext';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';

type Props = {
  products?: RecentViewProduct[];
  itemsPerPage?: number;
  className?: string;
  title?: string;
};

export default function RecentViewProductSlider({
  products: initialProducts,
  itemsPerPage = 4,
  className = '',
  title = 'Sản phẩm đã xem',
}: Props) {
  const [products, setProducts] = useState<RecentViewProduct[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addRecentView } = useRecentView();
  const router = useRouter();
  const { userId } = getAuth();

  // LẤY DỮ LIỆU TỪ API NẾU KHÔNG CÓ PROPS
  useEffect(() => {
    if (initialProducts || !userId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recentviewProducts?userId=${userId}&limit=20`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('[RecentView] Lỗi tải sản phẩm đã xem:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId, initialProducts]);

  // XỬ LÝ KHI CLICK VÀO SẢN PHẨM
  const handleProductClick = async (productId: number) => {
    try {
      await addRecentView(productId);
    } catch (err) {
      // Vẫn chuyển trang dù lỗi (không ảnh hưởng UX)
    } finally {
      router.push(`/products/${productId}`);
    }
  };

  // TRƯỜNG HỢP ĐANG TẢI
  if (loading) {
    return (
      <div className={`${styles.slider} ${className}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.empty}>Đang tải sản phẩm đã xem...</p>
      </div>
    );
  }

  // LOẠI BỎ SẢN PHẨM TRÙNG PRODUCTID (fix lỗi key trùng 100%)
  const uniqueProducts = products
    .filter((product, index, self) =>
      index === self.findIndex(p => p.ProductId === product.ProductId)
    );

  // TÍNH SỐ TRANG SAU KHI LOẠI TRÙNG
  const totalSlides = Math.ceil(uniqueProducts.length / itemsPerPage);

  // TRƯỜNG HỢP KHÔNG CÓ SẢN PHẨM
  if (uniqueProducts.length === 0) {
    return (
      <div className={`${styles.slider} ${className}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.empty}>Chưa có sản phẩm nào được xem</p>
      </div>
    );
  }

  return (
    <div className={`${styles.slider} ${className}`}>
      <h2 className={styles.title}>{title}</h2>

      {/* NÚT TRÁI */}
      {currentSlide > 0 && (
        <button
          className={styles.prev}
          onClick={() => setCurrentSlide(prev => prev - 1)}
          aria-label="Xem trước"
        >
<<<<<<< HEAD
          <span className={styles.arrowCircle}>‹</span>
=======
          &#10094;
>>>>>>> origin/main
        </button>
      )}

      {/* DANH SÁCH SẢN PHẨM */}
      <div className={styles.wrapper}>
        <div
          className={styles.list}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {uniqueProducts.map((product) => (
            <div
              key={product.ProductId} // ĐÃ ĐẢM BẢO DUY NHẤT
              className={styles.item}
              style={{ flex: `0 0 ${100 / itemsPerPage}%` }}
              onClick={() => handleProductClick(product.ProductId)}
            >
              <RecentViewProductCard product={product} />
            </div>
          ))}
        </div>
      </div>



      {/* NÚT PHẢI */}
      {currentSlide < totalSlides - 1 && (
        <button
          className={styles.next}
          onClick={() => setCurrentSlide(prev => prev + 1)}
          aria-label="Xem tiếp"
        >
<<<<<<< HEAD
          <span className={styles.arrowCircle}>›</span>
=======
          &#10095;
>>>>>>> origin/main
        </button>
      )}

      {/* DOTS CHỈ MẪU */}
      {totalSlides > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentSlide ? styles.active : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Đi đến trang ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}