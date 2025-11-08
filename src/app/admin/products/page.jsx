"use client";
import { useMemo, useState } from "react";
import styles from "./products.module.scss";

function currency(v) {
  try {
    return v?.toLocaleString("vi-VN") + "đ";
  } catch {
    return v + "đ";
  }
}

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Laptop Dell XPS 13", price: 25000000, category: "Laptop", stock: 10, imageUrl: "/images/products/view_vx2528j.jpg" },
  { id: 2, name: "PC Gaming ASUS ROG", price: 35000000, discountPrice: 33000000, category: "PC - Workstation", stock: 5, imageUrl: "/images/products/view_vx2479a-hd-pro.jpg" },
  { id: 3, name: "Laptop HP Pavilion 15", price: 15000000, category: "Laptop", stock: 15, imageUrl: "/images/products/view_vx2528j.jpg" },
  { id: 4, name: "PC Lenovo Workstation", price: 40000000, category: "PC - Workstation", stock: 3, imageUrl: "/images/products/acer_kg240y_x1.jpg" },
  { id: 5, name: "Viewsonic VA2432A-H", price: 1800000, category: "Màn hình", stock: 3, imageUrl: "/images/products/view_va2432a-h.jpg" },
  { id: 6, name: "Keychron K2", price: 1890000, category: "Phím chuột", stock: 15, imageUrl: "/images/products/keychron_k2.jpg" },
  { id: 7, name: "Logitech G502 HERO", price: 1490000, category: "Phím chuột", stock: 25, imageUrl: "/images/products/g502.jpg" },
  { id: 8, name: "Áo thun PTIT", price: 150000, discountPrice: 120000, category: "Phụ kiện", stock: 50, imageUrl: "/images/aothun.png" },
  { id: 9, name: "Laptop HP Pavilion 2025 i7 16GB", price: 18500000, discountPrice: 16900000, category: "Laptop", stock: 20, imageUrl: "/images/hp_pavilion.jpg" },
  { id: 10, name: "Chuột không dây GTN M1", price: 299000, category: "Phím chuột", stock: 0, imageUrl: "/images/products/g502.jpg" },
  { id: 11, name: "Bàn phím cơ GTN TKL", price: 1299000, discountPrice: 990000, category: "Phím chuột", stock: 8, imageUrl: "/images/products/keychron_k2.jpg" },
  { id: 12, name: "Màn hình ASUS 27\" 144Hz", price: 4490000, category: "Màn hình", stock: 12, imageUrl: "/images/products/view_va2432a-h.jpg" },
];

export default function ProductPage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("default");

  const categories = useMemo(() => {
    const set = new Set(["all", ...products.map((p) => p.category)]);
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => (p.stock ?? 0) > 0);
    switch (sort) {
      case "priceAsc":
        list = [...list].sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
        );
        break;
      case "priceDesc":
        list = [...list].sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
        );
        break;
      default:
        break;
    }
    return list;
  }, [products, search, category, inStockOnly, sort]);

  function handleAddSample() {
    const nextId = (products.at(-1)?.id ?? 0) + 1;
    const sample = {
      id: nextId,
      name: `Sản phẩm mẫu #${nextId}`,
      price: 199000 + (nextId % 5) * 100000,
      category: ["Laptop", "Phím chuột", "Màn hình", "Phụ kiện"][nextId % 4],
      stock: [0, 5, 10, 20][nextId % 4],
      imageUrl: "/images/products/keychron_k2.jpg",
    };
    setProducts((prev) => [...prev, sample]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý sản phẩm</h1>
        <button className={styles.addBtn} onClick={handleAddSample}>
          + Thêm sản phẩm mẫu
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Tất cả danh mục" : c}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Mặc định</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
        </select>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          Chỉ còn hàng
        </label>
      </div>

      <div className={styles.grid}>
        {filtered.map((p) => {
          const hasDiscount = p.discountPrice && p.discountPrice < p.price;
          const finalPrice = p.discountPrice ?? p.price;
          const discountPercent = hasDiscount
            ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
            : 0;
          const outOfStock = (p.stock ?? 0) <= 0;
          return (
            <div key={p.id} className={styles.card}>
              <div className={styles.imageWrap}>
                {hasDiscount ? (
                  <span className={styles.badgeDiscount}>-{discountPercent}%</span>
                ) : null}
                {outOfStock ? (
                  <span className={styles.badgeOut}>Hết hàng</span>
                ) : (
                  <span className={styles.badgeIn}>{p.stock ?? 0} còn</span>
                )}
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/images/products/keychron_k2.jpg";
                  }}
                />
              </div>
              <div className={styles.content}>
                <div className={styles.title} title={p.name}>
                  {p.name}
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.categoryChip}>{p.category}</span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.finalPrice}>{currency(finalPrice)}</span>
                  {hasDiscount ? (
                    <span className={styles.originalPrice}>{currency(p.price)}</span>
                  ) : null}
                </div>
                <div className={styles.actions}>
                  <button className={styles.btnGhost}>Sửa</button>
                  <button className={styles.btnGhost}>Ẩn/Hiện</button>
                  <button className={styles.btnDanger}>Xóa</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
