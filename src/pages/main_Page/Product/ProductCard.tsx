import React from 'react';

type FrontendProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string | null;
  stock?: number;
  image_url?: string;
  created_at?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function formatVND(n?: number) {
  if (typeof n !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

export default function ProductCard({ product }: { product?: FrontendProduct }) {
  if (!product) {
    return (
      <div className="product-card empty">
        <p>No product data</p>
      </div>
    );
  }

  const imgSrc = product.image_url
    ? `${API_BASE}${product.image_url}`
    : '/images/placeholder.png';

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
        <div className="new-price">{formatVND(product.price)}</div>
        <div className={`stock ${inStock ? 'in' : 'out'}`}>
          {inStock ? 'Còn hàng' : 'Hết hàng'}
        </div>
      </div>
    </div>
  );
}