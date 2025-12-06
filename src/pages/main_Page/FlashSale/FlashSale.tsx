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
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const { addRecentView } = useRecentView(); // nếu sau này muốn log sản phẩm đã xem

  // ==========================
  // 1. Fetch danh sách sản phẩm theo campaignCode
  // ==========================
  React.useEffect(() => {
    async function getFlashProducts() {
      try {
        setIsLoading(true);

        const url = campaignCode
          ? `/api/flash-sale/${campaignCode}`
          : '/api/flash-sale';
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
          console.error('Fetch', url, 'failed:', res.status);
          setProducts([]);
          setCampaign(null);
          return;
        }

        const data = await res.json();
        setCampaign(data.campaign);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Lỗi fetch flash sale:', error);
        setProducts([]);
        setCampaign(null);
      } finally {
        setIsLoading(false);
      }
    }
    getFlashProducts();
  }, [campaignCode]);

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

  // Giới hạn số sản phẩm truyền vào slider
  const limitedProducts = limit ? products.slice(0, limit) : products;

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
            <span id="hours">{countdown.hours}</span> giờ :{' '}
            <span id="minutes">{countdown.minutes}</span> phút :{' '}
            <span id="seconds">{countdown.seconds}</span> giây
          </div>
          <h2>{h2Title ?? campaign?.Title ?? 'Flash Sale'}</h2>
        </div>

        <div className="flash-sale-content">
          {showImg_Sale && (
            <div className="flash-sale-2-content-img">
              {campaign && campaign.BannerImageUrl ? (
                <img
                  src={campaign.BannerImageUrl}
                  alt={campaign?.Title || 'Banner'}
                  loading="lazy"
                  style={{ maxWidth: 400, width: '100%', height: 'auto' }}
                />
              ) : campaignCode === 'FLASH_10H' ? (
                <img
                  src="/images/flash-sale/frame-flash-sale-10h.png"
                  alt="Frame Flash Sale 10H"
                  loading="lazy"
                  style={{ maxWidth: 400, width: '100%', height: 'auto' }}
                />
              ) : (
                <img
                  src="/images/flash-sale/gtn-gamming-gear.png"
                  alt="GTN Gamming Gear"
                  loading="lazy"
                  style={{ maxWidth: 400, width: '100%', height: 'auto' }}
                />
              )}
            </div>
          )}

          <ProductSlider
            products={limitedProducts}
            showDotActive={showDotActive}
            isLoading={isLoading}    
            skeletonCount={limit}  
          />

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
