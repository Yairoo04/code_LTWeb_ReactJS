'use client';

import React, { useState, useEffect, useCallback } from 'react';
import RecentViewProductCard from './recentViewProductCard';
import { RecentViewProduct } from '@/lib/recent-view-product';
import styles from './RecentViewProductSlider.module.scss';
import { useRecentView } from './RecentViewContext';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';

type Props = {
  products?: RecentViewProduct[]; // CHO PHÉP NULL ĐỂ LOAD TỪ API
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
  const totalSlides = Math.ceil(products.length / itemsPerPage);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addRecentView } = useRecentView();
  const router = useRouter();

  // === LẤY userId ===
  const { userId } = getAuth();

  // === LOAD SẢN PHẨM TỪ API ===
  useEffect(() => {
    if (initialProducts || !userId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('[RecentViewProductSlider] Gọi API với userId:', userId);
        const res = await fetch(`/api/recentviewProducts?userId=${userId}&limit=20`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
          console.log('[RecentViewProductSlider] Load thành công:', data.data.length, 'sản phẩm');
        } else {
          console.warn('[RecentViewProductSlider] API lỗi:', data.error);
          setProducts([]);
        }
      } catch (err) {
        console.error('[RecentViewProductSlider] Lỗi fetch:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId, initialProducts]);

  // === XỬ LÝ CLICK ===
  const handleProductClick = async (productId: number) => {
    console.log('[Slider] Click productId:', productId);
    try {
      await addRecentView(productId); // SẼ DÙNG userId ĐÚNG
      router.push(`/products/${productId}`);
    } catch (err) {
      router.push(`/products/${productId}`);
    }
  };

  // === LOADING ===
  if (loading) {
    return (
      <div className={`${styles.slider} ${className}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.empty}>Đang tải...</p>
      </div>
    );
  }

  // === KHÔNG CÓ SẢN PHẨM ===
  if (products.length === 0) {
    return (
      <div className={`${styles.slider} ${className}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.empty}>Chưa có sản phẩm nào được xem</p>
      </div>
    );
  }

  // === HIỂN THỊ SLIDER ===
  return (
    <div className={`${styles.slider} ${className}`}>
      <h2 className={styles.title}>{title}</h2>

      {currentSlide > 0 && (
        <button className={styles.prev} onClick={() => setCurrentSlide(p => p - 1)}>
          &#10094;
        </button>
      )}

      <div
        className={styles.list}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {products.map((product) => (
          <div
            key={product.ProductId}
            className={styles.item}
            style={{ flex: `0 0 ${100 / itemsPerPage}%` }}
            onClick={() => handleProductClick(product.ProductId)}
          >
            <RecentViewProductCard product={product} />
          </div>
        ))}
      </div>

      {currentSlide < totalSlides - 1 && (
        <button className={styles.next} onClick={() => setCurrentSlide(p => p + 1)}>
          &#10095;
        </button>
      )}

      {totalSlides > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentSlide ? styles.active : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}