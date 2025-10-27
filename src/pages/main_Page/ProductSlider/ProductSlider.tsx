'use client';

import React, { useState } from 'react';
import ProductCard from '../Product/ProductCard';
import { Product as BackendProduct } from '@/lib/product';
import styles from './ProductSlider.module.scss';

type FrontendProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string | null;
  stock: number;
  image_url: string;
  created_at: string;
};

type ProductSliderProps = {
  products: BackendProduct[];
  showDotActive?: boolean;
  itemsPerPage?: number; // Allow customization of items per page
  className?: string; // Allow custom class for unique styling
  sliderId?: string; // Unique ID to avoid DOM conflicts
  title?: string; // Optional title like "Sản phẩm đã xem"
};

function mapToFrontendProduct(backendProduct: BackendProduct): FrontendProduct {
  return {
    id: backendProduct.ProductId,
    name: backendProduct.Name,
    description: backendProduct.Description,
    price: backendProduct.Price,
    category: backendProduct.CategoryId?.toString() || null,
    stock: backendProduct.Stock,
    image_url: backendProduct.ImageUrl,
    created_at: backendProduct.CreatedAt,
  };
}

export default function ProductSlider({
  products,
  showDotActive = true,
  itemsPerPage = 2, // Default to 2 to match the image
  className = '',
  sliderId = 'default-slider',
  title,
}: ProductSliderProps) {
  const frontendProducts = products.map(mapToFrontendProduct);
  const totalSlides = Math.ceil(frontendProducts.length / itemsPerPage);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  if (!frontendProducts.length) {
    return <div className={`${styles['product-slider__no-products']} ${className}`}>No products available</div>;
  }

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
          transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {frontendProducts.map((product) => (
          <div
            className={styles['product-slider__card']}
            key={product.id}
            // style={{ flex: `0 0 calc(${100 / itemsPerPage}%)` }}
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