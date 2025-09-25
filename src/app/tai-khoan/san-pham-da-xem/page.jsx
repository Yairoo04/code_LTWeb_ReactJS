'use client';
import styles from "./ViewedProducts.module.scss";
import { FaFileAlt, FaSearch } from "react-icons/fa";

export default function ViewedProducts() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>SẢN PHẨM ĐÃ XEM</h2>

      <div className={styles.emptyState}>
        <div className={styles.iconWrapper}>
          <FaFileAlt className={styles.fileIcon} />
          <FaSearch className={styles.searchIcon} />
        </div>
        <p className={styles.message}>Quý khách chưa xem sản phẩm nào.</p>
        <button className={styles.continueBtn}>TIẾP TỤC MUA HÀNG</button>
      </div>
    </div>
  );
}
