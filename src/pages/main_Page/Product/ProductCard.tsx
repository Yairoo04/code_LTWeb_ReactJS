// pages/main_Page/Product/ProductCard.tsx
'use client';

import React from 'react';
import styles from './ProductCard.module.scss';
import '../../../styles/globals.scss';
import { useRecentView } from '../RecentViewProducts/RecentViewContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

type FrontendProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  categoryId?: number | null;
  stock?: number;
  image_url?: string;
  ImageUrl?: string;

  // frontend mapping (camelCase)
  averageRating?: number | null;
  totalReviews?: number | null;

  // dữ liệu trả thẳng từ API (PascalCase)
  AverageRating?: number | null;
  TotalReviews?: number | null;

  // có thể còn các field khác (FlashPrice, ...)
  FlashPrice?: number | null;
};

function formatVND(n?: number) {
  if (typeof n !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

function getFirstImage(imageUrl?: string): string {
  if (!imageUrl) return '/images/placeholder.png';
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    return imageUrl;
  } catch {
    const images = imageUrl.split(',').filter(Boolean);
    return images[0] || imageUrl;
  }
}

export default function ProductCard({ product }: { product?: FrontendProduct }) {
  const { addRecentView } = useRecentView();
  const router = useRouter();

  if (!product) {
    return (
      <div className={styles.empty}>
        <p>No product data</p>
      </div>
    );
  }

  const imageField = product.ImageUrl || product.image_url;
  const firstImage = getFirstImage(imageField);
  const imgSrc = firstImage.startsWith('http') ? firstImage : firstImage;

  const inStock = (product.stock ?? 0) > 0;

  const flashPrice = product.FlashPrice ?? null;
  const hasFlashSale =
    flashPrice !== null &&
    typeof flashPrice === 'number' &&
    flashPrice < product.price;

  const displayPrice = hasFlashSale ? flashPrice : product.discountPrice ?? null;
  const hasDiscount =
    hasFlashSale ||
    (displayPrice !== null && displayPrice < product.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price -
          (hasFlashSale
            ? flashPrice
            : product.discountPrice ?? product.price)) /
          product.price) *
          100,
      )
    : 0;

  // ===== Rating: đọc cả camelCase và PascalCase =====
  const rawAverageRating =
    typeof product.averageRating === 'number'
      ? product.averageRating
      : typeof product.AverageRating === 'number'
        ? product.AverageRating
        : 0;

  const rawTotalReviews =
    typeof product.totalReviews === 'number'
      ? product.totalReviews
      : typeof product.TotalReviews === 'number'
        ? product.TotalReviews
        : 0;

  const averageRating = Number.isFinite(rawAverageRating)
    ? rawAverageRating
    : 0;
  const totalReviews = rawTotalReviews >= 0 ? rawTotalReviews : 0;

  const filledStars = Math.max(
    0,
    Math.min(5, Math.round(averageRating || 0)),
  );

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await addRecentView(product.id);
    } catch (err) {
      console.error('Lỗi addRecentView:', err);
    } finally {
      router.push(`/products/${product.id}`);
    }
  };


  return (
    <div
      className={styles['product-card']}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={imgSrc}
        alt={product.name || 'Unnamed product'}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/images/products/keychron_k2.jpg';
        }}
      />
      <div className={styles.info}>
        <div
          className={styles['product-name']}
          title={product.name || 'Unknown'}
        >
          {product.name || 'Unknown'}
        </div>

        <div className={styles['price-section']}>
          {hasDiscount && (
            <span className={styles['original-price']}>
              {formatVND(product.price)}
            </span>
          )}
          <div className={styles['discount-container']}>
            <span
              className={
                hasDiscount
                  ? styles['discount-price']
                  : styles['current-price']
              }
            >
              {formatVND(
                hasDiscount
                  ? hasFlashSale
                    ? flashPrice
                    : product.discountPrice ?? product.price
                  : product.price,
              )}
            </span>
            {hasDiscount && (
              <span className={styles['discount-percent']}>
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        <div className={styles['product-rating']}>
          <span className={styles['rating-stars']}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={star <= filledStars ? faStarSolid : faStarRegular}
              />
            ))}
          </span>
          <span className={styles['rating-text']}>
            {averageRating.toFixed(1)} ({totalReviews} đánh giá)
          </span>
        </div>

        <div
          className={`${styles['product-stock']} ${
            inStock ? styles.in : styles.out
          }`}
        >
          {inStock ? 'Còn hàng' : 'Hết hàng'}
        </div>
      </div>
    </div>
  );
}
