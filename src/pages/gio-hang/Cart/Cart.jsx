'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Cart.module.scss';
import ContainerFluid from '../../main_Page/ContainerFluid/container-fluid';

// GỬI SỰ KIỆN MỞ MODAL ĐĂNG NHẬP 
const openLoginModal = () => {
  window.dispatchEvent(new CustomEvent('open-login-modal'));
};

// Kiểm tra GUID
const isValidGuid = (str) =>
  typeof str === 'string' &&
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(str);

// Tạo UniqueId = CartItemId|ProductId
const makeUniqueId = (cartItemId, productId) => `${cartItemId}|${productId}`;

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [token, setToken] = useState('');

  const router = useRouter();

  // HÀM FETCH CÓ XỬ LÝ 401 – TỰ ĐỘNG MỞ MODAL ĐĂNG NHẬP
  const fetchWithAuth = async (url, options = {}) => {
    const currentToken = localStorage.getItem('token') || token;
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      cache: 'no-store',
    });

    if (res.status === 401) {
      // Token hết hạn → xóa và mở modal ngay
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      setToken('');
      openLoginModal(); // MỞ MODAL ĐĂNG NHẬP TRÊN HEADER
      throw new Error('Phiên đăng nhập đã hết hạn');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi kết nối server');
    }

    return res;
  };

  // Lấy cartId + token
  useEffect(() => {
    const id = localStorage.getItem('cartId');
    const currentToken = localStorage.getItem('token');
    setToken(currentToken || '');

    if (id && isValidGuid(id)) {
      setCartId(id);
    } else {
      setLoading(false);
    }
  }, []);

  // Load giỏ hàng
  const loadCart = useCallback(async () => {
    if (!cartId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchWithAuth(`/api/carts/view?cartId=${cartId}`);

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Lỗi tải giỏ hàng');

      // Cập nhật cartId nếu merge
      if (data.cartId && data.cartId !== cartId) {
        localStorage.setItem('cartId', data.cartId);
        setCartId(data.cartId);
      }

      const items = data.items.map((item) => {
        let imageUrl = '/images/placeholder.png';
        if (item.ImageUrl) {
          try {
            const arr = JSON.parse(item.ImageUrl);
            if (Array.isArray(arr) && arr.length > 0) imageUrl = arr[0];
          } catch (e) {
            if (typeof item.ImageUrl === 'string' && item.ImageUrl.startsWith('/')) {
              imageUrl = item.ImageUrl;
            }
          }
        }

        return {
          CartItemId: item.CartItemId,
          ProductId: item.ProductId,
          UniqueId: makeUniqueId(item.CartItemId, item.ProductId),
          ProductName: item.ProductName || 'Sản phẩm',
          ImageUrl: imageUrl,
          PriceAtAdded: Number(item.PriceAtAdded || 0),
          Quantity: Number(item.Quantity || 1),
          LineTotal: Number(item.LineTotal || item.PriceAtAdded * item.Quantity),
          Stock: Number(item.Stock || 0),
        };
      });

      setCartItems(items);

      // Khôi phục selected
      const saved = localStorage.getItem('cartSelectedUniqueIds');
      let restored = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            restored = parsed.filter((uid) =>
              items.some((i) => i.UniqueId === uid)
            );
          }
        } catch { }
      }
      setSelectedItems(restored);
      setSelectAll(restored.length === items.length && items.length > 0);
      localStorage.setItem('cartSelectedUniqueIds', JSON.stringify(restored));
    } catch (err) {
      console.error('Lỗi load giỏ hàng:', err);
      if (err.message.includes('hết hạn')) {
        // Đã mở modal rồi → không alert thêm
        setCartItems([]);
      } else {
        alert(err.message || 'Không thể tải giỏ hàng');
      }
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Chọn/bỏ chọn
  const toggleSelect = (uniqueId) => {
    setSelectedItems((prev) => {
      const updated = prev.includes(uniqueId)
        ? prev.filter((x) => x !== uniqueId)
        : [...prev, uniqueId];
      localStorage.setItem('cartSelectedUniqueIds', JSON.stringify(updated));
      setSelectAll(updated.length === cartItems.length && cartItems.length > 0);
      return updated;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      localStorage.setItem('cartSelectedUniqueIds', '[]');
      setSelectAll(false);
    } else {
      const all = cartItems.map((i) => i.UniqueId);
      setSelectedItems(all);
      localStorage.setItem('cartSelectedUniqueIds', JSON.stringify(all));
      setSelectAll(true);
    }
  };

  // Cập nhật số lượng
  const updateQuantity = async (cartItemId, productId, newQty) => {
    const item = cartItems.find((i) => i.CartItemId === cartItemId);
    if (!item) return;

    if (newQty > item.Stock) {
      alert(`Chỉ còn ${item.Stock} sản phẩm "${item.ProductName}" trong kho!`);
      return;
    }

    if (newQty < 1) {
      return removeItem(cartItemId, productId);
    }
    setUpdatingId(cartItemId);
    try {
      await fetchWithAuth('/api/carts/update', {
        method: 'POST',
        body: JSON.stringify({ cartId, productId, quantity: newQty }),
      });

      setCartItems((prev) =>
        prev.map((i) =>
          i.CartItemId === cartItemId
            ? { ...i, Quantity: newQty, LineTotal: i.PriceAtAdded * newQty }
            : i
        )
      );
    } catch (err) {
      if (!err.message.includes('hết hạn')) {
        alert(err.message || 'Cập nhật thất bại');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Xóa món
  const removeItem = async (cartItemId, productId) => {
    if (!confirm('Xóa sản phẩm này khỏi giỏ hàng?')) return;

    setUpdatingId(cartItemId);
    try {
      await fetchWithAuth('/api/carts/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId, productId }),
      });

      const uid = makeUniqueId(cartItemId, productId);
      setCartItems((prev) => prev.filter((i) => i.UniqueId !== uid));
      setSelectedItems((prev) => {
        const filtered = prev.filter((x) => x !== uid);
        localStorage.setItem('cartSelectedUniqueIds', JSON.stringify(filtered));
        return filtered;
      });
      setSelectAll(false);
    } catch (err) {
      if (!err.message.includes('hết hạn')) {
        alert(err.message || 'Xóa thất bại');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Thanh toán – BÂY GIỜ ĐÃ TỰ ĐỘNG MỞ MODAL NẾU CHƯA ĐĂNG NHẬP
  const handleCheckout = () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      openLoginModal(); // MỞ MODAL THAY VÌ ALERT + REDIRECT
      return;
    }

    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    const checkoutData = cartItems
      .filter((i) => selectedItems.includes(i.UniqueId))
      .map((i) => ({
        CartItemId: i.CartItemId,
        ProductId: i.ProductId,
        ProductName: i.ProductName,
        Quantity: i.Quantity,
        PriceAtAdded: i.PriceAtAdded,
        LineTotal: i.LineTotal,
        ImageUrl: i.ImageUrl,
      }));

    const encoded = encodeURIComponent(JSON.stringify(checkoutData));
    router.push(`/thong-tin-dat-hang?items=${encoded}`);
  };

  const selectedTotal = cartItems
    .filter((i) => selectedItems.includes(i.UniqueId))
    .reduce((sum, i) => sum + i.LineTotal, 0);

  const selectedCount = selectedItems.length;

  if (loading) {
    return (
      <main className={styles.wrapperMain_content}>
        <ContainerFluid>
          <div className={styles.loadingCart}>
            <div className={styles.spinner}></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        </ContainerFluid>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className={styles.wrapperMain_content}>
        <div className={styles.cartBox}>
          <ContainerFluid>
            <div className={styles.breadcrumbCart}>
              <Link href="/" className={styles.backLink}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10.5 12L5.5 8L10.5 4" stroke="#1982F9" strokeWidth="1.5" />
                </svg>
                Mua thêm sản phẩm khác
              </Link>
            </div>
            <div className={styles.cardMain}>
              <section className={styles.sectionSteps}>
                <div className={styles.progressBar}>
                  {[
                    { icon: 'cart', text: 'Giỏ hàng', active: true },
                    { icon: 'info', text: 'Thông tin đặt hàng' },
                    { icon: 'payment', text: 'Thanh toán' },
                    { icon: 'done', text: 'Hoàn tất' },
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
                            <circle cx="14.4" cy="14" r="14" fill="#535353" />
                            <path d="M20.0009 9H8.80088C8.02878 9 7.40088 9.56062 7.40088 10.25V17.75C7.40088 18.4394 8.02878 19 8.80088 19H20.0009C20.773 19 21.4009 18.4394 21.4009 17.75V10.25C21.4009 9.56062 20.773 9 20.0009 9ZM12.1014 11.5C12.9071 11.5 13.5014 12.0306 13.5014 12.75C13.5014 13.4694 12.9071 14 12.1014 14C11.2957 14 10.7014 13.4694 10.7014 12.75C10.7014 12.0306 11.295 11.5 12.1014 11.5ZM14.7019 16.5H9.50088V16.2094C9.50088 15.3512 10.6741 14.4688 12.1014 14.4688C13.5287 14.4688 14.7019 15.3512 14.7019 16.2094V16.5ZM19.3009 15.875H16.5009V14.625H19.3009V15.875ZM19.3009 13.375H15.8009V12.125H19.3009V13.375Z" fill="white" />
                          </svg>
                        )}
                        {step.icon === 'payment' && (
                          <svg viewBox="0 0 29 28" fill="none">
                            <circle cx="14.17" cy="14" r="14" fill="#535353" />
                            <path d="M7.16553 10.6667C7.16553 10.2246 7.34987 9.80072 7.678 9.48816C8.00614 9.17559 8.45118 9 8.91523 9H19.4134C19.8775 9 20.3225 9.17559 20.6507 9.48816C20.9788 9.80072 21.1631 10.2246 21.1631 10.6667V11.5H7.16553V10.6667ZM7.16553 13.1667V17.3333C7.16553 17.7754 7.34987 18.1993 7.678 18.5118C8.00614 18.8244 8.45118 19 8.91523 19H19.4134C19.8775 19 20.3225 18.8244 20.6507 18.5118C20.9788 18.1993 21.1631 17.7754 21.1631 17.3333V13.1667H7.16553ZM9.79008 14.8333H10.6649C10.897 14.8333 11.1195 14.9211 11.2835 15.0774C11.4476 15.2337 11.5398 15.4457 11.5398 15.6667V16.5C11.5398 16.721 11.4476 16.933 11.2835 17.0893C11.1195 17.2455 10.897 17.3333 10.6649 17.3333H9.79008C9.55805 17.3333 9.33553 17.2455 9.17147 17.0893C9.0074 16.933 8.91523 16.721 8.91523 16.5V15.6667C8.91523 15.4457 9.0074 15.2337 9.17147 15.0774C9.33553 14.9211 9.55805 14.8333 9.79008 14.8333Z" fill="white" />
                          </svg>
                        )}
                        {step.icon === 'done' && (
                          <svg viewBox="0 0 29 28" fill="none">
                            <circle cx="14.43" cy="14" r="13.5" stroke="#535353" />
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
                  <div className={styles.emptyCart}>
                    <p>Giỏ hàng của bạn đang trống!</p>
                    <Link href="/collections/all" className={styles.continueButton}>
                      Tiếp tục mua hàng
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </ContainerFluid>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.wrapperMain_content}>
      <div className={styles.cartBox}>
        <ContainerFluid>
          <div className={styles.breadcrumbCart}>
            <Link href="/" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10.5 12L5.5 8L10.5 4" stroke="#1982F9" strokeWidth="1.5" />
              </svg>
              Mua thêm sản phẩm khác
            </Link>
          </div>

          <div className={styles.cardMain}>
            {/* Progress bar giữ nguyên hoàn toàn như code gốc của bạn */}
            <section className={styles.sectionSteps}>
              <div className={styles.progressBar}>
                {[
                  { icon: 'cart', text: 'Giỏ hàng', active: true },
                  { icon: 'info', text: 'Thông tin đặt hàng' },
                  { icon: 'payment', text: 'Thanh toán' },
                  { icon: 'done', text: 'Hoàn tất' },
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
                          <circle cx="14.4" cy="14" r="14" fill="#535353" />
                          <path d="M20.0009 9H8.80088C8.02878 9 7.40088 9.56062 7.40088 10.25V17.75C7.40088 18.4394 8.02878 19 8.80088 19H20.0009C20.773 19 21.4009 18.4394 21.4009 17.75V10.25C21.4009 9.56062 20.773 9 20.0009 9ZM12.1014 11.5C12.9071 11.5 13.5014 12.0306 13.5014 12.75C13.5014 13.4694 12.9071 14 12.1014 14C11.2957 14 10.7014 13.4694 10.7014 12.75C10.7014 12.0306 11.295 11.5 12.1014 11.5ZM14.7019 16.5H9.50088V16.2094C9.50088 15.3512 10.6741 14.4688 12.1014 14.4688C13.5287 14.4688 14.7019 15.3512 14.7019 16.2094V16.5ZM19.3009 15.875H16.5009V14.625H19.3009V15.875ZM19.3009 13.375H15.8009V12.125H19.3009V13.375Z" fill="white" />
                        </svg>
                      )}
                      {step.icon === 'payment' && (
                        <svg viewBox="0 0 29 28" fill="none">
                          <circle cx="14.17" cy="14" r="14" fill="#535353" />
                          <path d="M7.16553 10.6667C7.16553 10.2246 7.34987 9.80072 7.678 9.48816C8.00614 9.17559 8.45118 9 8.91523 9H19.4134C19.8775 9 20.3225 9.17559 20.6507 9.48816C20.9788 9.80072 21.1631 10.2246 21.1631 10.6667V11.5H7.16553V10.6667ZM7.16553 13.1667V17.3333C7.16553 17.7754 7.34987 18.1993 7.678 18.5118C8.00614 18.8244 8.45118 19 8.91523 19H19.4134C19.8775 19 20.3225 18.8244 20.6507 18.5118C20.9788 18.1993 21.1631 17.7754 21.1631 17.3333V13.1667H7.16553ZM9.79008 14.8333H10.6649C10.897 14.8333 11.1195 14.9211 11.2835 15.0774C11.4476 15.2337 11.5398 15.4457 11.5398 15.6667V16.5C11.5398 16.721 11.4476 16.933 11.2835 17.0893C11.1195 17.2455 10.897 17.3333 10.6649 17.3333H9.79008C9.55805 17.3333 9.33553 17.2455 9.17147 17.0893C9.0074 16.933 8.91523 16.721 8.91523 16.5V15.6667C8.91523 15.4457 9.0074 15.2337 9.17147 15.0774C9.33553 14.9211 9.55805 14.8333 9.79008 14.8333Z" fill="white" />
                        </svg>
                      )}
                      {step.icon === 'done' && (
                        <svg viewBox="0 0 29 28" fill="none">
                          <circle cx="14.43" cy="14" r="13.5" stroke="#535353" />
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
                  <div className={styles.headerRow}>
                    <label className={styles.selectAll}>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                      />
                      <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
                    </label>
                    <span className={styles.selectedCount}>Đã chọn: {selectedCount}</span>
                  </div>

                  <div className={styles.itemsList}>
                    {cartItems.map((item) => (
                      <div key={item.UniqueId} className={styles.cartItem}>
                        <div className={styles.itemCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.UniqueId)}
                            onChange={() => toggleSelect(item.UniqueId)}
                          />
                        </div>

                        <div className={styles.itemImage}>
                          <img
                            src={item.ImageUrl}
                            alt={item.ProductName}
                            onError={(e) => (e.target.src = '/images/placeholder.png')}
                          />
                        </div>

                        <div className={styles.itemInfo}>
                          <h3 className={styles.productName}>{item.ProductName}</h3>
                          <p className={styles.price}>
                            {item.PriceAtAdded.toLocaleString('vi-VN')}đ
                          </p>
                        </div>

                        <div className={styles.itemActions}>
                          <div className={styles.quantityControl}>
                            <button
                              onClick={() => updateQuantity(item.CartItemId, item.ProductId, item.Quantity - 1)}
                              disabled={updatingId === item.CartItemId || item.Quantity <= 1}
                            >
                              −
                            </button>
                            <input type="number" value={item.Quantity} readOnly />
                            <button
                              onClick={() => updateQuantity(item.CartItemId, item.ProductId, item.Quantity + 1)}
                              disabled={updatingId === item.CartItemId || item.Quantity >= item.Stock}
                              style={{ opacity: item.Quantity >= item.Stock ? 0.5 : 1 }}
                            >
                              +
                            </button>
                          </div>
                          <p className={styles.lineTotal}>
                            {item.LineTotal.toLocaleString('vi-VN')}đ
                          </p>

                          <button
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.CartItemId, item.ProductId)}
                            disabled={updatingId === item.CartItemId}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e30019">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.summary}>
                    <div className={styles.totalRow}>
                      <span>Tạm tính ({selectedCount} sản phẩm)</span>
                      <strong>{selectedTotal.toLocaleString('vi-VN')}đ</strong>
                    </div>
                    <button
                      className={styles.checkoutBtn}
                      onClick={handleCheckout}
                      disabled={selectedCount === 0}
                    >
                      TIẾN HÀNH ĐẶT HÀNG
                    </button>
                    <Link href="/" className={styles.continueShopping}>
                      ← Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ContainerFluid>
      </div>
    </main>
  );
}