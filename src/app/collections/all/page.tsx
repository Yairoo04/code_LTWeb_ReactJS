"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faArrowDownWideShort, faSortDown } from "@fortawesome/free-solid-svg-icons";
import ProductCard from '@/pages/main_Page/Product/ProductCard';
import styles from './CollectionsAll.module.scss';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import RecentView from '@/pages/main_Page/RecentViewProducts/RecentView';
import CategoryCollection from '@/pages/main_Page/sectionCollection/CategoryCollection';
import classNames from 'classnames';

type ApiProduct = {
  ProductId: number;
  Name: string;
  Description: string;
  CategoryId: number;
  SKU: string;
  Price: number;
  DiscountPrice: number | null;
  Stock: number;
  ImageUrl: string;
  IsPublished: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
};

type FrontendProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  category?: string | null;
  stock?: number;
  image_url?: string;
  created_at?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

const mapToFrontendProduct = (apiProduct: ApiProduct): FrontendProduct => ({
  id: apiProduct.ProductId,
  name: apiProduct.Name,
  description: apiProduct.Description,
  price: apiProduct.Price,
  discountPrice: apiProduct.DiscountPrice,
  category: apiProduct.CategoryId ? apiProduct.CategoryId.toString() : null, 
  stock: apiProduct.Stock,
  image_url: apiProduct.ImageUrl,
  created_at: apiProduct.CreatedAt,
});

