// app/(components)/SectionCollection.tsx
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import ContainerFluid from "../ContainerFluid/container-fluid.jsx";
import {
  categories_pc,
  categories_laptop,
  categories_mouse,
  categories_keyboard,
  categories_monitor,
} from "@/lib/data.js";
import ProductSlider from "../ProductSlider/ProductSlider";
import styles from "./SectionCollection.module.scss";
import { Product as BackendProduct } from "@/lib/product";
import CategoryCollection from "./CategoryCollection";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface SectionCollectionProps {
  type?: "pc" | "laptop" | "mouse" | "keyboard" | "monitor"; // Loại section cần hiển thị
  title?: string; // Tiêu đề tùy chỉnh (ví dụ: "Sản phẩm tương tự")
  excludeProductId?: string; // ID sản phẩm cần loại trừ (cho related products)
}

// Helper: filter theo CategoryId, fallback theo keyword trong tên/mô tả
function filterByCategory(
  products: BackendProduct[],
  categoryId: number,
  keywords: string[] = []
): BackendProduct[] {
  return products.filter((p) => {
    const name = (p.Name ?? "").toLowerCase();
    const desc = (p.Description ?? "").toLowerCase();

    if (p.CategoryId === categoryId) return true;

    if (keywords.length === 0) return false;

    return keywords.some(
      (kw) => name.includes(kw) || desc.includes(kw)
    );
  });
}

export default function SectionCollection({
  type,
  title,
  excludeProductId,
}: SectionCollectionProps) {
  const [allProducts, setAllProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/products`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const { success, data } = await res.json();
        if (success) {
          setAllProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Chọn filter + cate + title theo type
  let filteredProducts = allProducts;
  let categories: { title: string; href: string }[] = [];
  let defaultTitle = "";
  let subTitle = "";

  switch (type) {
    case "pc":
      // PC: CategoryId = 2
      filteredProducts = filterByCategory(allProducts, 2, [
        "pc",
        "desktop",
        "máy tính bàn",
      ]);
      categories = categories_pc;
      defaultTitle = title || "PC bán chạy";
      subTitle = "Trả góp 0%";
      break;
    case "laptop":
      // Laptop: CategoryId = 1
      filteredProducts = filterByCategory(allProducts, 1, [
        "laptop",
        "notebook",
        "macbook",
      ]);
      categories = categories_laptop;
      defaultTitle = title || "Laptop bán chạy";
      subTitle = "Miễn phí giao hàng";
      break;
    case "mouse":
      // Chuột: CategoryId = 5
      filteredProducts = filterByCategory(allProducts, 5, [
        "chuột",
        "mouse",
      ]);
      categories = categories_mouse;
      defaultTitle = title || "Chuột bán chạy";
      subTitle = "Giao hàng toàn quốc";
      break;
    case "keyboard":
      // Bàn phím: CategoryId = 4
      filteredProducts = filterByCategory(allProducts, 4, [
        "bàn phím",
        "ban phim",
        "keyboard",
        "keychron",
        "bàn cơ",
      ]);
      categories = categories_keyboard;
      defaultTitle = title || "Bàn phím bán chạy";
      subTitle = "Giao hàng toàn quốc";
      break;
    case "monitor":
      // Màn hình: CategoryId = 3
      filteredProducts = filterByCategory(allProducts, 3, [
        "màn hình",
        "man hinh",
        "monitor",
        "display",
      ]);
      categories = categories_monitor;
      defaultTitle = title || "Màn hình chính hãng";
      subTitle = "Bảo hành 1 đổi 1";
      break;
    default:
      // Không có type → xử lý bên dưới (render nhiều section)
      break;
  }

  // Loại trừ sản phẩm hiện tại nếu có excludeProductId
  if (excludeProductId) {
    const excludeIdNum = Number(excludeProductId);
    if (!Number.isNaN(excludeIdNum)) {
      filteredProducts = filteredProducts.filter(
        (p) => p.ProductId !== excludeIdNum
      );
    }
  }

  const renderSection = (
    sectionType: string,
    products: BackendProduct[],
    cats: { title: string; href: string }[],
    mainTitle: string,
    sub: string
  ) => {
    let searchTerm = "";
    switch (sectionType) {
      case "pc":
        searchTerm = "pc-gaming";
        break;
      case "laptop":
        searchTerm = "laptop";
        break;
      case "mouse":
        searchTerm = "chuot-may-tinh";
        break;
      case "keyboard":
        searchTerm = "ban-phim-may-tinh";
        break;
      case "monitor":
        searchTerm = "man-hinh-may-tinh";
        break;
      default:
        searchTerm = "";
    }

    const searchHref = searchTerm
      ? `/collections/${encodeURIComponent(searchTerm)}`
      : "#";

    return (
      <ContainerFluid key={sectionType}>
        <section
          className={styles["section-collection"]}
          id={`home-collection-${sectionType}`}
        >
          <div className={styles["section-heading"]}>
            <div className={styles["box-left"]}>
              <div className={styles["box-header"]}>
                <h2 className={styles["hTitle"]}>{mainTitle}</h2>
              </div>
              <div className={styles["box-subheader"]}>
                <h3 className={styles["shTitle"]}>{sub}</h3>
              </div>
            </div>
            <div className={styles["box-right"]}>
              <div className={styles["box-cate"]}>
                <ul className={styles["cate-list"]}>
                  {cats.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles["box-link"]}>
                <Link href={searchHref} className={styles["button-more"]}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>

          <div className={styles["section-content"]}>
            {loading ? (
              <ProductSlider
                products={[]}
                showDotActive={false}
                isLoading={true}
                skeletonCount={8}
              />
            ) : products.length > 0 ? (
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
    // Chỉ render section theo type (ví dụ: sản phẩm tương tự trên trang chi tiết)
    return renderSection(
      type,
      filteredProducts,
      categories,
      defaultTitle,
      subTitle
    );
  } else {
    // Render tất cả sections (trang chủ)
    const pcProducts = filterByCategory(allProducts, 2, [
      "pc",
      "desktop",
      "máy tính bàn",
    ]);
    const laptopProducts = filterByCategory(allProducts, 1, [
      "laptop",
      "notebook",
      "macbook",
    ]);
    const mouseProducts = filterByCategory(allProducts, 5, [
      "chuột",
      "mouse",
    ]);
    const keyboardProducts = filterByCategory(allProducts, 4, [
      "bàn phím",
      "ban phim",
      "keyboard",
      "keychron",
      "bàn cơ",
    ]);
    const monitorProducts = filterByCategory(allProducts, 3, [
      "màn hình",
      "man hinh",
      "monitor",
      "display",
    ]);

    return (
      <div className={styles["section-container"]}>
        {renderSection(
          "pc",
          pcProducts,
          categories_pc,
          "PC bán chạy",
          "Trả góp 0%"
        )}
        {renderSection(
          "laptop",
          laptopProducts,
          categories_laptop,
          "Laptop bán chạy",
          "Miễn phí giao hàng"
        )}
        {renderSection(
          "mouse",
          mouseProducts,
          categories_mouse,
          "Chuột bán chạy",
          "Giao hàng toàn quốc"
        )}
        {renderSection(
          "keyboard",
          keyboardProducts,
          categories_keyboard,
          "Bàn phím bán chạy",
          "Giao hàng toàn quốc"
        )}
        {renderSection(
          "monitor",
          monitorProducts,
          categories_monitor,
          "Màn hình chính hãng",
          "Bảo hành 1 đổi 1"
        )}

        <CategoryCollection />
      </div>
    );
  }
}
