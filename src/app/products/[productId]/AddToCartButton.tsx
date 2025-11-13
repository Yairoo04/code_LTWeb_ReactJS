"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const cartId = localStorage.getItem("cartId");
      const token = localStorage.getItem("token");
      const userIdStr = localStorage.getItem("userId");

      // 🚨 Nếu chưa login → không được Add-to-cart (tránh userId = null)
      if (!token || !userIdStr) {
        alert("Bạn phải đăng nhập để thêm sản phẩm vào giỏ hàng.");
        router.push("/dang-nhap"); // hoặc /login tùy site
        return;
      }

      const userId = Number(userIdStr);

      // 🚨 Nếu parse lỗi hoặc userId 0
      if (!userId || isNaN(userId)) {
        alert("Lỗi xác thực người dùng. Vui lòng đăng nhập lại.");
        router.push("/dang-nhap");
        return;
      }

      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // luôn gửi token
        },
        body: JSON.stringify({
          cartId: cartId || null,
          userId: userId,
          productId,
          quantity: 1,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Không thể thêm vào giỏ hàng.");
      }

      // Lưu lại cartId do backend trả về
      if (json.cartId) {
        localStorage.setItem("cartId", json.cartId);
      }

      router.push("/gio-hang");
    } catch (err: any) {
      alert("Lỗi thêm giỏ hàng: " + err.message);
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
