// app/collections/all/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSortDown } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ContainerFluid from "@/pages/main_Page/ContainerFluid/container-fluid";
import RecentView from "@/pages/main_Page/RecentViewProducts/RecentView";
import CategoryCollection from "@/pages/main_Page/sectionCollection/CategoryCollection";
import ProductCard from "@/pages/main_Page/Product/ProductCard";
import ProductCardSkeleton from "@/pages/main_Page/Product/ProductCardSkeleton";

import styles from "./CollectionsAll.module.scss";

import { CATEGORY_FILTER_CONFIG } from "@/lib/products/filterConfig";
import type { FilterState } from "@/lib/products/types";
import { useCollectionProducts } from "@/hooks/useCollectionProducts";

const sortOptions = [
  { value: "popular", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const CollectionsAllPage = () => {
  // All page: không cần useParams, tự cố định slug + pathname
  const slug = "all";
  const pathname = "/collections/all";

  const [isOpen, setIsOpen] = useState(false);

  const {
    filteredProducts,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    visibleCount,
    hasMore,
    loadMore,
    isLoading,
  } = useCollectionProducts(slug, pathname);

  // ✅ Fallback an toàn: all -> 1 -> []
  const activeCategory = filters.category || "all";
  const activeFilterConfig =
    CATEGORY_FILTER_CONFIG[activeCategory] ||
    CATEGORY_FILTER_CONFIG["all"] ||
    CATEGORY_FILTER_CONFIG["1"] ||
    [];

  const handleSortChange = (newValue: string) => {
    setSortBy(newValue);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev: FilterState) => ({
      ...prev,
      [name]: value,
    }) as FilterState);
  };

  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Nổi bật";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event.target as HTMLElement).closest(`.${styles.selectWrapper}`)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
                  <a href="/"> Trang chủ</a>
                </li>
                <li>
                  <strong>Tất cả sản phẩm</strong>
                </li>
              </ol>
            </div>
          </ContainerFluid>
        </div>

        <ContainerFluid>
          <div className={styles.collectionsContainer}>
            {/* Filter + Sort bar */}
            <div className={styles.filterBar}>
              <section className={styles.filterWrap}>
                {activeFilterConfig.map((f) => (
                  <select
                    key={f.key}
                    name={f.key}
                    value={
                      typeof filters[f.key] === "string"
                        ? (filters[f.key] as string)
                        : ""
                    }
                    onChange={handleFilterChange}
                    className={styles.filterSelect}
                  >
                    <option value="">{f.placeholder}</option>
                    {f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ))}
              </section>

              <section className={styles.collectionSortby}>
                <div className={styles.selectWrapper}>
                  <div
                    className={classNames(styles.listboxButton, "js-sort", {
                      [styles.active]: isOpen,
                    })}
                    onClick={() => setIsOpen((prev) => !prev)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
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
                      <span
                        className={`${styles.listboxValue} current-sort`}
                      >
                        {currentLabel}
                      </span>
                      <FontAwesomeIcon
                        icon={faSortDown}
                        className={styles.dropdownIcon}
                      />
                    </div>
                  </div>

                  {isOpen && (
                    <ul className={styles.dropdownMenu}>
                      {sortOptions.map((opt) => (
                        <li
                          key={opt.value}
                          className={classNames(styles.dropdownItem, {
                            [styles.selected]: opt.value === sortBy,
                          })}
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
              {isLoading ? (
                Array.from({ length: 10 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className={styles.notFoundProduct}>
                  Không tìm thấy sản phẩm nào.
                </p>
              )}
            </div>

            {!isLoading && hasMore && filteredProducts.length > 0 && (
              <div className={styles.loadMoreContainer}>
                <button
                  className={styles.loadMoreButton}
                  onClick={loadMore}
                >
                  Xem thêm sản phẩm
                </button>
              </div>
            )}
          </div>
        </ContainerFluid>
      </main>

      <RecentView />
      <CategoryCollection />
      <Footer />
    </>
  );
};

export default CollectionsAllPage;
