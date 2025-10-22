'use client';

import useSWR from 'swr';
import ProductSlider from './ProductSlider';
import ContainerFluid from '../container-fluid.jsx';
import './RecentView.module.scss';
import '../../../styles/globals.css';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  created_at: string;
};

type ApiResp = { success: boolean; data: Product[] };

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json() as Promise<ApiResp>;
  });

export default function RecentView() {
  // Client fetch qua proxy để tránh CORS/OPTIONS: /api/... -> /_api/...
  const { data, error, isLoading } = useSWR<ApiResp>('/_api/products', fetcher);

  const products = data?.data ?? [];
  const recent = [...products]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 10);

  return (
    <ContainerFluid>
      <section className="recent-view">
        <h2>Sản phẩm đã xem</h2>

        {isLoading && <div className="py-8">Đang tải…</div>}
        {error && <div className="py-8 text-red-600">Lỗi tải sản phẩm</div>}
        {!isLoading && !error && <ProductSlider products={recent} showDotActive />}
      </section>
    </ContainerFluid>
  );
}
