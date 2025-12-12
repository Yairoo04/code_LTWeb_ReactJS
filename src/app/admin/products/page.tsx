"use client";

import { useMemo, useState, useEffect } from "react";
import styles from "./products.module.scss";
import AdminPageTitle from "@/components/AdminPageTitle";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

function currency(v: any) {
  try {
    return v?.toLocaleString("vi-VN") + "đ"; // nếu là số thì chuyển thành chuối + đ
  } catch {
    return v + "đ";
  }
}

// Danh mục khớp với bảng dbo.Categories
const CATEGORY_OPTIONS = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "PC" },
  { id: 3, name: "Màn hình" },
  { id: 4, name: "Bàn phím" },
  { id: 5, name: "Chuột" },
  { id: 6, name: "Main, CPU, VGA" },
  { id: 7, name: "Case, Nguồn, Tản" },
  { id: 8, name: "Ổ cứng, RAM, Thẻ nhớ" },
];

// Specs templates cho từng danh mục (theo CategoryId)
const SPECS_TEMPLATES: Record<number, { SpecName: string; SpecValue: string; Warranty: string }[]> = {
  1: [ // Laptop
    { SpecName: "CPU", SpecValue: "", Warranty: "" },
    { SpecName: "RAM", SpecValue: "", Warranty: "" },
    { SpecName: "VGA", SpecValue: "", Warranty: "" },
    { SpecName: "Ổ cứng", SpecValue: "", Warranty: "" },
    { SpecName: "Màn hình", SpecValue: "", Warranty: "" },
    { SpecName: "Pin", SpecValue: "", Warranty: "" },
    { SpecName: "Trọng lượng", SpecValue: "", Warranty: "" },
  ],
  2: [ // PC
    { SpecName: "CPU", SpecValue: "", Warranty: "" },
    { SpecName: "Mainboard", SpecValue: "", Warranty: "" },
    { SpecName: "RAM", SpecValue: "", Warranty: "" },
    { SpecName: "VGA", SpecValue: "", Warranty: "" },
    { SpecName: "SSD", SpecValue: "", Warranty: "" },
    { SpecName: "HDD", SpecValue: "", Warranty: "" },
    { SpecName: "PSU", SpecValue: "", Warranty: "" },
    { SpecName: "Case", SpecValue: "", Warranty: "" },
    { SpecName: "Tản nhiệt", SpecValue: "", Warranty: "" },
  ],
  3: [ // Màn hình
    { SpecName: "Kích thước", SpecValue: "", Warranty: "" },
    { SpecName: "Độ phân giải", SpecValue: "", Warranty: "" },
    { SpecName: "Tấm nền", SpecValue: "", Warranty: "" },
    { SpecName: "Tần số quét", SpecValue: "", Warranty: "" },
    { SpecName: "Thời gian phản hồi", SpecValue: "", Warranty: "" },
    { SpecName: "Cổng kết nối", SpecValue: "", Warranty: "" },
  ],
  4: [ // Bàn phím
    { SpecName: "Switch", SpecValue: "", Warranty: "" },
    { SpecName: "Keycap", SpecValue: "", Warranty: "" },
    { SpecName: "Layout", SpecValue: "", Warranty: "" },
    { SpecName: "Kết nối", SpecValue: "", Warranty: "" },
    { SpecName: "LED", SpecValue: "", Warranty: "" },
    { SpecName: "Pin", SpecValue: "", Warranty: "" },
  ],
  5: [ // Chuột
    { SpecName: "Sensor", SpecValue: "", Warranty: "" },
    { SpecName: "DPI", SpecValue: "", Warranty: "" },
    { SpecName: "Kết nối", SpecValue: "", Warranty: "" },
    { SpecName: "Pin", SpecValue: "", Warranty: "" },
    { SpecName: "Trọng lượng", SpecValue: "", Warranty: "" },
    { SpecName: "Số nút", SpecValue: "", Warranty: "" },
  ],
  6: [ // Main, CPU, VGA
    { SpecName: "Mainboard", SpecValue: "", Warranty: "" },
    { SpecName: "CPU", SpecValue: "", Warranty: "" },
    { SpecName: "VGA", SpecValue: "", Warranty: "" },
  ],
  7: [ // Case, Nguồn, Tản
    { SpecName: "Case", SpecValue: "", Warranty: "" },
    { SpecName: "PSU", SpecValue: "", Warranty: "" },
    { SpecName: "Tản nhiệt", SpecValue: "", Warranty: "" },
  ],
  8: [ // Ổ cứng, RAM, Thẻ nhớ
    { SpecName: "SSD", SpecValue: "", Warranty: "" },
    { SpecName: "HDD", SpecValue: "", Warranty: "" },
    { SpecName: "RAM", SpecValue: "", Warranty: "" },
    { SpecName: "Thẻ nhớ", SpecValue: "", Warranty: "" },
  ],
};

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | number>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("default");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [specs, setSpecs] = useState<any[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [formData, setFormData] = useState<{
    productName: string;
    description: string;
    price: any;
    discountPrice: any;
    stockQuantity: any;
    categoryId: number | "";// số hoặc rỗng khi chưa chọn
    images: { url: string; uploaded: boolean }[];
    sku: string;
  }>({
    productName: "",
    description: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    categoryId: "",
    images: [],
    sku: "",
  });

  function getFirstImageUrl(imageUrl) {
    if (!imageUrl) return "/images/products/keychron_k2.jpg";

    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      return imageUrl;
    } catch {
      const images = imageUrl.split(",").filter(Boolean);
      return images[0] || imageUrl;
    }
  }

