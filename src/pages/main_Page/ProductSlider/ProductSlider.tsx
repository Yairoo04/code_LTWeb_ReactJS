// app/(components)/ProductSlider/ProductSlider.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../Product/ProductCard';
import { Product as BackendProduct } from '@/lib/product';
import styles from './ProductSlider.module.scss';
import '../../../styles/globals.scss';
import { useRecentView } from '../RecentViewProducts/RecentViewContext';
import { useRouter } from 'next/navigation';

type FrontendProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  category: string | null;
  stock: number;
  image_url: string;
  created_at: string;
};

type ProductSliderProps = {
  products: BackendProduct[];
  showDotActive?: boolean;
  desktopItems?: number; // Số sản phẩm hiển thị trên desktop (tùy chỉnh, default 4)
  className?: string;
  sliderId?: string;
  title?: string;
};

function mapToFrontendProduct(backendProduct: BackendProduct): FrontendProduct {
  return {
    id: backendProduct.ProductId,
    name: backendProduct.Name,
    description: backendProduct.Description,
    price: backendProduct.Price,
    discountPrice: backendProduct.DiscountPrice,
    category: backendProduct.CategoryId?.toString() || null,
    stock: backendProduct.Stock,
    image_url: backendProduct.ImageUrl,
    created_at: backendProduct.CreatedAt,
  };
}

export default function ProductSlider({
  products,
  showDotActive = true,
  desktopItems = 4, // Default 4 sản phẩm trên desktop
  className = '',
  sliderId = 'default-slider',
  title,
}: ProductSliderProps) {
  const frontendProducts = products.map(mapToFrontendProduct);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(desktopItems); // Khởi tạo với desktopItems
  const { addRecentView } = useRecentView();
  const router = useRouter();

  // Responsive itemsPerPage sync với SCSS media queries, nhưng điều chỉnh dựa trên desktopItems
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newItemsPerPage: number;

      if (width < 769) {
        newItemsPerPage = 1; // Mobile luôn 1
      } else if (width < 1025) {
        // Tablet: điều chỉnh dựa trên desktopItems (ví dụ: khoảng nửa nếu lớn)
        newItemsPerPage = desktopItems >= 5 ? 3 : 2;
      } else {
        newItemsPerPage = desktopItems; // Desktop sử dụng giá trị tùy chỉnh
      }

      setItemsPerPage(newItemsPerPage);

      // Điều chỉnh currentSlide nếu vượt quá totalSlides mới
      const newTotalSlides = Math.ceil(frontendProducts.length / newItemsPerPage);
      if (currentSlide >= newTotalSlides) {
        setCurrentSlide(0);
      }
    };

    handleResize(); // Khởi tạo ban đầu
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frontendProducts.length, currentSlide, desktopItems]);

  const totalSlides = Math.ceil(frontendProducts.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleProductClick = (productId: number) => {
    addRecentView(productId);
    router.push(`/products/${productId}`);
  };

  if (!frontendProducts.length) {
    return <div className={`${styles['product-slider__no-products']} ${className}`}>No products available</div>;
  }

  // Tính toán width cho mỗi card (để hỗ trợ dynamic itemsPerPage)
  const cardFlexBasis = `calc((100% - 20px - ${(itemsPerPage - 1) * 10}px) / ${itemsPerPage})`;

  return (
    <div className={`${styles['product-slider']} ${className}`} id={sliderId}>
      {title && <h2 className={styles['product-slider__title']}>{title}</h2>}
      <button
        className={styles['product-slider__prev']}
        onClick={handlePrev}
        aria-label="Previous slide"
        disabled={totalSlides <= 1}
      >
        &#10094;
      </button>
      <div
        className={styles['product-slider__list']}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {frontendProducts.map((product) => (
          <div
            className={styles['product-slider__card']}
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            style={{ flex: `0 0 ${cardFlexBasis}` }} // Áp dụng dynamic width
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <button
        className={styles['product-slider__next']}
        onClick={handleNext}
        aria-label="Next slide"
        disabled={totalSlides <= 1}
      >
        &#10095;
      </button>
      {showDotActive && totalSlides > 1 && (
        <div className={styles['product-slider__dots']} aria-label="Slide navigation">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`${styles['product-slider__dot']} ${index === currentSlide ? styles['product-slider__dot--active'] : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            >
              <span className={styles['sr-only']}>Slide {index + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}