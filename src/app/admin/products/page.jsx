"use client";
import { useMemo, useState, useEffect } from "react";
import styles from "./products.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

function currency(v) {
  try {
    return v?.toLocaleString("vi-VN") + "đ";
  } catch {
    return v + "đ";
  }
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("default");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    categoryId: "",
    images: [], // Đổi từ imageUrl sang images array
    sku: "",
  });

  // Fetch products từ API khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      console.log("🔍 Fetching products from:", `${API_BASE}/api/admin/products`);
      const res = await fetch(`${API_BASE}/api/admin/products`);
      const data = await res.json();
      console.log("📦 Products response:", data);
      if (data.success) {
        console.log("✅ Products loaded:", data.data.length);
        setProducts(data.data);
      } else {
        console.error("❌ API returned success=false:", data);
      }
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const set = new Set(["all", ...products.map((p) => p.CategoryName).filter(Boolean)]);
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (p.ProductName || "").toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "all") list = list.filter((p) => p.CategoryName === category);
    if (inStockOnly) list = list.filter((p) => (p.StockQuantity ?? 0) > 0);
    switch (sort) {
      case "priceAsc":
        list = [...list].sort(
          (a, b) => (a.DiscountPrice ?? a.Price) - (b.DiscountPrice ?? b.Price)
        );
        break;
      case "priceDesc":
        list = [...list].sort(
          (a, b) => (b.DiscountPrice ?? b.Price) - (a.DiscountPrice ?? a.Price)
        );
        break;
      default:
        break;
    }
    return list;
  }, [products, search, category, inStockOnly, sort]);

  function openEditModal(product) {
    setEditingProduct(product);
    // Parse images từ ImageUrl (giả sử lưu dạng comma-separated hoặc JSON array)
    let imagesList = [];
    if (product.ImageUrl) {
      try {
        // Thử parse JSON array trước
        imagesList = JSON.parse(product.ImageUrl);
      } catch {
        // Nếu không phải JSON, coi như string đơn
        imagesList = product.ImageUrl.split(',').filter(Boolean);
      }
    }
    setFormData({
      productName: product.ProductName || "",
      description: product.Description || "",
      price: product.Price || "",
      discountPrice: product.DiscountPrice || "",
      stockQuantity: product.StockQuantity || "",
      categoryId: product.CategoryId || "",
      images: imagesList.map(url => ({ url, uploaded: true })),
      sku: product.SKU || "",
    });
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
  }

  function closeModals() {
    setEditingProduct(null);
    setShowAddModal(false);
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

  async function handleImageUpload(e) {
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
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...uploadedImages] 
      }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Upload ảnh thất bại: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  function deleteImage(index) {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }

  async function saveProduct() {
    if (!editingProduct) return;
    try {
      // Chuyển images array thành JSON string để lưu vào DB
      const imageUrlString = JSON.stringify(formData.images.map(img => img.url));
      
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingProduct.ProductId,
          data: {
            ...formData,
            imageUrl: imageUrlString, // Backend vẫn nhận imageUrl
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh lại danh sách
        await fetchProducts();
        closeModals();
        alert("Cập nhật sản phẩm thành công!");
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
      const imageUrlString = JSON.stringify(formData.images.map(img => img.url));
      
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrlString,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh lại danh sách
        await fetchProducts();
        closeModals();
        alert("Thêm sản phẩm thành công!");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Thêm sản phẩm thất bại!");
    }
  }

  async function togglePublished(productId) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "togglePublished" })
      });
      const data = await res.json();
      if (data.success) {
        // Cập nhật state local
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

  async function deleteProduct(productId) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/products?productId=${productId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        // Xóa khỏi state local
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
        <h1>Quản lý sản phẩm</h1>
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
                    src={p.ImageUrl || "/images/products/keychron_k2.jpg"}
                    alt={p.ProductName}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/products/keychron_k2.jpg";
                    }}
                  />
                </div>
                <div className={styles.content}>
                  <div className={styles.title}>
                    {p.ProductName}
                  </div>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <button className={styles.closeBtn} onClick={closeModals}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mô tả sản phẩm</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className={styles.uploadText}>Nhấp để chọn hoặc kéo thả ảnh vào đây</div>
                  <div className={styles.uploadHint}>Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB mỗi ảnh)</div>
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
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="VD: DELL-XPS13"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Danh mục *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories
                      .filter((c) => c !== "all")
                      .map((catName) => {
                        const cat = products.find((p) => p.CategoryName === catName);
                        return cat ? (
                          <option key={cat.CategoryId} value={cat.CategoryId}>
                            {catName}
                          </option>
                        ) : null;
                      })}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Giá gốc (đ) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giá khuyến mãi (đ)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Số lượng tồn kho *</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                />
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
              <button className={styles.closeBtn} onClick={closeModals}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mô tả sản phẩm</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <div>Nhấp để chọn hoặc kéo thả ảnh vào đây</div>
                        <div className={styles.uploadHint}>Hỗ trợ nhiều ảnh, tối đa 5MB mỗi file</div>
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
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="VD: DELL-XPS13"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Danh mục *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories
                      .filter((c) => c !== "all")
                      .map((catName) => {
                        const cat = products.find((p) => p.CategoryName === catName);
                        return cat ? (
                          <option key={cat.CategoryId} value={cat.CategoryId}>
                            {catName}
                          </option>
                        ) : null;
                      })}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Giá gốc (đ) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="VD: 25000000"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giá khuyến mãi (đ)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="VD: 22000000"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Số lượng tồn kho *</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
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
