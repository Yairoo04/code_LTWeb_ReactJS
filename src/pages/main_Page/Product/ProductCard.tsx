'use client';

import React from 'react';
import styles from './ProductCard.module.scss';
import '../../../styles/globals.scss';
import { useRecentView } from '../RecentViewProducts/RecentViewContext';
import { useRouter } from 'next/navigation';

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
  const discountPrice = product.discountPrice ?? null;
  const hasDiscount = discountPrice !== null && discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - discountPrice) / product.price) * 100) : 0;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await addRecentView(product.id); // CHỜ POST + REFETCH
    } catch (err) {
      console.error('Lỗi addRecentView:', err);
    } finally {
      router.push(`/products/${product.id}`);
    }
  };

  return (
    <div className={styles['product-card']} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img
        src={imgSrc}
        alt={product.name || 'Unnamed product'}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/images/products/keychron_k2.jpg';
        }}
      />
      <div className={styles.info}>
        <div className={styles['product-name']} title={product.name || 'Unknown'}>
          {product.name || 'Unknown'}
        </div>
        <div className={styles['price-section']}>
          {hasDiscount && (
            <span className={styles['original-price']}>{formatVND(product.price)}</span>
          )}
          <div className={styles['discount-container']}>
            <span className={hasDiscount ? styles['discount-price'] : styles['current-price']}>
              {formatVND(hasDiscount ? discountPrice : product.price)}
            </span>
            {hasDiscount && (
              <span className={styles['discount-percent']}> -{discountPercent}%</span>
            )}
          </div>
        </div>
        <div className={styles['product-rating']}>0.0 (0 đánh giá)</div>
        <div className={`${styles['product-stock']} ${inStock ? styles.in : styles.out}`}>
          {inStock ? 'Còn hàng' : 'Hết hàng'}
        </div>
      </div>
    </div>
  );
}