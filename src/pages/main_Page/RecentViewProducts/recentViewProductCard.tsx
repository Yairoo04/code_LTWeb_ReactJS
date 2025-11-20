// app/(components)/RecentView/recentViewProductCard.tsx
'use client';

import React from 'react';
import { RecentViewProduct } from '@/lib/recent-view-product';

function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

function calculateDiscountPercent(price: number, discountPrice: number): string {
  if (price <= 0 || discountPrice >= price) return '';
  const percent = ((price - discountPrice) / price) * 100;
  const rounded = Math.round(percent);
  return `-${rounded}%`;
}

function getFirstImage(imageUrl?: string | null): string {
  if (!imageUrl) return '/images/placeholder.png';
  
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
    return imageUrl;
  } catch {
    const images = imageUrl.split(',').filter(Boolean);
    return images[0] || imageUrl;
  }
}

export default function RecentViewProductCard({ product }: { product: RecentViewProduct }) {
  const imgSrc = getFirstImage(product.ImageUrl);

  // CHỈ SỬA ĐOẠN NÀY – GIẢI QUYẾT HOÀN TOÀN LỖI TS + HIỂN THỊ GIÁ ĐÚNG
  const priceData = product as any;
  const originalPrice = priceData.OriginalPrice ?? product.Price;
  const discountPrice = product.DiscountPrice;
  const displayPrice = priceData.DisplayPrice ?? 
    (discountPrice !== null && discountPrice < originalPrice ? discountPrice : originalPrice);
  const hasDiscount = discountPrice !== null && discountPrice < originalPrice;
  const discountPercent = hasDiscount 
    ? calculateDiscountPercent(originalPrice, discountPrice!)
    : '';

  const displayedName = product.Name.length > 30 ? product.Name.slice(0, 30) + '...' : product.Name;

  return (
    <div className="recentViewProductCard">
      <img 
        src={imgSrc} 
        alt={product.Name} 
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/images/placeholder.png';
        }}
      />
      <div className="text">
        <div className="recentViewProductCard__name" title={product.Name}>
          {displayedName}
        </div>
        <div className="recentViewProductCard__price">
          {hasDiscount && <span className="original">{formatVND(originalPrice)}</span>}
          <div className="recentViewProductCard__discountPrice">
            <span className="current">{formatVND(displayPrice)}</span>
            {hasDiscount && <span className="percent">{discountPercent}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}