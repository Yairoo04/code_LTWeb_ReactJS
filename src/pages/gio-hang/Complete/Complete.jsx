'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Complete.module.scss';

// GỬI SỰ KIỆN MỞ MODAL ĐĂNG NHẬP 
const openLoginModal = () => {
  window.dispatchEvent(new CustomEvent('open-login-modal'));
};

export default function Complete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // HÀM FETCH CÓ XỬ LÝ 401 
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      openLoginModal();
      throw new Error('Chưa đăng nhập');
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (res.status === 401) {
      // Token hết hạn → xóa + mở modal
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      openLoginModal();
      throw new Error('Phiên đăng nhập đã hết hạn');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi kết nối server');
    }

    return res;
  };

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);

        const res = await fetchWithAuth(`/api/orders/order-cart/${orderId}`);
        const result = await res.json();

        if (!result.success || !result.data) {
          throw new Error(result.message || 'Không thể tải đơn hàng');
        }

        const d = result.data;

        const normalized = {
          orderId: d.OrderId,
          recipientName: d.RecipientName || 'Khách lẻ',
          recipientPhone: d.RecipientPhone || '—',
          recipientAddress: d.RecipientAddress || '—',
          totalAmount: Number(d.TotalAmount || 0),
          items: (d.items || []).map((item, idx) => ({
            key: item.ProductId || idx,
            ProductName: item.ProductName || 'Sản phẩm',
            ImageUrl: item.ImageUrl || '/images/placeholder.png',
            PriceAtAdded: Number(item.Price || 0),
            Quantity: Number(item.Quantity || 1),
          })),
        };

        setOrderDetails(normalized);
      } catch (err) {
        console.error('Lỗi tải chi tiết đơn hàng:', err);

        // Nếu là lỗi token → đã mở modal rồi → không alert thêm
        if (!err.message.includes('hết hạn') && !err.message.includes('Chưa đăng nhập')) {
          alert('Không thể tải chi tiết đơn hàng. Vui lòng đăng nhập lại để xem.');
        }

        // Vẫn hiển thị thông tin cơ bản dù không load được chi tiết
        setOrderDetails({
          orderId,
          recipientName: 'Đang tải...',
          recipientPhone: '—',
          recipientAddress: '—',
          totalAmount: 0,
          items: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (!orderId) return null;

  const steps = [
    { key: 'cart', text: 'Giỏ hàng', completed: true },
    { key: 'info', text: 'Thông tin đặt hàng', completed: true },
    { key: 'payment', text: 'Thanh toán', completed: true },
    { key: 'done', text: 'Hoàn tất', active: true },
  ];

  return (
    <main className={styles.wrapperMain_content}>
      <div className={styles.cartBox}>
        <div className={styles.containerFluid}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbCart}>
            <Link href="/" className={styles.backLink}>← Quay về trang chủ</Link>
          </div>

          {/* Progress Bar */}
          <section className={styles.sectionSteps}>
            <div className={styles.progressBar}>
              {[
                { icon: 'cart', text: 'Giỏ hàng', completed: true },
                { icon: 'info', text: 'Thông tin đặt hàng', completed: true },
                { icon: 'payment', text: 'Thanh toán', completed: true },
                { icon: 'done', text: 'Hoàn tất', active: true },
              ].map((step, i) => (
                <div key={i} className={step.completed ? styles.stepCompleted : step.active ? styles.stepActive : styles.step}>
                  <div className={styles.stepIcon}>
                    {step.icon === 'cart' && (
                      <svg viewBox="0 0 29 28" fill="none">
                        <circle cx="14.5" cy="14" r="14" fill="#E30019" />
                        <path d="M21.4353 10.9187C21.3355 10.8254 21.2167 10.7514 21.0859 10.7009C20.9551 10.6505 20.8147 10.6247 20.6731 10.625H18.5192V10.125C18.5192 9.19674 18.1221 8.3065 17.4152 7.65013C16.7084 6.99375 15.7497 6.625 14.75 6.625C13.7503 6.625 12.7916 6.99375 12.0848 7.65013C11.3779 8.3065 10.9808 9.19674 10.9808 10.125V10.625H8.82692C8.54131 10.625 8.26739 10.7304 8.06542 10.9179C7.86346 11.1054 7.75 11.3598 7.75 11.625V18.375C7.75 19.5937 8.86058 20.625 10.1731 20.625H19.3269C19.9618 20.6252 20.5715 20.3947 21.0258 19.9828C21.2543 19.7803 21.4364 19.5369 21.5608 19.2673C21.6853 18.9977 21.7497 18.7074 21.75 18.4141V11.625C21.7504 11.4938 21.7228 11.3638 21.6688 11.2426C21.6148 11.1214 21.5355 11.0113 21.4353 10.9187ZM17.3242 14.1875L14.3088 17.6875C14.2593 17.745 14.1967 17.7915 14.1256 17.824C14.0544 17.8564 13.9764 17.8738 13.8972 17.875H13.8885C13.8107 17.875 13.7338 17.8594 13.6632 17.8292C13.5925 17.7989 13.5298 17.7549 13.4792 17.7L12.1869 16.2975C12.141 16.2476 12.106 16.1898 12.0841 16.1273C12.0622 16.0649 12.0538 15.9991 12.0593 15.9336C12.0648 15.8681 12.0841 15.8043 12.1162 15.7458C12.1482 15.6873 12.1924 15.6352 12.2462 15.5925C12.2999 15.5498 12.3622 15.5174 12.4294 15.4971C12.4966 15.4767 12.5675 15.4689 12.638 15.474C12.7085 15.4791 12.7773 15.497 12.8403 15.5268C12.9033 15.5566 12.9594 15.5976 13.0054 15.6475L13.875 16.5909L16.4835 13.5625C16.5728 13.4589 16.7027 13.3925 16.8447 13.3778C16.9867 13.3632 17.1291 13.4015 17.2407 13.4844C17.3523 13.5673 17.4238 13.6879 17.4396 13.8198C17.4554 13.9516 17.4141 14.0839 17.3249 14.1875H17.3242ZM17.4423 10.625H12.0577V10.125C12.0577 9.46196 12.3413 8.82607 12.8462 8.35723C13.3512 7.88839 14.036 7.625 14.75 7.625C15.464 7.625 16.1488 7.88839 16.6537 8.35723C17.1587 8.82607 17.4423 9.46196 17.4423 10.125V10.625Z" fill="white" />
                      </svg>
                    )}
                    {step.icon === 'info' && (
                      <svg viewBox="0 0 29 28" fill="none">
                        <circle cx="14.4" cy="14" r="14" fill="#E30019" />
                        <path d="M20.0009 9H8.80088C8.02878 9 7.40088 9.56062 7.40088 10.25V17.75C7.40088 18.4394 8.02878 19 8.80088 19H20.0009C20.773 19 21.4009 18.4394 21.4009 17.75V10.25C21.4009 9.56062 20.773 9 20.0009 9ZM12.1014 11.5C12.9071 11.5 13.5014 12.0306 13.5014 12.75C13.5014 13.4694 12.9071 14 12.1014 14C11.2957 14 10.7014 13.4694 10.7014 12.75C10.7014 12.0306 11.295 11.5 12.1014 11.5ZM14.7019 16.5H9.50088V16.2094C9.50088 15.3512 10.6741 14.4688 12.1014 14.4688C13.5287 14.4688 14.7019 15.3512 14.7019 16.2094V16.5ZM19.3009 15.875H16.5009V14.625H19.3009V15.875ZM19.3009 13.375H15.8009V12.125H19.3009V13.375Z" fill="white" />
                      </svg>
                    )}
                    {step.icon === 'payment' && (
                      <svg viewBox="0 0 29 28" fill="none">
                        <circle cx="14.17" cy="14" r="14" fill="#E30019" />
                        <path d="M7.16553 10.6667C7.16553 10.2246 7.34987 9.80072 7.678 9.48816C8.00614 9.17559 8.45118 9 8.91523 9H19.4134C19.8775 9 20.3225 9.17559 20.6507 9.48816C20.9788 9.80072 21.1631 10.2246 21.1631 10.6667V11.5H7.16553V10.6667ZM7.16553 13.1667V17.3333C7.16553 17.7754 7.34987 18.1993 7.678 18.5118C8.00614 18.8244 8.45118 19 8.91523 19H19.4134C19.8775 19 20.3225 18.8244 20.6507 18.5118C20.9788 18.1993 21.1631 17.7754 21.1631 17.3333V13.1667H7.16553ZM9.79008 14.8333H10.6649C10.897 14.8333 11.1195 14.9211 11.2835 15.0774C11.4476 15.2337 11.5398 15.4457 11.5398 15.6667V16.5C11.5398 16.721 11.4476 16.933 11.2835 17.0893C11.1195 17.2455 10.897 17.3333 10.6649 17.3333H9.79008C9.55805 17.3333 9.33553 17.2455 9.17147 17.0893C9.0074 16.933 8.91523 16.721 8.91523 16.5V15.6667C8.91523 15.4457 9.0074 15.2337 9.17147 15.0774C9.33553 14.9211 9.55805 14.8333 9.79008 14.8333Z" fill="white" />
                      </svg>
                    )}
                    {step.icon === 'done' && (
                      <svg viewBox="0 0 29 28" fill="none">
                        <circle cx="14.43" cy="14" r="13.5" stroke="#E30019" />
                        <path d="M13.0988 17.1818L10.4321 14.6364L11.3721 13.7391L13.0988 15.3809L17.4921 11.1873L18.4321 12.0909M14.4321 7L8.43213 9.54545V13.3636C8.43213 16.8955 10.9921 20.1982 14.4321 21C17.8721 20.1982 20.4321 16.8955 20.4321 13.3636V9.54545L14.4321 7Z" fill="#535353" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.stepText}>{step.text}</div>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.sectionOrder}>
            <div className={styles.cartOrder}>
              <div className={styles.cartContent}>
                {/* Success Header */}
                <div className={styles.successHeader}>
                  <svg className={styles.successIcon} viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" stroke="#E30019" strokeWidth="4" />
                    <path d="M24 40L34 50L56 28" stroke="#E30019" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
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
                              <img
                                src={item.ImageUrl}
                                alt={item.ProductName}
                                className={styles.productImage}
                              />
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
                        <Link
                          href={`/tai-khoan/don-hang/${orderId}`}
                          className={`${styles.ctaBtn} ${styles.primaryBtn}`}
                        >
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
          </section>
        </div>
      </div>
    </main>
  );
}
