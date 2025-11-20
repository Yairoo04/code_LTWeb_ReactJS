'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPhone, faStore, faTruck, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';
import config from '../../config';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import styles from './Header.module.scss';
import { FaUser, FaBoxOpen, FaSignOutAlt } from 'react-icons/fa';
import SearchBox from '../Search/SearchBox';

// HÀM KIỂM TRA GUID HỢP LỆ – BẢO VỆ TUYỆT ĐỐI localStorage
const isValidGuid = (str) => {
  return typeof str === 'string' && /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(str);
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const headerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleUserMenuEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleUserMenuLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  // Tô đậm menu showroom
  useEffect(() => {
    document.querySelectorAll('#menu-list-showroom li a').forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      link.parentElement.classList.toggle('active', pathname === linkPath);
    });
  }, [pathname]);

  // CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG – ĐÃ FIX 100% KHÔNG LÀM MẤT USER
  const updateCartCount = useCallback(async () => {
    try {
      let cartId = localStorage.getItem('cartId');
      if (cartId && !isValidGuid(cartId)) {
        console.warn('cartId không hợp lệ → xóa để tạo mới');
        localStorage.removeItem('cartId');
        cartId = null;
      }

      const url = cartId ? `/api/carts?cartId=${cartId}` : '/api/carts';
      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.warn('Cart API lỗi:', response.status);
        setCartCount(0);
        return;
      }

      const json = await response.json();
      const data = json?.data || json?.cart || json || {};

      // Tính tổng số lượng
      let count = 0;
      if (data.totalQuantity !== undefined) {
        count = data.totalQuantity;
      } else if (Array.isArray(data.items)) {
        count = data.items.reduce((sum, item) => sum + (item.Quantity || item.quantity || 0), 0);
      }

      setCartCount(count);

      // CHỈ LƯU cartId NẾU LÀ GUID HỢP LỆ → TUYỆT ĐỐI KHÔNG GHI ĐÈ BẰNG NULL!
      if (data.cartId && isValidGuid(data.cartId)) {
        localStorage.setItem('cartId', data.cartId);
      }

    } catch (err) {
      console.error('Lỗi lấy số lượng giỏ hàng:', err);
      setCartCount(0);
    }
  }, []);

  // Cập nhật khi có sự kiện từ các trang khác
  useEffect(() => {
    const handler = () => updateCartCount();
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, [updateCartCount]);

  // Load giỏ hàng khi mount + khi user thay đổi
  useEffect(() => {
    updateCartCount();
  }, [user, updateCartCount]);

  // Login thành công
  const handleLoginSuccess = (userData) => {
    const realUserId = userData.id || userData._id || userData.userId || userData.customerId;
    const name = (userData.fullname || userData.name || userData.email || 'Người dùng').trim();

    localStorage.setItem('user', JSON.stringify({ ...userData, name }));
    if (userData.token) localStorage.setItem('token', userData.token);
    if (realUserId) localStorage.setItem('userId', String(realUserId));

    setUser({ ...userData, name });
    setIsLoginOpen(false);
    updateCartCount();
  };



  // Load user khi mount
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const name = (parsed.fullname || parsed.name || parsed.email || 'Người dùng').trim();
        setUser({ ...parsed, name });
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Đăng xuất
  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartId');

    setUser(null);
    setCartCount(0);
    setShowLogoutModal(false);
    router.push('/');
  };

  // Sticky header
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={styles.mainHeader}>
      <div className={styles.topBanner}>
        <ContainerFluid>
          <img src="/images/top-banner.gif" alt="Top Banner" className={styles.bannerImg} />
        </ContainerFluid>
      </div>

      <div ref={headerRef} className={`${styles.headerTop} ${isSticky ? styles.sticky : ''}`}>
        <ContainerFluid>
          <div className={styles.headerInner}>
            <Link href={config.routes.home} className={styles.logo}>
              <img src="/images/logo.jpg" alt="GTN" />
            </Link>

            <div className={styles.categoryMenu}>
              <FontAwesomeIcon icon={faBars} />
              <span>Danh mục</span>
            </div>

            <div className={styles.searchWrapper}>
              <SearchBox />
            </div>

            <div className={styles.hotline}>
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <span>Hotline</span>
                <strong>1900.5301</strong>
              </div>
            </div>

            <Link href={config.routes.showroom} className={styles.showroom}>
              <FontAwesomeIcon icon={faStore} />
              <div>
                <span>Hệ thống</span>
                <strong>Showroom</strong>
              </div>
            </Link>

            <Link href="/tai-khoan/don-hang" className={styles.trackOrder}>
              <div className={styles.trackIcon}>
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <div>
                <span>Tra cứu</span>
                <strong>đơn hàng</strong>
              </div>
            </Link>

            <Link href={config.routes.cart} className={styles.cart}>
              <div className={styles.cartIcon}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
              </div>
              <div>
                <span>Giỏ</span>
                <strong>hàng</strong>
              </div>
            </Link>

            <div className={styles.account}>
              {!user ? (
                <button onClick={() => setIsLoginOpen(true)} className={styles.loginBtn}>
                  <FontAwesomeIcon icon={faUser} />
                  <div>
                    <span>Đăng</span>
                    <strong>nhập</strong>
                  </div>
                </button>
              ) : (
                <div
                  className={styles.userMenu}
                  onMouseEnter={handleUserMenuEnter}
                  onMouseLeave={handleUserMenuLeave}
                >
                  <span className={styles.userGreeting}>
                    <span className={styles.greetingBox}>
                      <span className={styles.wave}>👋</span>
                      <div className={styles.textWrapper}>
                        <span className={styles.helloText}>Xin chào</span>
                        <strong className={styles.username}>{user.name || 'Người dùng'}</strong>
                      </div>
                    </span>
                  </span>

                  {/* LUÔN render, chỉ bật/tắt class .open */}
                  <div className={`${styles.dropdown} ${dropdownOpen ? styles.open : ''}`}>
                    <Link href="/tai-khoan/thong-tin" className={styles.dropdownItem}>
                      <FaUser className={styles.icon} /> Thông tin tài khoản
                    </Link>
                    <Link href="/tai-khoan/don-hang" className={styles.dropdownItem}>
                      <FaBoxOpen className={styles.icon} /> Đơn hàng của tôi
                    </Link>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => {
                        setShowLogoutModal(true);
                        setDropdownOpen(false);
                      }}
                    >
                      <FaSignOutAlt className={styles.icon} /> Đăng xuất
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ContainerFluid>
      </div>

      <div className={`${styles.headerPlaceholder} ${isSticky ? styles.active : ''}`} style={{ height: isSticky ? `${headerHeight}px` : '0' }} />

      {/* Modal xác nhận đăng xuất */}
      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <p>Bạn muốn thoát tài khoản?</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowLogoutModal(false)} className={styles.cancelBtn}>Không</button>
              <button onClick={confirmLogout} className={styles.confirmBtn}>Đồng ý</button>
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} />
    </header>
  );
}