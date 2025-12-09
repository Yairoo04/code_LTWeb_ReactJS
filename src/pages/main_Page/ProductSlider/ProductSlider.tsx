// app/(components)/ProductSlider/ProductSlider.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from '../Product/ProductCard';
import { Product as BackendProduct } from '@/lib/product';
import styles from './ProductSlider.module.scss';
import '../../../styles/globals.scss';
import { useRecentView } from '../RecentViewProducts/RecentViewContext';
import { useRouter } from 'next/navigation';
import ProductCardSkeleton from '@/pages/main_Page/Product/ProductCardSkeleton';

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
  created_at?: string;
  averageRating?: number | null;
  totalReviews?: number | null;
  AverageRating?: number | null;
  TotalReviews?: number | null;
  FlashPrice?: number | null;
};

type ProductSliderProps = {
  products: BackendProduct[];
  showDotActive?: boolean;
  desktopItems?: number;
  className?: string;
  sliderId?: string;
  title?: string;
  isLoading?: boolean;
  skeletonCount?: number;
};

function mapToFrontendProduct(backendProduct: BackendProduct): FrontendProduct {
  const anyProd = backendProduct as any;

  const avgRating =
    typeof anyProd.averageRating === 'number'
      ? anyProd.averageRating
      : typeof anyProd.AverageRating === 'number'
        ? anyProd.AverageRating
        : 0;

  const totReviews =
    typeof anyProd.totalReviews === 'number'
      ? anyProd.totalReviews
      : typeof anyProd.TotalReviews === 'number'
        ? anyProd.TotalReviews
        : 0;

  return {
    id: backendProduct.ProductId,
    name: backendProduct.Name,
    description: backendProduct.Description ?? '',
    price: backendProduct.Price,
    discountPrice: backendProduct.DiscountPrice ?? null,
    categoryId: backendProduct.CategoryId ?? null,
    stock: backendProduct.Stock ?? 0,
    ImageUrl: backendProduct.ImageUrl,
    image_url: backendProduct.ImageUrl,
    created_at: (backendProduct as any).CreatedAt ?? '',
    FlashPrice: anyProd.FlashPrice ?? null,
    averageRating: avgRating,
    totalReviews: totReviews,
    AverageRating: avgRating,
    TotalReviews: totReviews,
  };
}

