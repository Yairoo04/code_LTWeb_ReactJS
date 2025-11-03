<<<<<<< HEAD
=======

>>>>>>> db44fea ( cap nhat admin)
// app/(components)/FlashSale.tsx
'use client';

import { api } from '@/lib/api';
import { Product } from '@/lib/product';
import ProductSlider from '../ProductSlider/ProductSlider';
import ContainerFluid from '../ContainerFluid/container-fluid';
<<<<<<< HEAD
=======

>>>>>>> db44fea ( cap nhat admin)
import '../../../styles/globals.scss';
import './FlashSale.module.scss';
import React from 'react';
import { useRecentView } from '../RecentViewProducts/RecentViewContext';
<<<<<<< HEAD

=======
>>>>>>> db44fea ( cap nhat admin)

type FlashSaleProps = {
  className?: string;
  h2Title?: string;
  showImg_Sale?: boolean;
  showTitle?: boolean;
  showReadMore?: boolean;
  showDotActive?: boolean;
  limit?: number;
};

export default function FlashSale({
  className = 'flash-sale',
  h2Title = 'Flash Sale',
  showImg_Sale = true,
  showTitle = true,
  showReadMore = true,
  showDotActive = true,
  limit = 12,
}: FlashSaleProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
<<<<<<< HEAD
  const { addRecentView } = useRecentView();

=======

  const { addRecentView } = useRecentView();
>>>>>>> db44fea ( cap nhat admin)

  React.useEffect(() => {
    async function getFlashProducts() {
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
          Name: item.Name ?? 'N/A',
          Description: item.Description ?? 'N/A',
          Price: item.Price ?? 0,

<<<<<<< HEAD
          Category: item.Category ?? '',
=======
>>>>>>> db44fea ( cap nhat admin)
          Stock: item.Stock ?? 0,
          ImageUrl: item.ImageUrl ?? '',
          CreatedAt: item.CreatedAt ?? new Date().toISOString(),
          DiscountPrice: item.DiscountPrice ?? null,
          CategoryId: item.CategoryId ?? null,
          SKU: item.SKU ?? '',
          IsPublished: item.IsPublished ?? true,
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

    getFlashProducts().then(setProducts);
  }, [limit]);

  return (
    <ContainerFluid>
      <section className={className}>
        <div className="flash-sale-header">
          <div className="countdown">
            <span id="hours">00</span>:<span id="minutes">00</span>:<span id="seconds">00</span>
          </div>
          <h2>{h2Title}</h2>
        </div>

        <div className="flash-sale-content">
          {showImg_Sale && (
            <div className="flash-sale-2-content-img">
              <img
                src="/images/flash-sale/gtn-gamming-gear.png"
                alt="Gear Arena Week"
                loading="lazy"
              />
            </div>
          )}

          {showTitle && (
            <div className="flash-sale-title">
              <span className="sale-title">Flash sale</span>
            </div>
          )}
          <ProductSlider products={products} showDotActive={showDotActive} />

          {showReadMore && (
            <div className="more-promotion">
              <a href="#">Xem thêm khuyến mãi</a>
            </div>
          )}
        </div>
      </section>
    </ContainerFluid>
  );
}