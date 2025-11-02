// app/(components)/SectionCollection.jsx
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import ContainerFluid from '../ContainerFluid/container-fluid.jsx';
import { categories_pc, categories_laptop, categories_mouse, categories_keyboard, categories_monitor } from '@/lib/data.js'; // Giữ nguyên categories từ data.js
import ProductSlider from '../ProductSlider/ProductSlider';
import styles from './SectionCollection.module.scss';
import { Product as BackendProduct } from '@/lib/product';

export default function SectionCollection() {
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

  // Lọc sản phẩm cho PC: Description bắt đầu bằng "PC"
  const pcProducts = allProducts.filter((p) => p.Description.startsWith('PC'));

  // Lọc sản phẩm cho Laptop: Description bắt đầu bằng "Laptop"
  const laptopProducts = allProducts.filter((p) => p.Description.startsWith('Laptop'));

  // Lọc sản phẩm cho Chuột: Description bắt đầu bằng "Chuột"
  const mouseProducts = allProducts.filter((p) => p.Description.startsWith('Chuột'));

  // Lọc sản phẩm cho Bàn phím: Description bắt đầu bằng "Bàn phím"
  const keyboardProducts = allProducts.filter((p) => p.Description.startsWith('Bàn phím'));

  // Lọc sản phẩm cho Màn hình: Description bắt đầu bằng "Màn hình"
  const monitorProducts = allProducts.filter((p) => p.Description.startsWith('Màn'));

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className={styles['section-container']}>
      {/* Nhóm PC */}
      <ContainerFluid>
        <section className={styles['section-collection']} id="home-collection-PC">
          <div className={styles['section-heading']}>
            <div className={styles['box-left']}>
              <div className={styles['box-header']}>
                <h2 className={styles['hTitle']}>PC bán chạy</h2>
              </div>
              <div className={styles['box-subheader']}>
                <h3 className={styles['shTitle']}>Trả góp 0%</h3>
              </div>
            </div>
            <div className={styles['box-right']}>
              <div className={styles['box-cate']}>
                <ul className={styles['cate-list']}>
                  {categories_pc.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['box-link']}>
                <Link href="#" className={styles['button-more']}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
          <div className={styles['section-content']}>
            {/* Sử dụng ProductSlider với pcProducts */}
            <ProductSlider
              products={pcProducts}
              showDotActive={true}
            />
          </div>
        </section>
      </ContainerFluid>

      {/* Nhóm Laptop */}
      <ContainerFluid>
        <section className={styles['section-collection']} id="home-collection-laptop">
          <div className={styles['section-heading']}>
            <div className={styles['box-left']}>
              <div className={styles['box-header']}>
                <h2 className={styles['hTitle']}>Laptop bán chạy</h2>
              </div>
              <div className={styles['box-subheader']}>
                <h3 className={styles['shTitle']}>Miễn phí giao hàng</h3>
              </div>
            </div>
            <div className={styles['box-right']}>
              <div className={styles['box-cate']}>
                <ul className={styles['cate-list']}>
                  {categories_laptop.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['box-link']}>
                <Link href="#" className={styles['button-more']}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
          <div className={styles['section-content']}>
            <ProductSlider
              products={laptopProducts}
              showDotActive={true}
            />
          </div>
        </section>
      </ContainerFluid>

      {/* Nhóm chuột */}
      <ContainerFluid>
        <section className={styles['section-collection']} id="home-collection-laptop">
          <div className={styles['section-heading']}>
            <div className={styles['box-left']}>
              <div className={styles['box-header']}>
                <h2 className={styles['hTitle']}>Chuột bán chạy</h2>
              </div>
              <div className={styles['box-subheader']}>
                <h3 className={styles['shTitle']}>Giao hàng toàn quốc</h3>
              </div>
            </div>
            <div className={styles['box-right']}>
              <div className={styles['box-cate']}>
                <ul className={styles['cate-list']}>
                  {categories_mouse.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['box-link']}>
                <Link href="#" className={styles['button-more']}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
          <div className={styles['section-content']}>
            <ProductSlider
              products={mouseProducts}
              showDotActive={true}
            />
          </div>
        </section>
      </ContainerFluid>

      {/* Nhóm bàn phím */}
      <ContainerFluid>
        <section className={styles['section-collection']} id="home-collection-laptop">
          <div className={styles['section-heading']}>
            <div className={styles['box-left']}>
              <div className={styles['box-header']}>
                <h2 className={styles['hTitle']}>Bàn phím bán chạy</h2>
              </div>
              <div className={styles['box-subheader']}>
                <h3 className={styles['shTitle']}>Giao hàng toàn quốc</h3>
              </div>
            </div>
            <div className={styles['box-right']}>
              <div className={styles['box-cate']}>
                <ul className={styles['cate-list']}>
                  {categories_keyboard.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['box-link']}>
                <Link href="#" className={styles['button-more']}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
          <div className={styles['section-content']}>
            <ProductSlider
              products={keyboardProducts}
              showDotActive={true}
            />
          </div>
        </section>
      </ContainerFluid>

      {/* Nhóm màn hình */}
      <ContainerFluid>
        <section className={styles['section-collection']} id="home-collection-screen">
          <div className={styles['section-heading']}>
            <div className={styles['box-left']}>
              <div className={styles['box-header']}>
                <h2 className={styles['hTitle']}>Màn hình chính hãng</h2>
              </div>
              <div className={styles['box-subheader']}>
                <h3 className={styles['shTitle']}>Bảo hành 1 đổi 1</h3>
              </div>
            </div>
            <div className={styles['box-right']}>
              <div className={styles['box-cate']}>
                <ul className={styles['cate-list']}>
                  {categories_monitor.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['box-link']}>
                <Link href="#" className={styles['button-more']}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
          <div className={styles['section-content']}>
            <ProductSlider
              products={monitorProducts}
              showDotActive={true}
            />
          </div>
        </section>
      </ContainerFluid>

      <ContainerFluid>
        <section className={styles['section-collection']}>
          <h2 className={styles['section-collection__catalog']}>Danh mục sản phẩm</h2>
          <div className={styles['collection-grid']}>
            <div className={styles['item-icon']}>
              <Link href="/laptops">
                <img src="/images/product-catalog/laptop_catalog.jpg" alt="Laptops" />
                <p>Laptops</p>
              </Link>
            </div>

            <div className={styles['item-icon']}>
              <Link href="/gaming">
                <img src="/images/product-catalog/pc_catalog.jpg" alt="Gaming" />
                <p>PC</p>
              </Link>
            </div>

            <div className={styles['item-icon']}>
              <Link href="/accessories">
                <img src="/images/product-catalog/man_hinh_catalog.jpg" alt="Accessories" />
                <p>Màn hình</p>
              </Link>
            </div>

            <div className={styles['item-icon']}>
              <Link href="/accessories">
                <img src="/images/product-catalog/ban_phim_catalog.jpg" alt="Accessories" />
                <p>Bàn phím</p>
              </Link>
            </div>

            <div className={styles['item-icon']}>
              <Link href="/accessories">
                <img src="/images/product-catalog/chuot_catalog.jpg" alt="Accessories" />
                <p>Chuột</p>
              </Link>
            </div>
          </div>
        </section>
      </ContainerFluid>
    </div>
  );
}