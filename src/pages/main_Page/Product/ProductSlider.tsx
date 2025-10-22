'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import ProductCard from './ProductCard'; // giữ nguyên nếu file là .jsx

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  created_at: string;
  // Thêm field khác nếu ProductCard cần
};

type ProductSliderProps = {
  products?: Product[];
  showDotActive?: boolean;
};

export default function ProductSlider({
  products = [],
  showDotActive = false,
}: ProductSliderProps) {
  const [productIndex, setProductIndex] = useState<number>(0);
  const visibleProducts = 6;
  const productListRef = useRef<HTMLDivElement | null>(null);

  // Đảm bảo productIndex không vượt quá giới hạn khi danh sách thay đổi
  useLayoutEffect(() => {
    setProductIndex((idx) => {
      const maxStart = Math.max(products.length - visibleProducts, 0);
      return Math.min(idx, maxStart);
    });
  }, [products.length]);

  // Cập nhật transform khi index/size thay đổi
  useLayoutEffect(() => {
    const applyTransform = () => {
      const el = productListRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>('.product-card');
      if (!card) return;

      const cardWidth = card.offsetWidth;
      el.style.transform = `translateX(-${productIndex * cardWidth}px)`;
    };

    applyTransform();
    // cập nhật lại khi resize để tránh lệch
    const onResize = () => applyTransform();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [productIndex, products.length]);

  const handleNext = () => {
    const maxStart = Math.max(products.length - visibleProducts, 0);
    setProductIndex((prev) =>
      prev < maxStart ? Math.min(prev + visibleProducts, maxStart) : 0
    );
  };

  const handlePrev = () => {
    const maxStart = Math.max(products.length - visibleProducts, 0);
    setProductIndex((prev) =>
      prev > 0 ? Math.max(prev - visibleProducts, 0) : maxStart
    );
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="product-slider-empty">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="product-slider">
      <button className="product-slider-prev" onClick={handlePrev} aria-label="Previous">
        ❮
      </button>

      <div className="product-list" ref={productListRef}>
        {products.map((product) => (
          <ProductCard key={product.id ?? product.name} product={product} />
        ))}
      </div>

      <button className="product-slider-next" onClick={handleNext} aria-label="Next">
        ❯
      </button>

      {showDotActive && (
        <div className="flash-sale-content-dots">
          <span className="flash-sale-content-dot active"></span>
          <span className="flash-sale-content-dot"></span>
          <span className="flash-sale-content-dot"></span>
        </div>
      )}
    </div>
  );
}
