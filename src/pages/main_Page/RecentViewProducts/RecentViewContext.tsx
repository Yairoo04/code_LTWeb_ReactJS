'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RecentViewProduct } from '@/lib/recent-view-product';
import { getAuth } from '@/lib/auth';

interface RecentViewContextType {
  products: RecentViewProduct[];
  loading: boolean;
  error: string | null;
  addRecentView: (productId: number) => Promise<void>;
  refetch: () => Promise<void>;
}

const RecentViewContext = createContext<RecentViewContextType | undefined>(undefined);

export function RecentViewProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<RecentViewProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const limit = 10;

  // ============================
  // 1) ĐỌC userId LẦN ĐẦU TỪ getAuth()
  // ============================
  useEffect(() => {
    const { userId } = getAuth();
    setUserId(userId ?? null);
    console.log('[RecentViewContext] init userId:', userId);
  }, []);

  // ============================
  // 2) LẮNG NGHE auth-login & auth-logout
  // ============================
  useEffect(() => {
    // Khi login xong, Header bắn event 'auth-login'
    const handleAuthLogin = () => {
      const { userId } = getAuth();
      console.log('[RecentViewContext] auth-login, new userId:', userId);
      setUserId(userId ?? null);
    };

    // Khi logout, Header bắn event 'auth-logout'
    const handleAuthLogout = () => {
      console.log('[RecentViewContext] auth-logout → clear state');
      setUserId(null);
      setProducts([]);
      setError(null);
      setLoading(false);
    };

    window.addEventListener('auth-login', handleAuthLogin);
    window.addEventListener('auth-logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth-login', handleAuthLogin);
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  // ============================
  // 3) REFETCH KHI userId THAY ĐỔI
  // ============================
  useEffect(() => {
    if (userId == null) {
      // Không có user → không fetch, clear list
      setProducts([]);
      setLoading(false);
      return;
    }
    // Có user → fetch lịch sử
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const refetch = async () => {
    if (userId == null) return;

    setLoading(true);
    setError(null);

    try {
      console.log('[RecentViewContext] REFETCH với userId:', userId);
      const res = await fetch(`/api/recentviewProducts?userId=${userId}&limit=${limit}`, {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const mapped: RecentViewProduct[] = data.data.map((item: any) => ({
          Id: item.Id ?? 0,
          UserId: userId,
          ProductId: item.ProductId,
          Name: item.Name,
          Price: item.Price,
          DiscountPrice: item.DiscountPrice,
          ImageUrl: item.ImageUrl,
          ViewedAt: item.ViewedAt ? new Date(item.ViewedAt) : new Date(),
        }));
        setProducts(mapped);
        console.log('[RecentViewContext] REFETCH thành công:', mapped.length, 'sản phẩm');
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError('Lỗi tải: ' + (err as Error).message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addRecentView = async (productId: number) => {
    if (userId == null) return;

    try {
      const res = await fetch('/api/recentviewProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });

      if (!res.ok) throw new Error('Lỗi POST');

      await refetch(); // Sau khi thêm thì refetch lại list
    } catch (err) {
      console.error('Lỗi addRecentView:', err);
    }
  };

  return (
    <RecentViewContext.Provider
      value={{ products, loading, error, addRecentView, refetch }}
    >
      {children}
    </RecentViewContext.Provider>
  );
}

export const useRecentView = () => {
  const context = useContext(RecentViewContext);
  if (!context) throw new Error('useRecentView phải dùng trong RecentViewProvider');
  return context;
};
