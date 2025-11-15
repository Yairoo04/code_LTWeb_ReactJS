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

export default function Header() {
  const pathname = usePathname();
  const router = useRouter(); // DÙNG ĐỂ CHUYỂN TRANG
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // MODAL XÁC NHẬN
  const headerRef = useRef(null);

  // Tô đậm menu
  useEffect(() => {
    document.querySelectorAll('#menu-list-showroom li a').forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      link.parentElement.classList.toggle('active', pathname === linkPath);
    });
  }, [pathname]);

  const updateCartCount = useCallback(async () => {
    const storedCartId = localStorage.getItem('cartId');
    const url = storedCartId ? `/api/carts?cartId=${storedCartId}` : '/api/carts';
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const { data } = await response.json();
        setCartCount(data.items ? data.items.length : 0);
        if (data.cartId) {
          localStorage.setItem('cartId', data.cartId);
        }
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    updateCartCount();
  }, [pathname, user, updateCartCount]);

  // Login success
  const handleLoginSuccess = (userData) => {
    const name = userData.fullname?.trim() || "Người dùng";
    const data = {
      name,
      email: userData.email || "",
      phone: userData.phone || "",
      role: userData.role || "Customer",
    };
    localStorage.setItem("user", JSON.stringify(data));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setUser(data);
    setIsLoginOpen(false);
    updateCartCount();
  };

  // Load user
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // === XỬ LÝ ĐĂNG XUẤT ===
  const handleLogoutClick = () => {
    setShowLogoutModal(true); // HIỆN MODAL
    setDropdownOpen(false); // ĐÓNG DROPDOWN
  };

  const confirmLogout = () => {
    // XÓA TẤT CẢ
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartId');

    setUser(null);
    setCartCount(0);
    setShowLogoutModal(false);

    // CHUYỂN VỀ TRANG CHỦ
    router.push('/');
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
                <span className={styles.cartCount}>{cartCount}</span>
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
                        <strong className={styles.username}>{user.name}</strong>
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
                      {/* ĐĂNG XUẤT */}
                      <div className={styles.dropdownItem} onClick={handleLogoutClick}>
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

      {/* === MODAL ĐĂNG XUẤT === */}
      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p>Bạn muốn thoát tài khoản?</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowLogoutModal(false)} className={styles.cancelBtn}>
                Không
              </button>
              <button onClick={confirmLogout} className={styles.confirmBtn}>
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Login/Register */}
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
}