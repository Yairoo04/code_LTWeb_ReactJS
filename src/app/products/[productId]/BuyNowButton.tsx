// app/products/[productId]/BuyNowButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './ProductDetail.module.scss';

export default function BuyNowButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const router = useRouter();

  const handleBuyNow = async () => {
    if (!recipientName || !recipientPhone || !recipientAddress) {
      alert('Vui lòng nhập thông tin giao hàng!');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch('/api/orders/buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          recipientName,
          recipientPhone,
          recipientAddress
        })
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || json.message);
      }

      const orderId = json.data.orderId;

      router.push(`/hoan-tat?orderId=${orderId}`);
    } catch (err: any) {
      alert("Lỗi mua ngay: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>MUA NGAY</button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>

            <h2>Thông tin giao hàng</h2>

            <input
              placeholder="Tên người nhận"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
            />
            <input
              placeholder="Số điện thoại"
              value={recipientPhone}
              onChange={e => setRecipientPhone(e.target.value)}
            />
            <input
              placeholder="Địa chỉ"
              value={recipientAddress}
              onChange={e => setRecipientAddress(e.target.value)}
            />

            <button
              className={styles.confirmBtn}
              disabled={loading}
              onClick={handleBuyNow}
            >
              {loading ? "Đang xử lý..." : "XÁC NHẬN MUA NGAY"}
            </button>
          </div>
        </div>
      )}

    </>
  );
}
