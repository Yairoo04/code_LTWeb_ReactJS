// app/products/[productId]/BuyNowButton.tsx (Sửa: Đã hoàn chỉnh)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.scss'; // Import styles

export default function BuyNowButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const router = useRouter();

  const handleBuyNow = async () => {
    if (!recipientName || !recipientPhone || !recipientAddress) {
      alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Nếu user login

      const response = await fetch('/api/order/buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          productId,
          quantity: 1, // Mặc định quantity=1, có thể thêm input
          recipientName,
          recipientPhone,
          recipientAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const { data } = await response.json();
      alert('Đơn hàng đã được đặt thành công! Order ID: ' + data.orderId);
      setShowModal(false);
      router.push('/orders'); // Redirect đến trang đơn hàng (giả định có route /orders)
    } catch (error) {
      alert('Lỗi khi đặt hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        MUA NGAY
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Thông tin giao hàng</h2>
            <input
              type="text"
              placeholder="Tên người nhận"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Địa chỉ"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            <button onClick={handleBuyNow} disabled={loading}>
              {loading ? 'Đang đặt hàng...' : 'Xác nhận mua ngay'}
            </button>
            <button onClick={() => setShowModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </>
  );
}