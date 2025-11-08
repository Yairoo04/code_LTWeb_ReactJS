// app/(components)/RecentView/RecentViewProductSlider.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Thêm useEffect để log khi mount
import RecentViewProductCard from './recentViewProductCard';
import { RecentViewProduct } from '@/lib/recent-view-product';
import styles from './RecentViewProductSlider.module.scss';
import { useRecentView } from './RecentViewContext'; // Import context
import { useRouter } from 'next/navigation'; // Import router

type Props = {
  products: RecentViewProduct[];
  itemsPerPage?: number;
  className?: string;
  title?: string;
};

export default function RecentViewProductSlider({
  products,
  itemsPerPage = 4,
  className = '',
  title = 'Sản phẩm đã xem',
}: Props) {
  const totalSlides = Math.ceil(products.length / itemsPerPage);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addRecentView } = useRecentView(); // Lấy addRecentView từ context
  const router = useRouter(); // Router để navigate

  // Log khi component mount hoặc products thay đổi
  useEffect(() => {
    console.log('[RecentViewProductSlider] Component mounted or products changed:', {
      productsLength: products.length,
      totalSlides,
      currentSlide,
    });
  }, [products, totalSlides, currentSlide]);

  const goToSlide = (index: number) => {
    console.log('[RecentViewProductSlider] Going to slide:', index);
    setCurrentSlide(index);
  };

  const prev = () => {
    const newSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    console.log('[RecentViewProductSlider] Previous slide:', newSlide);
    setCurrentSlide(newSlide);
  };

  const next = () => {
    const newSlide = (currentSlide + 1) % totalSlides;
    console.log('[RecentViewProductSlider] Next slide:', newSlide);
    setCurrentSlide(newSlide);
  };

  // Handle click: add/update recent view và navigate đến detail
  const handleProductClick = (productId: number) => {
    console.log('[RecentViewProductSlider] Product clicked, starting addRecentView:', productId);
    addRecentView(productId) // Thêm mới nếu chưa có, update nếu có
      .then(() => {
        console.log('[RecentViewProductSlider] addRecentView completed successfully for productId:', productId);
        router.push(`/products/${productId}`);
      })
      .catch((err) => {
        console.error('[RecentViewProductSlider] Error in addRecentView:', err);
      });
  };

  if (products.length === 0) {
    console.log('[RecentViewProductSlider] No products available');
    return (
      <div className={`${styles.slider} ${className}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.empty}>Chưa có sản phẩm nào được xem</p>
      </div>
    );
  }

  console.log('[RecentViewProductSlider] Rendering slider with products:', products.length);

  return (
    <div className={`${styles.slider} ${className}`}>
      <h2 className={styles.title}>{title}</h2>

      {currentSlide > 0 && (
        <button
          className={styles.prev}
          onClick={prev}
          aria-label="Previous slide"
        >
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
            className={styles.item}
            key={product.Id}
            style={{ flex: `0 0 ${100 / itemsPerPage}%` }}
            onClick={() => handleProductClick(product.ProductId)} // Thêm onClick ở đây
          >
            <RecentViewProductCard product={product} />
          </div>
        ))}
      </div>

      {currentSlide < totalSlides - 1 && (
        <button
          className={styles.next}
          onClick={next}
          aria-label="Next slide"
        >
          &#10095;
        </button>
      )}

      {totalSlides > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}