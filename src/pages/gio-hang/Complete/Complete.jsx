
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Complete.module.scss';

export default function Complete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/dang-nhap');
        return;
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (!res.ok || !result.success || !result.data) {
          throw new Error('Không thể tải đơn hàng');
        }

        const d = result.data;

        // ĐÚNG 100% VỚI BACKEND THẬT CỦA BẠN
        const normalized = {
          orderId: d.orderId,
          recipientName: d.customerName || d.recipientName || 'Khách lẻ',
          recipientPhone: d.phone || d.recipientPhone || '—',
          recipientAddress: d.address || d.recipientAddress || '—',
          totalAmount: Number(d.total || d.totalAmount || 0),

          items: (d.orderItems || d.items || []).map((item, idx) => {
            const product = item.product || {};
            let imageUrl = '/images/placeholder.png';

            try {
              if (product.imageUrl) {
                const arr = JSON.parse(product.imageUrl);
                imageUrl = arr && arr[0] ? arr[0] : imageUrl;
              }
            } catch (e) {}

            return {
              key: item.id || item.cartItemId || idx,
              ProductName: product.name || product.productName || 'Sản phẩm',
              ImageUrl: imageUrl,
              PriceAtAdded: Number(item.price || product.price || 0),
              Quantity: Number(item.quantity || item.qty || 1),
            };
          }),
        };

        setOrderDetails(normalized);
      } catch (err) {
        alert('Lỗi tải đơn hàng: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (!orderId) return null;

  return (
    <main className={styles.wrapperMain_content}>
      <div className={styles.cartBox}>
        <div className={styles.containerFluid}>
          <div className={styles.breadcrumbCart}>
            <Link href="/" className={styles.backLink}>← Quay về trang chủ</Link>
          </div>

          <div className={styles.successHeader}>
            <svg className={styles.successIcon} viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#00bfa5" strokeWidth="4"/>
              <path d="M22 40L34 52L58 28" stroke="#00bfa5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>ĐẶT HÀNG THÀNH CÔNG!</h1>
            <p>Cảm ơn bạn đã tin tưởng mua sắm tại shop</p>
            <p>Mã đơn hàng: <strong>#{orderId}</strong></p>
          </div>

          {loading ? (
            <div className={styles.loadingCart}>
              <div className={styles.spinner}></div>
              <p>Đang tải chi tiết đơn hàng...</p>
            </div>
          ) : (
            orderDetails && (
              <>
                <div className={styles.infoBox}>
                  <h3>Thông tin giao hàng</h3>
                  <div><strong>Người nhận:</strong> {orderDetails.recipientName}</div>
                  <div><strong>Số điện thoại:</strong> {orderDetails.recipientPhone}</div>
                  <div><strong>Địa chỉ:</strong> {orderDetails.recipientAddress}</div>
                  <div><strong>Thanh toán:</strong> Khi nhận hàng (COD)</div>
                </div>

                <div className={styles.itemsList}>
                  <h3>Sản phẩm đã đặt ({orderDetails.items.length})</h3>
                  {orderDetails.items.map(item => (
                    <div key={item.key} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        <img src={item.ImageUrl} alt={item.ProductName} onError={e => e.target.src = '/images/placeholder.png'} />
                      </div>
                      <div className={styles.itemInfo}>
                        <h4>{item.ProductName}</h4>
                        <p>{item.PriceAtAdded.toLocaleString('vi-VN')}đ</p>
                      </div>
                      <div className={styles.itemActions}>
                        <span>× {item.Quantity}</span>
                        <strong>{(item.PriceAtAdded * item.Quantity).toLocaleString('vi-VN')}đ</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.summary}>
                  <div className={styles.totalRow}>
                    <span>Tổng tiền</span>
                    <strong className={styles.finalPrice}>
                      {orderDetails.totalAmount.toLocaleString('vi-VN')}đ
                    </strong>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <Link href="/ho-so/don-hang" className={styles.primaryBtn}>
                    XEM CHI TIẾT ĐƠN HÀNG
                  </Link>
                  <Link href="/" className={styles.secondaryBtn}>
                    TIẾP TỤC MUA SẮM
                  </Link>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </main>
  );
}