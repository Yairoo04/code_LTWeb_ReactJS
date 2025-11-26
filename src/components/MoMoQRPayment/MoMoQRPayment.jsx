// src/components/MoMoQRPayment/MoMoQRPayment.jsx
'use client';

import { useEffect } from 'react';
import styles from './MoMoQRPayment.module.scss';

export default function MoMoQRPayment({ payUrl, currentOrderId, totalAmount, onBack }) {
  useEffect(() => {
    if (!payUrl) return;

    const timer = setTimeout(() => {
      window.location.href = payUrl;
    }, 800); // delay nhẹ 0.8s để người dùng thấy QR trước (rất đẹp UX)

    return () => clearTimeout(timer);
  }, [payUrl]);

  // Tính tiền đẹp hơn
  const formattedAmount = totalAmount.toLocaleString('vi-VN');

  return (
    <div className={styles.container}>
      {/* Phần QR + hướng dẫn */}
      <div className={styles.content}>
        <div className={styles.header}>
          <img src="/images/banks/momo.jpg" alt="MoMo" className={styles.momoLogo} />
          <h2>Thanh toán bằng MoMo</h2>
        </div>

        <div className={styles.qrBox}>
          <div className={styles.qrPlaceholder}>
            <div className={styles.scanIcon}>
              <svg viewBox="0 0 120 120" fill="none">
                <rect x="10" y="10" width="40" height="40" stroke="#E3007E" strokeWidth="8" />
                <rect x="70" y="10" width="40" height="40" stroke="#E3007E" strokeWidth="8" />
                <rect x="10" y="70" width="40" height="40" stroke="#E3007E" strokeWidth="8" />
                <path d="M60 40 L60 80 M40 60 L80 60" stroke="#E3007E" strokeWidth="6" />
              </svg>
            </div>
            <p className={styles.scanText}>Mở app MoMo<br />để quét mã QR</p>
          </div>
        </div>

        <div className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span>Mã đơn hàng</span>
            <strong>#{currentOrderId}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Số tiền thanh toán</span>
            <strong className={styles.amount}>{formattedAmount}đ</strong>
          </div>
        </div>

        <div className={styles.countdown}>
          <p>Đang chuyển sang MoMo...</p>
        </div>
      </div>

      {/* Nút quay lại (vẫn để lại cho trường hợp cần) */}
      <div className={styles.backBtnWrapper}>
        <button onClick={onBack} className={styles.backBtn}>
          ← Quay lại
        </button>
      </div>

      {/* Ẩn iframe thật để tránh lỗi CORS (vẫn giữ cho fallback nếu cần) */}
      <iframe
        src={payUrl}
        style={{ position: 'absolute', width: 1, height: 1, border: 0, opacity: 0 }}
        title="MoMo Payment"
      />
    </div>
  );
}