const sortOptions = [
  { value: 'popular', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
];

const CollectionsAll = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); 
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    brand: '',
    cpu: '',
    screenSize: '',
    usage: '',
    ram: '',
    ssd: '',
    vga: '',
  });
  const [sortBy, setSortBy] = useState('popular'); 
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const mappedProducts = data.data.map(mapToFrontendProduct);
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
          setHasMore(mappedProducts.length > 5);
        }
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    if (filters.category) {
      tempProducts = tempProducts.filter((p) => p.category === filters.category);
    }
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      tempProducts = tempProducts.filter((p) => {
        const price = p.discountPrice || p.price;
        return price >= min && (max ? price <= max : true);
      });
    }
    if (filters.brand) {
      tempProducts = tempProducts.filter((p) => p.name.toLowerCase().includes(filters.brand.toLowerCase()));
    }
    if (filters.cpu) {
      tempProducts = tempProducts.filter((p) => p.description?.toLowerCase().includes(filters.cpu.toLowerCase()));
    }
    if (filters.screenSize) {
      tempProducts = tempProducts.filter((p) => p.description?.toLowerCase().includes(filters.screenSize.toLowerCase()));
    }
    if (filters.usage) {
      tempProducts = tempProducts.filter((p) => p.description?.toLowerCase().includes(filters.usage.toLowerCase()));
    }
    if (filters.ram) {
      tempProducts = tempProducts.filter((p) => p.description?.toLowerCase().includes(filters.ram.toLowerCase()));
    }
    if (filters.ssd) {
      tempProducts = tempProducts.filter((p) => p.description?.toLowerCase().includes(filters.ssd.toLowerCase()));
    }
    if (filters.vga) {
      tempProducts = tempProducts.filter((p) => p.description?.toLowerCase().includes(filters.vga.toLowerCase()));
    }

    if (sortBy === 'price-asc') {
      tempProducts.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      tempProducts.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(tempProducts);
    setVisibleCount(5);
    setHasMore(tempProducts.length > 5);
  }, [filters, sortBy, products]);

  const loadMore = () => {
    const newCount = visibleCount + 5;
    setVisibleCount(newCount);
    setHasMore(newCount < filteredProducts.length);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (newValue: string) => {
    setSortBy(newValue);
  };

  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Nổi bật';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(`.${styles.selectWrapper}`)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <Header />

      <main className={styles.mainCollections}>
        <div className={styles.breadcrumbWrap}>
          <ContainerFluid>
            <div className={styles.breadcrumbList}>
              <ol className={styles.breadcrumbArrow}>
                <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                <li><a href="/"> Trang chủ</a></li>
                <li><strong>Tất cả sản phẩm</strong></li>
              </ol>
            </div>
          </ContainerFluid>
        </div>

        <div className={styles.collectionsContainer}>
          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <section className={styles.filterWrap}>
              <select name="category" value={filters.category} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">Bộ lọc (Danh mục)</option>
                <option value="1">Laptop</option>
                <option value="2">PC</option>
                <option value="3">Màn hình</option>
                <option value="4">Bàn phím</option>
                <option value="5">Chuột</option>
              </select>
              <select name="price" value={filters.price} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">Giá</option>
                <option value="0-5000000">Dưới 5 triệu</option>
                <option value="5000000-10000000">5 - 10 triệu</option>
                <option value="10000000-20000000">10 - 20 triệu</option>
                <option value="20000000">Trên 20 triệu</option>
              </select>
              <select name="brand" value={filters.brand} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">Hãng</option>
                <option value="Dell">Dell</option>
                <option value="ASUS">ASUS</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Acer">Acer</option>
                <option value="Viewsonic">Viewsonic</option>
                <option value="Keychron">Keychron</option>
                <option value="Logitech">Logitech</option>
              </select>
              <select name="cpu" value={filters.cpu} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">CPU</option>
                <option value="Intel i7">Intel i7</option>
                <option value="AMD Ryzen 9">AMD Ryzen 9</option>
                <option value="Intel đời 13">Intel đời 13</option>
              </select>
              <select name="screenSize" value={filters.screenSize} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">Kích thước màn hình</option>
                <option value="13 inch">13 inch</option>
                <option value="15 inch">15 inch</option>
                <option value="24 inch">24 inch</option>
              </select>
              <select name="usage" value={filters.usage} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">Nhu cầu sử dụng</option>
                <option value="cao cấp">Cao cấp</option>
                <option value="gaming">Gaming</option>
                <option value="văn phòng">Văn phòng</option>
              </select>
              <select name="ram" value={filters.ram} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">RAM</option>
                <option value="16GB">16GB</option>
                <option value="DDR5">DDR5</option>
              </select>
              <select name="ssd" value={filters.ssd} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">SSD</option>
                <option value="512 GB">512 GB</option>
              </select>
              <select name="vga" value={filters.vga} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">VGA</option>
                <option value="RTX 5090">RTX 5090</option>
              </select>
            </section>

            <section className={styles.collectionSortby}>
              <div className={styles.selectWrapper}> 
                <div
                  className={classNames(styles.listboxButton, 'js-sort', { [styles.active]: true })} 
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    enableBackground="new 0 0 512 512"
                  >
                    <g>
                      <path
                        fill="#111111"
                        fillRule="nonzero"
                        d="M9 7v15.584l1.293-1.291 1.414 1.414L8 26.414l-3.707-3.707 1.414-1.414L7 22.584V7zm9 15v2h-5v-2zm3-5v2h-8v-2zm3-5v2H13v-2zm3-5v2H13V7z"
                      />
                    </g>
                  </svg>
                  <div className={styles.sortbyControl}>
                    <span className={styles.listboxText}>Xếp theo:</span>
                    <span className={`${styles.listboxValue} current-sort`}>{currentLabel}</span>
                    <FontAwesomeIcon icon={faSortDown} className={styles.dropdownIcon} />
                  </div>
                </div>

                {isOpen && (
                  <ul className={styles.dropdownMenu}>
                    {sortOptions.map((opt) => (
                      <li
                        key={opt.value}
                        className={classNames(styles.dropdownItem, { [styles.selected]: opt.value === sortBy })}
                        onClick={() => {
                          handleSortChange(opt.value);
                          setIsOpen(false);
                        }}
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          {/* Product Grid */}
          <div className={styles.productGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className={styles.notFoundProduct}>Không tìm thấy sản phẩm nào.</p>
            )}
          </div>

          {hasMore && filteredProducts.length > 0 && (
            <div className={styles.loadMoreContainer}>
              <button className={styles.loadMoreButton} onClick={loadMore}>
                Xem thêm sản phẩm
              </button>
            </div>
          )}

          {/* Pagination - Placeholder, implement if needed */}
          {/* <div className={styles.pagination}>...</div> */}
        </div>
      </main>

      <RecentView />
      <CategoryCollection />

      <Footer />
    </>
  );
};

export default CollectionsAll;