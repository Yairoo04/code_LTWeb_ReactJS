'use client';

import React from 'react';
import Link from 'next/link'; // Import Next.js Link
import styles from './ProductCard.module.scss'; // Import mới
import '../../../styles/globals.scss';

type FrontendProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  categoryId?: number | null; // Sync with collection
  stock?: number;
  image_url?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function formatVND(n?: number) {
  if (typeof n !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

async function addToRecentView(userId: number, productId: number) {
  try {
    const res = await fetch(`${API_BASE}/api/recentviewProducts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId }),
    });

    if (!res.ok) {
      console.error('Failed to add recent view:', res.status);
    }
  } catch (error) {
    console.error('Error adding recent view:', error);
  }
}

export default function ProductCard({ product }: { product?: FrontendProduct }) {
  if (!product) {
    return (
      <div className={styles.empty}>
        <p>No product data</p>
      </div>
    );
  }

  const imgSrc = product.image_url
    ? `${API_BASE}${product.image_url}`
    : '/images/placeholder.png';

  const inStock = (product.stock ?? 0) > 0;

  const discountPrice = product.discountPrice ?? null;
  const hasDiscount = discountPrice !== null && discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - discountPrice) / product.price) * 100) : 0;

  const handleClick = async () => {
    // Hardcode userId = 1 as per your example (consider making dynamic)
    await addToRecentView(1, product.id);
  };

  return (
    <Link href={`/products/${product.id}`} onClick={handleClick}>
      <div className={styles['product-card']}> {/* Dùng styles['product-card'] */}
        <img
          src={imgSrc}
          alt={product.name || 'Unnamed product'}
          loading="lazy"
        />
        <div className={styles.info}> {/* Nếu cần, thêm styles.info */}
          <div
            className={styles['product-name']}
            title={product.name || 'Unknown'}
          >
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
          <div className={styles['product-rating']}>0.0 ★ (0 đánh giá)</div>
          <div className={`${styles['product-stock']} ${inStock ? styles.in : styles.out}`}>
            {inStock ? 'Còn hàng' : 'Hết hàng'}
          </div>
        </div>
      </div>
    </Link>
  );
}