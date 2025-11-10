"use client";
import styles from "./DonHangPage.module.scss";

export default function DonHangPage() {
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Quản lý đơn hàng</h2>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${styles.active}`}>Tất cả</button>
        <button className={styles.tabBtn}>Chờ xử lý</button>
        <button className={styles.tabBtn}>Đang xử lý</button>
        <button className={styles.tabBtn}>Đang giao</button>
        <button className={styles.tabBtn}>Đã giao</button>
        <button className={styles.tabBtn}>Hoàn thành</button>
        <button className={styles.tabBtn}>Đã hủy</button>
      </div>

      {/* Search */}
      <div className={styles.searchRow}>
        <input
          type="text"
          placeholder="Tìm đơn hàng theo Mã đơn hàng"
          className={styles.searchInput}
        />
        <button className={styles.searchBtn}>Tìm đơn hàng</button>
      </div>

      {/* Content */}
      <div className={styles.orderList}>
        <p>Chưa có đơn hàng nào.</p>
      </div>
    </div>
  );
}
