"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userIdFromStorage = localStorage.getItem("userId"); // ← Lấy từ chỗ đã lưu chắc chắn

      if (!token || !userIdFromStorage) {
        alert("Bạn phải đăng nhập để thêm sản phẩm vào giỏ hàng.");
        router.push("/dang-nhap");
        return;
      }

      const userId = Number(userIdFromStorage);

      const cartId = localStorage.getItem("cartId") || null;

      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartId,
          userId,
          productId,
          quantity: 1,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Thêm giỏ hàng thất bại");
      }

      if (json.cartId) {
        localStorage.setItem("cartId", json.cartId);
      }

      // Tăng ngay lập tức số giỏ hàng
      window.dispatchEvent(new Event("cart-updated"));

      // Bạn có thể chọn: chuyển trang hoặc ở lại + toast
      router.push("/gio-hang");
      // hoặc: alert("Đã thêm vào giỏ hàng!");

    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? "Đang thêm..." : "THÊM VÀO GIỎ"}
    </button>
  );
}