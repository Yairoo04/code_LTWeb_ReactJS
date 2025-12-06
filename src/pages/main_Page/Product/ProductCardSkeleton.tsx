// src/pages/main_Page/Product/ProductCardSkeleton.tsx
import React from "react";
import styles from "./ProductCardSkeleton.module.scss";

const ProductCardSkeleton = () => {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.imageSkeleton} />
      <div className={styles.titleSkeleton} />
      <div className={styles.priceSkeleton} />
      <div className={styles.metaSkeleton} />
    </div>
  );
};

export default ProductCardSkeleton;
