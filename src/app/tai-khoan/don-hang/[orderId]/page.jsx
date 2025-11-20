'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../DonHangPage.module.scss';
import { getAuth } from '../../../../lib/auth';

// ICONS SVG
const IconCalendar = () => (
  <svg className={styles.infoIcon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const IconTruck = () => (
  <svg className={styles.infoIcon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
  </svg>
);

const IconUser = () => (
  <svg className={styles.infoIcon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const IconPhone = () => (
  <svg className={styles.infoIcon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const IconMapPin = () => (
  <svg className={styles.infoIcon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

// Trạng thái
const STATUS_MAP = {
  Pending: "Chờ xử lý",
  Processing: "Đang xử lý",
  Shipping: "Đang giao",
  Delivered: "Đã giao",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
};

const getVietnameseStatus = (status) => STATUS_MAP[status] || status;

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

export default function DonHangDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false); // trạng thái đang hủy
  const { token } = getAuth();

  useEffect(() => {
    if (!token) {
      window.dispatchEvent(new Event('auth-open-login'));
      return;
    }

    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Không tìm thấy đơn hàng");

        setOrder(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, token, router]);

  // === HỦY ĐƠN HÀNG ===
  const handleCancelOrder = async () => {
    if (cancelling) return;

    const confirm = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?");
    if (!confirm) return;

    setCancelling(true);
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: Number(orderId) }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Hủy đơn thất bại");
      }

      // Cập nhật trạng thái đơn hàng
      setOrder({
        ...order,
        orderInfo: { ...order.orderInfo, StatusName: 'Cancelled' }
      });

      alert("Đơn hàng đã được hủy thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>Lỗi: {error}</div>;
  if (!order) return <div className={styles.empty}>Không tìm thấy đơn hàng</div>;

  const { orderInfo, items } = order;

  // === KIỂM TRA CÓ ĐƯỢC HỦY KHÔNG? ===
  const canCancel = ['Pending', 'Processing'].includes(orderInfo.StatusName);

  return (
    <div className={styles.detailPage}>
      {/* TAG ĐEN + TIÊU ĐỀ */}
      <div className={styles.tagHeader}>
        <h1 className={styles.pageTitle}>
          CHI TIẾT ĐƠN HÀNG <span className={styles.orderNumber}>#{orderInfo.OrderId}</span>
        </h1>
      </div>

      {/* CARD THÔNG TIN */}
      <div className={styles.infoCard}>
        <div className={styles.infoRow}>
          <IconCalendar />
          <div>
            <div className={styles.infoLabel}>NGÀY ĐẶT</div>
            <div className={styles.infoValue}>
              {new Date(orderInfo.CreatedAt).toLocaleString('vi-VN')}
            </div>
          </div>
        </div>

        <div className={styles.infoRow}>
          <IconTruck />
          <div>
            <div className={styles.infoLabel}>TRẠNG THÁI</div>
            <span className={`${styles.status} ${getStatusClass(orderInfo.StatusName)}`}>
              {getVietnameseStatus(orderInfo.StatusName)}
            </span>
          </div>
        </div>

        <div className={styles.infoRow}>
          <IconUser />
          <div>
            <div className={styles.infoLabel}>NGƯỜI NHẬN</div>
            <div className={styles.infoValue}>{orderInfo.RecipientName}</div>
          </div>
        </div>

        <div className={styles.infoRow}>
          <IconPhone />
          <div>
            <div className={styles.infoLabel}>SỐ ĐIỆN THOẠI</div>
            <div className={styles.infoValue}>{orderInfo.RecipientPhone}</div>
          </div>
        </div>

        <div className={styles.infoRow}>
          <IconMapPin />
          <div>
            <div className={styles.infoLabel}>ĐỊA CHỈ GIAO</div>
            <div className={styles.infoValue}>{orderInfo.RecipientAddress}</div>
          </div>
        </div>
      </div>

      {/* BẢNG SẢN PHẨM */}
      <div className={styles.productCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th className={styles.textCenter}>SL</th>
                <th className={styles.textRight}>Đơn giá</th>
                <th className={styles.textRight}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className={styles.productName}>{item.Name}</td>
                  <td className={styles.textCenter}>{item.Quantity}</td>
                  <td className={styles.textRight}>{Number(item.Price).toLocaleString()}đ</td>
                  <td className={`${styles.textRight} ${styles.priceBold}`}>
                    {(item.Quantity * item.Price).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TỔNG TIỀN */}
      <div className={styles.totalCard}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>TỔNG CỘNG</span>
          <span className={styles.totalPrice}>
            {Number(orderInfo.TotalAmount).toLocaleString()}đ
          </span>
        </div>
      </div>

      {/* NÚT HÀNH ĐỘNG – CÙNG HÀNG */}
      <div className={styles.footerAction}>
        {canCancel && (
          <button
            className={`${styles.cancelBtn} ${cancelling ? styles.disabled : ''}`}
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
          </button>
        )}
        <button className={styles.backBtn} onClick={() => router.back()}>
          Quay lại
        </button>
      </div>
    </div>
  );
}