<<<<<<< HEAD:src/app/admin/products/page.tsx

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  useEffect(() => {
=======
  // Fetch products từ API khi component mount
  useEffect(() => { // tự động chạy khi vào trang 
>>>>>>> 9d319008518c50b3d560e4d20f4e2fcc2fdebd4f:src/app/admin/products/page.jsx
    fetchProducts();
  }, []);

  async function fetchProducts() { // hàm lấy danh sách sản phẩm
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error("API returned success=false:", data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

<<<<<<< HEAD:src/app/admin/products/page.tsx
=======
  const categories = useMemo(() => { // ghi nhớ kết quả, tính lại khi products thay đổi
    const set = new Set(["all", ...products.map((p) => p.CategoryName).filter(Boolean)]);
    return Array.from(set);
  }, [products]);

>>>>>>> 9d319008518c50b3d560e4d20f4e2fcc2fdebd4f:src/app/admin/products/page.jsx
  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (p.ProductName || "").toLowerCase().includes(search.toLowerCase())
    );

    if (categoryFilter !== "all") {
      list = list.filter((p) => p.CategoryId === categoryFilter);
    }

    if (inStockOnly) {
      list = list.filter((p) => (p.StockQuantity ?? 0) > 0);
    }

    switch (sort) {
      case "priceAsc":
        list = [...list].sort(
          (a, b) => (a.DiscountPrice ?? a.Price) - (b.DiscountPrice ?? b.Price) // tăng dần
        );
        break;
      case "priceDesc":
        list = [...list].sort(
          (a, b) => (b.DiscountPrice ?? b.Price) - (a.DiscountPrice ?? a.Price) // giảm dần
        );
        break;
      default:
        break;
    }

    return list;
  }, [products, search, categoryFilter, inStockOnly, sort]);

  async function openEditModal(product: any) {
    setEditingProduct(product);

    let imagesList: string[] = [];
    if (product.ImageUrl) {
      try {
        imagesList = JSON.parse(product.ImageUrl);
      } catch {
        imagesList = product.ImageUrl.split(",").filter(Boolean);
      }
    }

    setFormData({
      productName: product.ProductName || "",
      description: product.Description || "",
      price: product.Price || "",
      discountPrice: product.DiscountPrice || "",
      stockQuantity: product.StockQuantity || "",
      categoryId: product.CategoryId || "",
      images: imagesList.map((url) => ({ url, uploaded: true })),
      sku: product.SKU || "",
    });

    setLoadingSpecs(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/products?productId=${product.ProductId}&details=true`
      );
      const data = await res.json();

      if (data.success && data.data.specs) {
        const loadedSpecs = data.data.specs.map((s: any) => ({
          SpecName: s.SpecName || "",
          SpecValue: s.SpecValue || "",
          Warranty: s.Warranty || "",
        }));
        setSpecs(loadedSpecs);
      } else {
        setSpecs([]);
      }
    } catch (error) {
      console.error("Failed to fetch specs:", error);
      setSpecs([]);
    } finally {
      setLoadingSpecs(false);
    }
  }

  function openAddModal() {
    setShowAddModal(true);
    setFormData({
      productName: "",
      description: "",
      price: "",
      discountPrice: "",
      stockQuantity: "",
      categoryId: "",
      images: [],
      sku: "",
    });
    setSpecs([]);
  }

  function closeModals() {
    setEditingProduct(null);
    setShowAddModal(false);
    setSpecs([]);
    setFormData({
      productName: "",
      description: "",
      price: "",
      discountPrice: "",
      stockQuantity: "",
      categoryId: "",
      images: [],
      sku: "",
    });
  }

  function loadSpecsTemplate(categoryIdValue: number | "") {
    const id = typeof categoryIdValue === "string" ? Number(categoryIdValue) : categoryIdValue;
    if (!id) {
      console.log("No category id to load template");
      return;
    }

    const template = SPECS_TEMPLATES[id];
    if (template) {
      const existingSpecNames = specs.map((s) =>
        (s.SpecName || "").trim().toLowerCase()
      );
      const newSpecs = template.filter(
        (t) => !existingSpecNames.includes(t.SpecName.trim().toLowerCase())
      );
      setSpecs([...specs, ...newSpecs.map((t) => ({ ...t }))]);
    }
  }

  function addSpec() {
    setSpecs([...specs, { SpecName: "", SpecValue: "", Warranty: "" }]);
  }

  function updateSpec(index: number, field: "SpecName" | "SpecValue" | "Warranty", value: string) {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  }

  function removeSpec(index: number) {
    setSpecs(specs.filter((_, i) => i !== index));
  }

  async function saveSpecs(productId: number) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/product-specs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, specs }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to save specs");
      }
    } catch (error: any) {
      console.error("Error saving specs:", error);
      alert("Lỗi lưu thông số kỹ thuật: " + error.message);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const res = await fetch(`${API_BASE}/api/upload`, {
          method: "POST",
          body: formDataUpload,
        });
        const data = await res.json();

        if (data.success) {
          return { url: data.imageUrl, uploaded: true };
        } else {
          throw new Error(data.error || "Upload failed");
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      alert("Upload ảnh thất bại: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  function deleteImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function saveProduct() {
    if (!editingProduct) return;
    try {
      const imageUrlString = JSON.stringify(formData.images.map((img) => img.url));

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingProduct.ProductId,
          data: {
            ...formData,
            categoryId: formData.categoryId ? Number(formData.categoryId) : null,
            imageUrl: imageUrlString,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        await saveSpecs(editingProduct.ProductId);
        await fetchProducts();
        closeModals();
        alert("Cập nhật sản phẩm và thông số kỹ thuật thành công!");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Cập nhật sản phẩm thất bại!");
    }
  }

  async function createProduct() {
    if (!formData.productName || !formData.price || !formData.categoryId) {
      alert("Vui lòng điền đầy đủ: Tên sản phẩm, Giá, Danh mục!");
      return;
    }
    try {
      const imageUrlString = JSON.stringify(formData.images.map((img) => img.url));

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId ? Number(formData.categoryId) : null,
          imageUrl: imageUrlString,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        closeModals();
        alert("Thêm sản phẩm thành công!");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Thêm sản phẩm thất bại!");
    }
  }

  async function togglePublished(productId: number) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "togglePublished" }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.ProductId === productId ? { ...p, IsPublished: p.IsPublished ? 0 : 1 } : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle product:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  }

  async function deleteProduct(productId: number) {
    if (
      !confirm(
        "Cẩn trọng: Việc xóa sản phẩm này sẽ xóa toàn bộ dữ liệu liên quan (đơn hàng, giỏ hàng, thông số, doanh thu, ...). Bạn có chắc chắn muốn xóa?"
      )
    )
      return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/products?productId=${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.ProductId !== productId));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Xóa sản phẩm thất bại!");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <AdminPageTitle>Quản lý sản phẩm</AdminPageTitle>
        <button className={styles.addBtn} onClick={openAddModal}>
          + Thêm sản phẩm
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
          value={categoryFilter === "all" ? "all" : String(categoryFilter)}
          onChange={(e) => {
            const v = e.target.value;
            setCategoryFilter(v === "all" ? "all" : Number(v));
          }}
        >
          <option value="all">Tất cả danh mục</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
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

      {loading ? (
        <LoadingSpinner message="Đang tải sản phẩm..." minHeight={200} />
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => {
            const hasDiscount = p.DiscountPrice && p.DiscountPrice < p.Price;
            const finalPrice = p.DiscountPrice ?? p.Price;
            const discountPercent = hasDiscount
              ? Math.round(((p.Price - p.DiscountPrice) / p.Price) * 100)
              : 0;
            const outOfStock = (p.StockQuantity ?? 0) <= 0;
            const isUnpublished = !p.IsPublished;
            return (
              <div
                key={p.ProductId}
                className={`${styles.card} ${isUnpublished ? styles.inactive : ""}`}
              >
                <div className={styles.imageWrap}>
                  {hasDiscount ? (
                    <span className={styles.badgeDiscount}>-{discountPercent}%</span>
                  ) : null}
                  {outOfStock ? (
                    <span className={styles.badgeOut}>Hết hàng</span>
                  ) : (
                    <span className={styles.badgeIn}>{p.StockQuantity ?? 0} còn</span>
                  )}
                  {isUnpublished ? (
                    <span className={styles.badgeInactive}>Đã ẩn</span>
                  ) : null}
                  <img
                    src={getFirstImageUrl(p.ImageUrl)}
                    alt={p.ProductName}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/products/keychron_k2.jpg";
                    }}
                  />
                </div>
                <div className={styles.content}>
                  <div className={styles.title}>{p.ProductName}</div>
                  <div className={styles.metaRow}>
                    <span className={styles.categoryChip}>{p.CategoryName || "Khác"}</span>
                    <span className={styles.skuChip}>SKU: {p.SKU || "N/A"}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.finalPrice}>{currency(finalPrice)}</span>
                    {hasDiscount ? (
                      <span className={styles.originalPrice}>{currency(p.Price)}</span>
                    ) : null}
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.iconBtn}
                      data-tooltip="Sửa sản phẩm"
                      onClick={() => openEditModal(p)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className={styles.iconBtn}
                      data-tooltip={p.IsPublished ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
                      onClick={() => togglePublished(p.ProductId)}
                    >
                      {p.IsPublished ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                    <button
                      className={styles.iconBtnDanger}
                      data-tooltip="Xóa sản phẩm"
                      onClick={() => deleteProduct(p.ProductId)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Edit */}
      {editingProduct && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Sửa sản phẩm #{editingProduct.ProductId}</h3>
              <button className={styles.closeBtn} onClick={closeModals}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mô tả sản phẩm</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ảnh sản phẩm (có thể chọn nhiều)</label>
                <div className={styles.imageUploadZone}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <svg
                    className={styles.uploadIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className={styles.uploadText}>
                    Nhấp để chọn hoặc kéo thả ảnh vào đây
                  </div>
                  <div className={styles.uploadHint}>
                    Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB mỗi ảnh)
                  </div>
                </div>
                {uploading && (
                  <div className={styles.uploadingIndicator}>Đang upload ảnh...</div>
                )}
                {formData.images.length > 0 && (
                  <div className={styles.imagesPreviewGrid}>
                    {formData.images.map((img, index) => (
                      <div key={index} className={styles.imagePreviewCard}>
                        <img src={img.url} alt={`Preview ${index + 1}`} />
                        <button
                          className={styles.deleteImageBtn}
                          onClick={() => deleteImage(index)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="VD: DELL-XPS13"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Danh mục *</label>
                  <select
                    value={formData.categoryId === "" ? "" : String(formData.categoryId)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value
                          ? Number(e.target.value)
                          : "",
                      })
                    }
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Giá gốc (đ) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giá khuyến mãi (đ)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPrice: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Số lượng tồn kho *</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                />
              </div>

              {/* Thông số kỹ thuật */}
              <div className={styles.specsSection}>
                <div className={styles.specsHeader}>
                  <label>Thông số kỹ thuật</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className={styles.btnLoadTemplate}
                      onClick={() => {
                        if (!formData.categoryId) {
                          alert("Vui lòng chọn danh mục trước!");
                          return;
                        }
                        loadSpecsTemplate(formData.categoryId);
                      }}
                    >
                      📋 Tải mẫu theo danh mục
                    </button>
                    <button
                      type="button"
                      className={styles.btnAddSpec}
                      onClick={addSpec}
                    >
                      + Thêm thông số
                    </button>
                  </div>
                </div>
                {loadingSpecs ? (
                  <p
                    style={{
                      color: "#2563eb",
                      textAlign: "center",
                      padding: "20px",
                      margin: 0,
                    }}
                  >
                    ⏳ Đang tải thông số...
                  </p>
                ) : specs.length === 0 ? (
                  <p
                    style={{
                      color: "#9ca3af",
                      textAlign: "center",
                      padding: "20px",
                      margin: 0,
                    }}
                  >
                    Chưa có thông số. Nhấn "Thêm thông số" để bắt đầu.
                  </p>
                ) : (
                  <div className={styles.specsTable}>
                    <div className={styles.specsTableHeader}>
                      <div className={styles.headerCell}>Linh kiện</div>
                      <div className={styles.headerCell} style={{ flex: 2 }}>
                        Chi tiết
                      </div>
                      <div className={styles.headerCell}>Bảo hành</div>
                      <div
                        className={styles.headerCell}
                        style={{ width: "50px" }}
                      ></div>
                    </div>
                    <div className={styles.specsList}>
                      {specs.map((spec, index) => (
                        <div key={index} className={styles.specRow}>
                          <input
                            type="text"
                            placeholder="VD: CPU"
                            value={spec.SpecName}
                            onChange={(e) =>
                              updateSpec(index, "SpecName", e.target.value)
                            }
                            className={styles.specInput}
                          />
                          {/* <input
                            type="text"
                            placeholder="VD: Intel Core i5-1335U (10 nhân 12 luồng)"
                            value={spec.SpecValue}
                            onChange={(e) =>
                              updateSpec(index, "SpecValue", e.target.value)
                            }
                            className={styles.specInput}
                            style={{ flex: 2 }}
                          /> */}
                          <textarea
                            placeholder="VD: Intel Core i5-1335U (10 nhân 12 luồng)"
                            value={spec.SpecValue}
                            onChange={(e) => {
                              updateSpec(index, "SpecValue", e.target.value);
                              autoResize(e);
                            }}
                            onInput={autoResize}
                            className={styles.specInputTextarea}
                          />
                          <input
                            type="text"
                            placeholder="VD: 24 tháng"
                            value={spec.Warranty}
                            onChange={(e) =>
                              updateSpec(index, "Warranty", e.target.value)
                            }
                            className={styles.specInput}
                          />
                          <button
                            type="button"
                            onClick={() => removeSpec(index)}
                            className={styles.btnRemoveSpec}
                            title="Xóa thông số"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={closeModals}>
                Hủy
              </button>
              <button className={styles.btnSave} onClick={saveProduct}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Thêm sản phẩm mới</h3>
              <button className={styles.closeBtn} onClick={closeModals}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mô tả sản phẩm</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ảnh sản phẩm</label>
                <div className={styles.imageUploadZone}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className={styles.uploadingIndicator}>
                      <div className={styles.spinner}></div>
                      <div>Đang tải lên...</div>
                    </div>
                  ) : (
                    <>
                      <svg
                        className={styles.uploadIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <div>
                        <div>Nhấp để chọn hoặc kéo thả ảnh vào đây</div>
                        <div className={styles.uploadHint}>
                          Hỗ trợ nhiều ảnh, tối đa 5MB mỗi file
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {formData.images.length > 0 && (
                  <div className={styles.imagesPreviewGrid}>
                    {formData.images.map((img, index) => (
                      <div key={index} className={styles.imagePreviewCard}>
                        <img src={img.url} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className={styles.deleteImageBtn}
                          onClick={() => deleteImage(index)}
                          title="Xóa ảnh"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="VD: DELL-XPS13"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Danh mục *</label>
                  <select
                    value={formData.categoryId === "" ? "" : String(formData.categoryId)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value
                          ? Number(e.target.value)
                          : "",
                      })
                    }
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Giá gốc (đ) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="VD: 25000000"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giá khuyến mãi (đ)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPrice: e.target.value })
                    }
                    placeholder="VD: 22000000"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Số lượng tồn kho *</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                  placeholder="VD: 10"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={closeModals}>
                Hủy
              </button>
              <button className={styles.btnSave} onClick={createProduct}>
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