export default function ProductSlider({
  products,
  showDotActive = true,
  desktopItems = 4,
  className = '',
  sliderId = 'default-slider',
  title,
  isLoading = false,
  skeletonCount,
}: ProductSliderProps) {
  const frontendProducts = products.map(mapToFrontendProduct);
  const productCount = frontendProducts.length;

  const [itemsPerPage, setItemsPerPage] = useState(desktopItems);
  const [currentIndex, setCurrentIndex] = useState(desktopItems); // index trong mảng extended
  const [noTransition, setNoTransition] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // ← chặn spam click

  const { addRecentView } = useRecentView();
  const router = useRouter();

  // Responsive: tính itemsPerPage theo width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newItemsPerPage: number;

      if (width < 769) {
        newItemsPerPage = 1;
      } else if (width < 1025) {
        newItemsPerPage = desktopItems >= 5 ? 3 : 2;
      } else {
        newItemsPerPage = desktopItems;
      }

      if (productCount > 0) {
        newItemsPerPage = Math.min(newItemsPerPage, productCount);
      }

      setItemsPerPage((prev) => {
        const next = newItemsPerPage;
        return next !== prev ? next : prev;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopItems, productCount]);

  // extendedProducts = [last K] + [all] + [first K]
  const extendedProducts = useMemo(() => {
    if (productCount === 0) return [];
    const k = Math.min(itemsPerPage, productCount);
    const lastK = frontendProducts.slice(-k);
    const firstK = frontendProducts.slice(0, k);
    return [...lastK, ...frontendProducts, ...firstK];
  }, [frontendProducts, productCount, itemsPerPage]);

  const effectiveItemsPerPage = Math.min(
    itemsPerPage,
    productCount || itemsPerPage,
  );

  const startIndex = productCount ? effectiveItemsPerPage : 0; // vị trí thật đầu tiên
  const endIndex = productCount ? startIndex + productCount - 1 : 0;

  // reset currentIndex khi số sp hoặc itemsPerPage đổi
  useEffect(() => {
    if (!productCount) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(startIndex);
  }, [productCount, startIndex]);

  // Tiến 1 sản phẩm (dùng cho auto + nút Next)
  const advance = useCallback(() => {
    if (!productCount || productCount <= effectiveItemsPerPage) return;
    if (isAnimating) return; // đang animate thì bỏ
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  }, [productCount, effectiveItemsPerPage, isAnimating]);

  const handleNext = () => {
    advance();
  };

  const handlePrev = () => {
    if (!productCount || productCount <= effectiveItemsPerPage) return;
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleProductClick = (productId: number) => {
    addRecentView(productId);
    router.push(`/products/${productId}`);
  };

  // Auto slide 3s/lần, luôn đi tới
  useEffect(() => {
    if (!productCount || productCount <= effectiveItemsPerPage || isLoading) {
      return;
    }

    const interval = setInterval(() => {
      advance();
    }, 3000);

    return () => clearInterval(interval);
  }, [productCount, effectiveItemsPerPage, isLoading, advance]);

  // Khi transition kết thúc: nếu index nằm ngoài vùng thật → warp về
  const handleTransitionEnd = () => {
    if (!productCount || productCount <= effectiveItemsPerPage) {
      setIsAnimating(false);
      return;
    }

    // nằm ngoài [startIndex, endIndex] → đang ở vùng clone
    if (currentIndex < startIndex || currentIndex > endIndex) {
      setNoTransition(true);

      const rawOffset = currentIndex - startIndex;
      const mod =
        ((rawOffset % productCount) + productCount) % productCount;

      setCurrentIndex(startIndex + mod);
    }

    setIsAnimating(false);
  };

  // Bật lại transition sau khi warp nội bộ
  useEffect(() => {
    if (!noTransition) return;
    const t = setTimeout(() => setNoTransition(false), 20);
    return () => clearTimeout(t);
  }, [noTransition]);

  if (!productCount && !isLoading) {
    return (
      <div
        className={`${styles['product-slider__no-products']} ${className}`}
      >
        No products available
      </div>
    );
  }

  const cardFlexBasis = `calc(
    (100% - 20px - ${(effectiveItemsPerPage - 1) * 10}px) / ${effectiveItemsPerPage}
  )`;

  const translatePercent =
    effectiveItemsPerPage > 0
      ? (currentIndex * 100) / effectiveItemsPerPage
      : 0;

  const skeletonItems = skeletonCount ?? effectiveItemsPerPage * 2;

  const totalSlides =
    productCount && effectiveItemsPerPage
      ? Math.ceil(productCount / effectiveItemsPerPage)
      : 0;

  const activeDotIndex =
    productCount && effectiveItemsPerPage
      ? Math.floor(
          (((currentIndex - startIndex + productCount) % productCount) ||
            0) / effectiveItemsPerPage,
        )
      : 0;

  const handleDotClick = (index: number) => {
    if (!productCount || productCount <= effectiveItemsPerPage) return;
    if (isAnimating) return;
    const targetIndex = startIndex + index * effectiveItemsPerPage;
    setIsAnimating(true);
    setCurrentIndex(targetIndex);
  };

  const listToRender = extendedProducts.length
    ? extendedProducts
    : frontendProducts;

  return (
    <div className={`${styles['product-slider']} ${className}`} id={sliderId}>
      {title && <h2 className={styles['product-slider__title']}>{title}</h2>}

      <button
        className={styles['product-slider__prev']}
        onClick={handlePrev}
        aria-label="Previous slide"
        disabled={totalSlides <= 1 || isLoading || isAnimating}
      >
        &#10094;
      </button>

      <div
        className={styles['product-slider__list']}
        style={{
          transform: `translateX(-${translatePercent}%)`,
          transition: noTransition ? 'none' : 'transform 0.5s ease-in-out',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {isLoading
          ? Array.from({ length: skeletonItems }).map((_, idx) => (
              <div
                className={styles['product-slider__card']}
                key={`skeleton-${idx}`}
                style={{ flex: `0 0 ${cardFlexBasis}` }}
              >
                <ProductCardSkeleton />
              </div>
            ))
          : listToRender.map((product, idx) => (
              <div
                className={styles['product-slider__card']}
                key={`${product.id}-${idx}`}
                onClick={() => handleProductClick(product.id)}
                style={{ flex: `0 0 ${cardFlexBasis}` }}
              >
                <ProductCard product={product as any} />
              </div>
            ))}
      </div>

      <button
        className={styles['product-slider__next']}
        onClick={handleNext}
        aria-label="Next slide"
        disabled={totalSlides <= 1 || isLoading || isAnimating}
      >
        &#10095;
      </button>

      {showDotActive && totalSlides > 1 && !isLoading && (
        <div
          className={styles['product-slider__dots']}
          aria-label="Slide navigation"
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`${styles['product-slider__dot']} ${
                index === activeDotIndex
                  ? styles['product-slider__dot--active']
                  : ''
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeDotIndex}
            >
              <span className={styles['sr-only']}>Slide {index + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
