// 'use client';

// import useSWR from 'swr';
// import { fetcher, buildClientUrl } from '@/lib/fetcher';

// export type Product = {
//   id: number; name: string; description: string;
//   price: number; category: string; stock: number;
//   image_url: string; created_at: string;
// };

// export type ProductFilter = {
//   q?: string;
//   category?: string;
//   inStockOnly?: boolean;
// };useProducts

// function makeKey(filter: ProductFilter) {
//   const params = new URLSearchParams();
//   if (filter.q) params.set('q', filter.q);
//   if (filter.category) params.set('category', filter.category);
//   if (filter.inStockOnly) params.set('inStockOnly', '1');
//   const qs = params.toString();
//   return buildClientUrl(`/api/products${qs ? `?${qs}` : ''}`);
// }

// export function useProducts(filter: ProductFilter) {
//   const key = makeKey(filter);

//   const { data, error, isLoading, mutate } = useSWR(
//     key,
//     fetcher,
//     {
//       revalidateOnFocus: false,   // không refetch khi đổi tab/focus
//       revalidateIfStale: false,   // có cache là dùng, không tự refetch
//       dedupingInterval: 60_000,   // trong 60s mọi nơi dùng cùng key -> chỉ 1 request
//       keepPreviousData: true,
//     }
//   );

//   const products: Product[] = data?.data ?? [];
//   return { products, error, isLoading, refetch: () => mutate() };
// }
