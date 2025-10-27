'use client';

import React from 'react';
import { Product } from '@/lib/product';
import ProductSlider from '../ProductSlider/ProductSlider';
import ContainerFluid from '../ContainerFluid/container-fluid';
import styles from './RecentView.module.scss';
import '../../../styles/globals.scss';

export default function RecentView() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const limit = 10;

  React.useEffect(() => {
    async function getRecentProducts() {
      try {
        const res = await fetch('/api/products', {
          cache: 'no-store',
        });

        if (!res.ok) {
          console.error('Fetch /api/products failed:', res.status);
          return [];
        }
        const json = await res.json() as { success: boolean; data: any[] };
        if (!json?.success || !Array.isArray(json.data)) return [];

        const mapped = json.data.map(item => ({
          ProductId: item.ProductId ?? 0,
          Name: item.Name ?? '',
          Description: item.Description ?? '',
          Price: item.Price ?? 0,
          DiscountPrice: item.DiscountPrice ?? null,
          CategoryId: item.CategoryId ?? 0,
          SKU: item.SKU ?? '',
          Stock: item.Stock ?? 0,
          ImageUrl: item.ImageUrl ?? '',
          IsPublished: item.IsPublished ?? true,
          CreatedAt: item.CreatedAt ?? new Date().toISOString(),
          UpdatedAt: item.UpdatedAt ?? null,
        })) as Product[];

        return mapped
          .sort((a, b) => +new Date(b.CreatedAt) - +new Date(a.CreatedAt))
          .slice(0, limit);
      } catch (error) {
        console.error('Lỗi fetch products:', error);
        return [];
      }
    }

    getRecentProducts().then(setProducts);
  }, []);

  return (
    <ContainerFluid>
      <section className={'recent-view'}>
        <h2>Sản phẩm đã xem</h2>
        {products.length === 0 && <div className="py-8">Đang tải…</div>}
        <ProductSlider products={products} showDotActive={false} />
      </section>
    </ContainerFluid>
  );
}