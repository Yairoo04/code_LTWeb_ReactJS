// app/products/[productId]/ProductActions.tsx
"use client";

import { useState } from "react";
import styles from "./ProductDetail.module.scss"; // Dùng chung style với page
import InstallmentModal from "./InstallmentModal";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";

interface ProductActionsProps {
  product: any;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);

  return (
    <>
      <div className={styles.actions}>
        <BuyNowButton productId={product.ProductId} />

        <button
          onClick={() => setIsInstallmentOpen(true)}
          className={styles.installmentBtn} // Bạn có thể thêm class này trong SCSS nếu chưa có
        >
          TRẢ GÓP
        </button>

        <AddToCartButton productId={product.ProductId} />
      </div>

      <InstallmentModal
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        product={product}
      />
    </>
  );
}