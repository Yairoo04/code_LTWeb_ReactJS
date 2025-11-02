// app/(components)/RecentView/RecentViewContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RecentViewProduct } from '@/lib/recent-view-product';

interface RecentViewContextType {
  products: RecentViewProduct[];
  loading: boolean; // Thêm loading
  error: string | null; // Thêm error
  addRecentView: (productId: number) => Promise<void>;
  refetch: () => Promise<void>;
}

const RecentViewContext = createContext<RecentViewContextType | undefined>(undefined);

export function RecentViewProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<RecentViewProduct[]>([]);
  const [loading, setLoading] = useState(true); // Khởi tạo loading
  const [error, setError] = useState<string | null>(null); // Khởi tạo error
  const userId = 1;
  const limit = 10;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'; // Sử dụng env để linh hoạt

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/recentviewProducts?userId=${userId}&limit=${limit}`,
        { method: 'GET', cache: 'no-store' }
      );
      if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const mapped: RecentViewProduct[] = data.data.map((item: any) => ({
          Id: item.Id ?? 0,
          UserId: item.UserId ?? 0,
          ProductId: item.ProductId ?? 0,
          Name: item.Name ?? 'Không có tên',
          Description: item.Description ?? null,
          CategoryId: item.CategoryId ?? null,
          SKU: item.SKU ?? null,
          Price: item.Price ?? 0,
          DiscountPrice: item.DiscountPrice ?? null,
          Stock: item.Stock ?? 0,
          ImageUrl: item.ImageUrl ?? null,
          IsPublished: item.IsPublished ?? true,
          ViewedAt: item.ViewedAt ? new Date(item.ViewedAt) : new Date(),
        }));
        setProducts(mapped);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addRecentView = async (productId: number) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/recentviewProducts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);
      await refetch(); // Refetch sau khi add
    } catch (err) {
      setError('Lỗi khi thêm recent view: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <RecentViewContext.Provider value={{ products, loading, error, addRecentView, refetch }}>
      {children}
    </RecentViewContext.Provider>
  );
}

export const useRecentView = () => {
  const context = useContext(RecentViewContext);
  if (!context) throw new Error('useRecentView phải dùng trong RecentViewProvider');
  return context;
};