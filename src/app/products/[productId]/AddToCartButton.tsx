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
      const userId = Number(localStorage.getItem("userId") ?? 1);

      const response = await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId ?? null,
          userId,
          productId,
          quantity: 1,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message);
      }

      if (json.cartId) {
        localStorage.setItem("cartId", json.cartId);
      }

      router.push("/gio-hang"); // 🔥 URL đúng
    } catch (err: any) {
      alert("Lỗi thêm giỏ hàng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handleAddToCart}>{loading ? "Đang thêm..." : "THÊM VÀO GIỎ"}</button>;
}
