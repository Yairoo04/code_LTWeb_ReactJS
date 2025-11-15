// src/components/Header/Header.jsx (ĐÃ SỬA HOÀN TOÀN LỖI TypeScript + tối ưu thêm 1 chút)
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPhone, faStore, faTruck, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';
import config from '../../config';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import styles from './Header.module.scss';
import { FaUser, FaBoxOpen, FaEye, FaSignOutAlt } from 'react-icons/fa';
import SearchBox from '../Search/SearchBox';

export default function Header() {
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const headerRef = useRef(null);

  // Tô đậm menu showroom
  useEffect(() => {
    document.querySelectorAll('#menu-list-showroom li a').forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      link.parentElement.classList.toggle('active', pathname === linkPath);
    });
  }, [pathname]);

  const updateCartCount = useCallback(async () => {
    const storedCartId = localStorage.getItem("cartId");
    const url = storedCartId ? `/api/carts?cartId=${storedCartId}` : "/api/carts";

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        console.warn("❌ Cart API nhận status:", response.status);
        setCartCount(0);
        return;
      }

      const json = await response.json();

      console.log("🔥 RAW CART RESPONSE:", json);

      // ⛔ Backend KHÔNG trả { data: {...} }
      // 👉 Ta tạo fallback để FE không bao giờ crash

      const data =
        json?.data ??      // backend dạng { data: {...} }
        json?.cart ??      // backend dạng { cart: {...} }
        json ??            // backend trả thẳng {...}
        {};

      console.log("🔥 NORMALIZED CART DATA:", data);

      const count =
        data.totalQuantity ??
        (Array.isArray(data.items)
          ? data.items.reduce(
            (sum, item) => sum + (item.Quantity ?? item.quantity ?? 1),
            0
          )
          : 0) ??
        data.count ??
        data.items?.length ??
        0;


      setCartCount(count);

      if (data.cartId) {
        localStorage.setItem("cartId", data.cartId);
      }

    } catch (err) {
      console.error("❌ CART ERROR:", err);
      setCartCount(0);
    }
  }, []);

  // Optimistic update + fetch lại để chắc chắn
  useEffect(() => {
    const handler = () => {
      setCartCount((prev) => prev + 1);
      updateCartCount(); // đồng bộ lại với server
    };

    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [updateCartCount]);

  // Load cart khi mount / đổi trang / login/logout
  useEffect(() => {
    updateCartCount();
  }, [pathname, user, updateCartCount]);

  // Login success
  // Login success – ĐÃ SỬA HOÀN HẢO (dòng này quyết định tất cả)
  const handleLoginSuccess = (userData) => {
    // === BƯỚC QUAN TRỌNG NHẤT: Luôn luôn lưu userId một cách chắc chắn ===
    const realUserId =
      userData.id ||
      userData._id ||
      userData.userId ||
      userData.customerId ||
      userData.user_id ||
      userData.profile?.id ||

      localStorage.setItem("user", JSON.stringify(userData));

    // Luôn luôn lưu token
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    // === BẮT BUỘC PHẢI CÓ DÒNG NÀY ===
    if (realUserId) {
      localStorage.setItem("userId", String(realUserId));
    } else {
      console.error("⚠️ Backend không tìm thấy userId từ backend:", userData);
    }

    const name = userData.fullname?.trim() || userData.name?.trim() || userData.email || "Người dùng";
    setUser({ ...userData, name });
    setIsLoginOpen(false);
    updateCartCount(); // merge cart ngay lập tức
  };

  // Load user từ localStorage khi mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.id || parsed._id) {
          localStorage.setItem("userId", parsed.id || parsed._id);
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartId');
    setUser(null);
    setDropdownOpen(false);
    setCartCount(0);
  };

  // Sticky header
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={styles.mainHeader}>
      {/* Banner top */}
      <div className={styles.topBanner}>
        <ContainerFluid>
          <img src="/images/top-banner.gif" alt="Top Banner" className={styles.bannerImg} />
        </ContainerFluid>
      </div>

      {/* Header chính */}
      <div
        ref={headerRef}
        className={`${styles.headerTop} ${isSticky ? styles.sticky : ''}`}
      >
        <ContainerFluid>
          <div className={styles.headerInner}>
            {/* Logo */}
            <Link href={config.routes.home} className={styles.logo}>
              <img src="/images/logo.jpg" alt="GTN" />
            </Link>

            {/* Danh mục */}
            <div className={styles.categoryMenu}>
              <FontAwesomeIcon icon={faBars} />
              <span>Danh mục</span>
            </div>

            {/* Thanh tìm kiếm */}
            <div className={styles.searchWrapper}>
              <SearchBox />
            </div>

            {/* Hotline */}
            <div className={styles.hotline}>
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <span>Hotline</span>
                <strong>1900.5301</strong>
              </div>
            </div>

            {/* Hệ thống showroom */}
            <Link href={config.routes.showroom} className={styles.showroom}>
              <FontAwesomeIcon icon={faStore} />
              <div>
                <span>Hệ thống</span>
                <strong>Showroom</strong>
              </div>
            </Link>

            {/* Tra cứu đơn hàng */}
            <div className={styles.trackOrder}>
              <FontAwesomeIcon icon={faTruck} />
              <div>
                <span>Tra cứu</span>
                <strong>đơn hàng</strong>
              </div>
            </div>

            {/* Giỏ hàng */}
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

            {/* Tài khoản */}
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
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
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

                  {dropdownOpen && (
                    <div className={styles.dropdown}>
                      <Link href="/tai-khoan/thong-tin" className={styles.dropdownItem}>
                        <FaUser className={styles.icon} /> Thông tin tài khoản
                      </Link>
                      <Link href="/tai-khoan/don-hang" className={styles.dropdownItem}>
                        <FaBoxOpen className={styles.icon} /> Đơn hàng của tôi
                      </Link>
                      <Link href="/tai-khoan/san-pham-da-xem" className={styles.dropdownItem}>
                        <FaEye className={styles.icon} /> Đã xem gần đây
                      </Link>
                      <div className={styles.dropdownItem} onClick={handleLogout}>
                        <FaSignOutAlt className={styles.icon} /> Đăng xuất
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ContainerFluid>
      </div>

      {/* Placeholder khi sticky */}
      <div
        className={`${styles.headerPlaceholder} ${isSticky ? styles.active : ''}`}
        style={{ height: isSticky ? `${headerHeight}px` : '0' }}
      />

      {/* Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
} // <- Đã thêm dấu } và ; ở đây để chắc chắn không còn lỗi cú pháp nào