// app/(components)/SectionCollection.tsx
"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import ContainerFluid from '../ContainerFluid/container-fluid.jsx';
import { categories_pc, categories_laptop, categories_mouse, categories_keyboard, categories_monitor } from '@/lib/data.js';
import ProductSlider from '../ProductSlider/ProductSlider';
import styles from './SectionCollection.module.scss';
import { Product as BackendProduct } from '@/lib/product';
import CategoryCollection from './CategoryCollection';

interface SectionCollectionProps {
  type?: 'pc' | 'laptop' | 'mouse' | 'keyboard' | 'monitor'; // Loại section cần hiển thị
  title?: string; // Tiêu đề tùy chỉnh (ví dụ: "Sản phẩm tương tự")
  excludeProductId?: string; // ID sản phẩm cần loại trừ (cho related products)
}

export default function SectionCollection({ type, title, excludeProductId }: SectionCollectionProps) {
  const [allProducts, setAllProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:4000/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch products');
        const { success, data } = await res.json();
        if (success) {
          setAllProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Lọc sản phẩm dựa trên type
  let filteredProducts = allProducts;
  let categories: { title: string; href: string; }[] = [];
  let defaultTitle = '';
  let subTitle = '';

  switch (type) {
    case 'pc':
      filteredProducts = allProducts.filter((p) => p.Description.startsWith('PC'));
      categories = categories_pc;
      defaultTitle = title || 'PC bán chạy';
      subTitle = 'Trả góp 0%';
      break;
    case 'laptop':
      filteredProducts = allProducts.filter((p) => p.Description.startsWith('Laptop'));
      categories = categories_laptop;
      defaultTitle = title || 'Laptop bán chạy';
      subTitle = 'Miễn phí giao hàng';
      break;
    case 'mouse':
      filteredProducts = allProducts.filter((p) => p.Description.startsWith('Chuột'));
      categories = categories_mouse;
      defaultTitle = title || 'Chuột bán chạy';
      subTitle = 'Giao hàng toàn quốc';
      break;
    case 'keyboard':
      filteredProducts = allProducts.filter((p) => p.Description.startsWith('Bàn phím'));
      categories = categories_keyboard;
      defaultTitle = title || 'Bàn phím bán chạy';
      subTitle = 'Giao hàng toàn quốc';
      break;
    case 'monitor':
      filteredProducts = allProducts.filter((p) => p.Description.startsWith('Màn'));
      categories = categories_monitor;
      defaultTitle = title || 'Màn hình chính hãng';
      subTitle = 'Bảo hành 1 đổi 1';
      break;
    default:
      // Nếu không có type, hiển thị tất cả (như hiện tại)
      break;
  }

  // Loại trừ sản phẩm hiện tại nếu có excludeProductId
  if (excludeProductId) {
    filteredProducts = filteredProducts.filter((p) => p.ProductId !== Number(excludeProductId));
  }

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  // Hàm render một section duy nhất
  const renderSection = (sectionType: string, products: BackendProduct[], cats: { title: string; href: string; }[], mainTitle: string, sub: string) => {
    let searchTerm = '';
    switch (sectionType) {
      case 'pc':
        searchTerm = 'PC';
        break;
      case 'laptop':
        searchTerm = 'Laptop';
        break;
      case 'mouse':
        searchTerm = 'Chuột';
        break;
      case 'keyboard':
        searchTerm = 'Bàn phím';
        break;
      case 'monitor':
        searchTerm = 'Màn hình'; // Sửa để khớp đầy đủ hơn nếu search cần chính xác
        break;
      default:
        searchTerm = '';
    }

    const searchHref = searchTerm ? `/search?q=${encodeURIComponent(searchTerm)}` : '#';

    return (
      <ContainerFluid key={sectionType}>
        <section className={styles['section-collection']} id={`home-collection-${sectionType}`}>
          <div className={styles['section-heading']}>
            <div className={styles['box-left']}>
              <div className={styles['box-header']}>
                <h2 className={styles['hTitle']}>{mainTitle}</h2>
              </div>
              <div className={styles['box-subheader']}>
                <h3 className={styles['shTitle']}>{sub}</h3>
              </div>
            </div>
            <div className={styles['box-right']}>
              <div className={styles['box-cate']}>
                <ul className={styles['cate-list']}>
                  {cats.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['box-link']}>
                <Link href={searchHref} className={styles['button-more']}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
          <div className={styles['section-content']}>
            {products.length > 0 ? (
              <ProductSlider products={products} showDotActive={true} />
            ) : (
              <p>Không có sản phẩm nào trong danh mục này.</p>
            )}
          </div>
        </section>
      </ContainerFluid>
    );
  };

  if (type) {
    // Chỉ render section theo type
    return renderSection(type, filteredProducts, categories, defaultTitle, subTitle);
  } else {
    // Render tất cả sections như hiện tại
    const pcProducts = allProducts.filter((p) => p.Description.startsWith('PC'));
    const laptopProducts = allProducts.filter((p) => p.Description.startsWith('Laptop'));
    const mouseProducts = allProducts.filter((p) => p.Description.startsWith('Chuột'));
    const keyboardProducts = allProducts.filter((p) => p.Description.startsWith('Bàn phím'));
    const monitorProducts = allProducts.filter((p) => p.Description.startsWith('Màn'));

    return (
      <div className={styles['section-container']}>
        {renderSection('pc', pcProducts, categories_pc, 'PC bán chạy', 'Trả góp 0%')}
        {renderSection('laptop', laptopProducts, categories_laptop, 'Laptop bán chạy', 'Miễn phí giao hàng')}
        {renderSection('mouse', mouseProducts, categories_mouse, 'Chuột bán chạy', 'Giao hàng toàn quốc')}
        {renderSection('keyboard', keyboardProducts, categories_keyboard, 'Bàn phím bán chạy', 'Giao hàng toàn quốc')}
        {renderSection('monitor', monitorProducts, categories_monitor, 'Màn hình chính hãng', 'Bảo hành 1 đổi 1')}

        <CategoryCollection/>
      </div>
    );
  }
}