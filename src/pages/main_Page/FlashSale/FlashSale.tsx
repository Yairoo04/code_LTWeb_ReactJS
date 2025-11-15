// app/(components)/FlashSale.tsx
'use client';

import { Product } from '@/lib/product';
import ProductSlider from '../ProductSlider/ProductSlider';
import ContainerFluid from '../ContainerFluid/container-fluid';
import './FlashSale.module.scss';
import '../../../styles/globals.scss';
import React from 'react';
import { useRecentView } from '../RecentViewProducts/RecentViewContext';

type FlashSaleProps = {
  className?: string;
  h2Title?: string;
  showImg_Sale?: boolean;
  showTitle?: boolean;
  showReadMore?: boolean;
  showDotActive?: boolean;
  limit?: number;

  // Mã campaign để biết block này đang hiển thị flash sale nào
  campaignCode: string;
};

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export default function FlashSale({
  className = 'flash-sale',
  h2Title = 'Flash Sale',
  showImg_Sale = true,
  showTitle = true,
  showReadMore = true,
  showDotActive = true,
  limit = 12,
  campaignCode,
}: FlashSaleProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [campaign, setCampaign] = React.useState<any | null>(null);
  const [countdown, setCountdown] = React.useState<Countdown>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const { addRecentView } = useRecentView(); // nếu sau này muốn log sản phẩm đã xem

  // ==========================
  // 1. Fetch danh sách sản phẩm theo campaignCode
  // ==========================
  React.useEffect(() => {
    async function getFlashProducts() {
      try {
        const res = await fetch(`/api/flash-sale/${campaignCode}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          console.error('Fetch /api/flash-sale failed:', res.status);
          setProducts([]);
          setCampaign(null);
          return;
        }

        const json = (await res.json()) as {
          success: boolean;
          campaign: any;
          products: any[];
        };

        if (!json?.success) {
          setProducts([]);
          setCampaign(null);
          return;
        }

        setCampaign(json.campaign);

        const mapped = json.products.map((item) => ({
          ProductId: item.ProductId ?? 0,
          Name: item.Name ?? 'N/A',
          Description: item.Description ?? 'N/A',
          Price: Number(item.Price ?? 0),

          // Ưu tiên FlashPrice nếu backend trả về, nếu không thì dùng DiscountPrice bình thường
          DiscountPrice:
            item.FlashPrice != null
              ? Number(item.FlashPrice)
              : item.DiscountPrice ?? null,

          Stock: Number(item.Stock ?? 0),
          ImageUrl: item.ImageUrl ?? '',
          CreatedAt: item.CreatedAt ?? new Date().toISOString(),
          CategoryId: item.CategoryId ?? null,
          SKU: item.SKU ?? '',
          IsPublished: item.IsPublished ?? true,
          UpdatedAt: item.UpdatedAt ?? null,
        })) as Product[];

        setProducts(mapped.slice(0, limit));
      } catch (error) {
        console.error('Lỗi fetch flash sale products:', error);
        setProducts([]);
        setCampaign(null);
      }
    }

    getFlashProducts();
  }, [campaignCode, limit]);

  // ==========================
  // 2. Countdown theo thời gian campaign (EndTime) – có cả ngày
  // ==========================
  React.useEffect(() => {
    if (!campaign) return;

    // Tùy MSSQL đặt tên cột, đề phòng EndTime / endTime
    const endTimeRaw = campaign.EndTime || campaign.endTime;
    if (!endTimeRaw) return;

    const endTime = new Date(endTimeRaw).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [campaign]);

  return (
    <ContainerFluid>
      <section className={className}>
        <div className="flash-sale-header">
          <div className="countdown">
            {countdown.days !== '00' && (
              <>
                <span id="days">{countdown.days}</span> ngày{' '}
              </>
            )}
            <span id="hours">{countdown.hours}</span>:
            <span id="minutes">{countdown.minutes}</span>:
            <span id="seconds">{countdown.seconds}</span>
          </div>
          <h2>{h2Title ?? campaign?.Title ?? 'Flash Sale'}</h2>
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
