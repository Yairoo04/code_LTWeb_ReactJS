// src/app/(components)/RecentView/ProductCard.tsx
import React from 'react';

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  image_url?: string;
  created_at?: string;
  // nếu sau này backend có thêm oldPrice/status thì thêm ở đây
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function formatVND(n?: number) {
  if (typeof n !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

export default function ProductCard({ product }: { product?: Product }) {
  if (!product) {
    return (
      <div className="product-card empty">
        <p>No product data</p>
      </div>
    );
  }

  const imgSrc = product.image_url
    ? `${API_BASE}${product.image_url}` // ảnh từ backend
    : '/images/placeholder.png';        // ảnh tĩnh của FE: public/image/placeholder.png

  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="product-card">
      <img
        src={imgSrc}
        alt={product.name || 'Unnamed product'}
        loading="lazy"
      />
      <div className="info">
        <div className="name">{product.name || 'Unknown'}</div>

        {/* Giá hiện có từ backend */}
        <div className="new-price">{formatVND(product.price)}</div>

        {/* Nếu backend có oldPrice/status thì render bổ sung:
        <div className="old-price">{formatVND(product.oldPrice)}</div>
        <div className="status">{product.status}</div>
        */}

        {/* Badge tồn kho (tùy style CSS của bạn) */}
        <div className={`stock ${inStock ? 'in' : 'out'}`}>
          {inStock ? 'Còn hàng' : 'Hết hàng'}
        </div>
      </div>
    </div>
  );
}
