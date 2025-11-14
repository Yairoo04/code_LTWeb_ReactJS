'use client';

import { useEffect, useState } from 'react';
import styles from './DonHangPage.module.scss';
import { getAuth } from '../../../lib/auth';
import Link from 'next/link';

const STATUS_MAP = {
  Pending: "Chờ xử lý",
  Processing: "Đang xử lý",
  Shipping: "Đang giao",
  Delivered: "Đã giao",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
};

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ xử lý' },
  { key: 'Processing', label: 'Đang xử lý' },
  { key: 'Shipping', label: 'Đang giao' },
  { key: 'Delivered', label: 'Đã giao' },
  { key: 'Completed', label: 'Hoàn thành' },
  { key: 'Cancelled', label: 'Đã hủy' },
];

const getStatusClass = (status) => {
  const map = {
    Pending: styles.statusPending,
    Processing: styles.statusProcessing,
    Shipping: styles.statusShipping,
    Delivered: styles.statusDelivered,
    Completed: styles.statusCompleted,
    Cancelled: styles.statusCancelled,
  };
  return map[status] || styles.statusDefault;
};

const getVietnameseStatus = (status) => STATUS_MAP[status] || status;

export default function DonHangPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchCode, setSearchCode] = useState(''); // SỬA: tên biến đúng
  const [page, setPage] = useState(1);
  const limit = 4;
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const { token } = getAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchOrders = async () => {
    if (!token || !isClient) return;

    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (activeTab !== 'all') params.set('status', activeTab);
      if (searchCode.trim()) params.set('search', searchCode.trim());

      const res = await fetch(`/api/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Lỗi ${res.status}`);

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Lỗi server");

      const fetchedOrders = Array.isArray(data.data?.orders) ? data.data.orders : [];
      const newPagination = data.data?.pagination || { totalPages: 1, total: 0 };

      setOrders(fetchedOrders);
      setPagination(newPagination);

    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
      alert(err.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // GỌI LẠI KHI THAY ĐỔI TAB, TÌM KIẾM, TRANG
  useEffect(() => {
    if (isClient && token) {
      fetchOrders();
    }
  }, [page, activeTab, searchCode, isClient, token]);

  // RESET TRANG KHI ĐỔI TAB HOẶC TÌM KIẾM
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    // fetchOrders sẽ tự chạy nhờ useEffect
  };

  if (!isClient) return <p className={styles.loading}>Đang tải...</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Quản lý đơn hàng</h2>

      {/* TAB TRẠNG THÁI */}
      <div className={styles.tabs}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TÌM KIẾM */}
      <form onSubmit={handleSearch} className={styles.searchRow}>
        <input
          type="text"
          placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
          value={searchCode} // SỬA: dùng searchCode
          onChange={(e) => setSearchCode(e.target.value)} // SỬA: setSearchCode
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          Tìm
        </button>
      </form>

      {/* NỘI DUNG */}
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Đang tải...</p>
        ) : orders.length === 0 ? (
          <p className={styles.empty}>Chưa có đơn hàng nào</p>
        ) : (
          <>
            <div className={styles.orderGrid}>
              {orders.map(order => (
                <div key={order.OrderId} className={styles.orderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderCode}>#{order.OrderId}</span>
                    <span className={`${styles.status} ${getStatusClass(order.StatusName)}`}>
                      {getVietnameseStatus(order.StatusName)}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <p><strong>Số lượng:</strong> {order.ItemCount || 0} sản phẩm</p>
                    <p><strong>Tổng tiền:</strong> {Number(order.TotalAmount).toLocaleString()}đ</p>
                    <p><strong>Ngày đặt:</strong> {new Date(order.CreatedAt).toLocaleString('vi-VN')}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <Link href={`/tai-khoan/don-hang/${order.OrderId}`} className={styles.viewBtn}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* PHÂN TRANG */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={styles.pageBtn}
                >
                  Trước
                </button>
                <span className={styles.pageInfo}>
                  Trang {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className={styles.pageBtn}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}