"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSortDown } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "@/pages/main_Page/Product/ProductCard";
import styles from "./CollectionsSlug.module.scss";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ContainerFluid from "@/pages/main_Page/ContainerFluid/container-fluid";
import RecentView from "@/pages/main_Page/RecentViewProducts/RecentView";
import CategoryCollection from "@/pages/main_Page/sectionCollection/CategoryCollection";
import classNames from "classnames";
import { megaMenuData } from "@/lib/data";
// -------------------------
// TYPES
// -------------------------
type ApiProduct = {
  ProductId: number;
  Name: string;
  Description: string;
  CategoryId: number | null;
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
  description: string;
  price: number;
  discountPrice?: number | null;
  categoryId?: number | null;
  image_url?: string;
  stock?: number;
};

// -------------------------
// API + HELPERS
// -------------------------
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const mapToFrontendProduct = (apiProduct: ApiProduct): FrontendProduct => ({
  id: apiProduct.ProductId,
  name: apiProduct.Name,
  description: apiProduct.Description,
  price: apiProduct.Price,
  discountPrice: apiProduct.DiscountPrice,
  categoryId: apiProduct.CategoryId,
  image_url: apiProduct.ImageUrl,
  stock: apiProduct.Stock,
});

// -------------------------
// SORT OPTIONS
// -------------------------
const sortOptions = [
  { value: "popular", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

// -------------------------
// MAIN COMPONENT
// -------------------------
const CollectionPage = () => {
  const { slug } = useParams() as { slug: string };

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  // -------------------------
  // FILTERS
  // -------------------------
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    price: "",
    cpu: "",
    usage: "",
    series: "",
    screenSize: "",
    ram: "",
    ssd: "",
    vga: "",
  });

  // -------------------------
  // TITLE + FILTER PARSING
  // -------------------------
  useEffect(() => {
    if (!slug) return;
    const s = slug.toLowerCase();
    setTitle(
      slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );

    const newFilters = {
      category: "",
      brand: "",
      price: "",
      cpu: "",
      usage: "",
      series: "",
      screenSize: "",
      ram: "",
      ssd: "",
      vga: "",
    };

    // 1️⃣ Category
    if (s.includes("laptop")) newFilters.category = "1";
    else if (s.includes("pc")) newFilters.category = "2";
    else if (s.includes("man-hinh")) newFilters.category = "3";
    else if (s.includes("ban-phim")) newFilters.category = "4";
    else if (s.includes("chuot")) newFilters.category = "5";

    // 2️⃣ Brand
    const brands = [
      "asus",
      "acer",
      "msi",
      "lenovo",
      "dell",
      "hp",
      "lg",
      "gigabyte",
      "viewsonic",
      "keychron",
      "logitech",
    ];
    const foundBrand = brands.find((b) => s.includes(b));
    if (foundBrand) newFilters.brand = foundBrand;

    // 3️⃣ CPU
    if (s.includes("intel")) newFilters.cpu = "intel";
    else if (s.includes("amd")) newFilters.cpu = "amd";

    // 4️⃣ Price
    if (s.includes("duoi-15")) newFilters.price = "0-15000000";
    else if (s.includes("15tr-den-20tr")) newFilters.price = "15000000-20000000";
    else if (s.includes("tren-20")) newFilters.price = "20000000-999999999";

    // 5️⃣ Usage
    if (s.includes("hoc-sinh") || s.includes("hoc-tap")) newFilters.usage = "học sinh";
    else if (s.includes("do-hoa")) newFilters.usage = "đồ họa";
    else if (s.includes("mong-nhe")) newFilters.usage = "mỏng nhẹ";
    else if (s.includes("gaming")) newFilters.usage = "gaming";

    // 6️⃣ Series
    const seriesKeywords = [
      "xps",
      "vivobook",
      "zenbook",
      "loq",
      "predator",
      "rog",
      "tuf",
      "pavilion",
    ];
    const foundSeries = seriesKeywords.find((k) => s.includes(k));
    if (foundSeries) newFilters.series = foundSeries;

    setFilters(newFilters);
  }, [slug]);

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const mapped = data.data.map(mapToFrontendProduct);
          setProducts(mapped);
          setFilteredProducts(mapped);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // -------------------------
  // APPLY FILTERS
  // -------------------------
  useEffect(() => {
    let result = [...products];
    const { category, brand, cpu, price, usage, series, screenSize, ram, ssd, vga } = filters;

    if (category) {
      result = result.filter((p) => {
        // Strict match CategoryId if not null
        if (p.categoryId !== null && String(p.categoryId) === category) {
          // Additional check for category "2" (PC): Exclude if name includes "laptop"
          if (category === "2" && p.name.toLowerCase().includes("laptop")) return false;
          return true;
        }
        // Fallback for null/mismatch CategoryId: Check name/desc
        let keyword = '';
        if (category === '1') keyword = 'laptop';
        else if (category === '2') keyword = 'pc';
        else if (category === '3') keyword = 'màn hình';
        else if (category === '4') keyword = 'bàn phím';
        else if (category === '5') keyword = 'chuột';
        return keyword && (p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword));
      });
    }

    if (brand)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(brand.toLowerCase()) ||
          p.description.toLowerCase().includes(brand.toLowerCase())
      );

    if (cpu)
      result = result.filter((p) =>
        p.description.toLowerCase().includes(cpu.toLowerCase())
      );

    if (series)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(series.toLowerCase())
      );

    if (usage)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(usage.toLowerCase()) ||
          p.description.toLowerCase().includes(usage.toLowerCase())
      );

    if (screenSize)
      result = result.filter((p) =>
        p.description.toLowerCase().includes(screenSize.toLowerCase())
      );

    if (ram)
      result = result.filter((p) =>
        p.description.toLowerCase().includes(ram.toLowerCase())
      );

    if (ssd)
      result = result.filter((p) =>
        p.description.toLowerCase().includes(ssd.toLowerCase())
      );

    if (vga)
      result = result.filter((p) =>
        p.description.toLowerCase().includes(vga.toLowerCase())
      );

    if (price) {
      const [min, max] = price.split("-").map(Number);
      result = result.filter((p) => {
        const realPrice = p.discountPrice || p.price;
        return realPrice >= min && (max ? realPrice <= max : true);
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort(
        (a, b) =>
          (a.discountPrice || a.price) - (b.discountPrice || b.price)
      );
    } else if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          (b.discountPrice || b.price) - (a.discountPrice || a.price)
      );
    }

    setFilteredProducts(result);
    setVisibleCount(5);
    setHasMore(result.length > 5);
  }, [filters, sortBy, products]);

  // -------------------------
  // LOAD MORE
  // -------------------------
  const loadMore = () => {
    const newCount = visibleCount + 5;
    setVisibleCount(newCount);
    setHasMore(newCount < filteredProducts.length);
  };

  const handleSortChange = (newValue: string) => {
    setSortBy(newValue);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------
  // SORT HANDLING
  // -------------------------
  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Nổi bật";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(`.${styles.selectWrapper}`)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <>
      <Header />

      <main className={styles.mainCollections}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbWrap}>
          <ContainerFluid>
            <div className={styles.breadcrumbList}>
              <ol className={styles.breadcrumbArrow}>
                <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <strong>{title}</strong>
                </li>
              </ol>
            </div>
          </ContainerFluid>
        </div>

        <div className={styles.collectionsContainer}>
          {/* Sort bar */}
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
                <option value="20000000-999999999">Trên 20 triệu</option>
              </select>
              <select name="brand" value={filters.brand} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">Hãng</option>
                <option value="dell">Dell</option>
                <option value="asus">ASUS</option>
                <option value="hp">HP</option>
                <option value="lenovo">Lenovo</option>
                <option value="acer">Acer</option>
                <option value="viewsonic">Viewsonic</option>
                <option value="keychron">Keychron</option>
                <option value="logitech">Logitech</option>
              </select>
              <select name="cpu" value={filters.cpu} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">CPU</option>
                <option value="intel i7">Intel i7</option>
                <option value="amd ryzen 9">AMD Ryzen 9</option>
                <option value="intel đời 13">Intel đời 13</option>
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
                <option value="16gb">16GB</option>
                <option value="ddr5">DDR5</option>
              </select>
              <select name="ssd" value={filters.ssd} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">SSD</option>
                <option value="512 gb">512 GB</option>
              </select>
              <select name="vga" value={filters.vga} onChange={handleFilterChange} className={styles.filterSelect}>
                <option value="">VGA</option>
                <option value="rtx 5090">RTX 5090</option>
              </select>
            </section>

            <section className={styles.collectionSortby}>
              <div className={styles.selectWrapper}>
                <div
                  className={classNames(styles.listboxButton, 'js-sort', { [styles.active]: isOpen })}
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
        </div>
      </main>

      <RecentView />
      <CategoryCollection />
      <Footer />
    </>
  );
};

export default CollectionPage;