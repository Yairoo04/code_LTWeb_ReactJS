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
  ImageUrl?: string; // Add this to support backend's ImageUrl field
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function formatVND(n?: number) {
  if (typeof n !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

// Parse ImageUrl to get first image
function getFirstImage(imageUrl?: string): string {
  if (!imageUrl) return '/images/placeholder.png';
  
  try {
    // Try parsing as JSON array
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
    return imageUrl;
  } catch {
    // If not JSON, try splitting by comma
    const images = imageUrl.split(',').filter(Boolean);
    return images[0] || imageUrl;
  }
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

  // Support both image_url and ImageUrl fields
  const imageField = product.ImageUrl || product.image_url;
  const firstImage = getFirstImage(imageField);
  
  // Ảnh đã được upload vào frontend public folder, không cần API_BASE
  // Chỉ thêm API_BASE nếu là external URL (bắt đầu bằng http)
  const imgSrc = firstImage.startsWith('http') ? firstImage : firstImage;
  
  // Debug log
  if (!imageField) {
    console.warn('Product missing images:', product.id, product.name);
  }

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
          onError={(e) => {
            // Fallback nếu ảnh lỗi
            e.currentTarget.src = '/images/products/keychron_k2.jpg';
          }}
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