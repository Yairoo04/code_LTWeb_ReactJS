'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPhone, faStore, faTruck, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';
import config from '../../config';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import styles from './Header.module.scss';
import { FaUser as ReactFaUser, FaBoxOpen, FaEye, FaSignOutAlt } from 'react-icons/fa';

// THÊM IMPORT SEARCHBO
import SearchBox from '../Search/SearchBox'; // Đảm bảo đường dẫn đúng

export default function Header() {
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  // Tô đậm menu khi đang ở trang hiện tại
  useEffect(() => {
    document.querySelectorAll('#menu-list-showroom li a').forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      link.parentElement.classList.toggle('active', pathname === linkPath);
    });
  }, [pathname]);

  // Khi login thành công
  const handleLoginSuccess = (userData) => {
    // Nếu fullname rỗng => gán "Người dùng"
    const name = userData.fullname && userData.fullname.trim() !== ""
      ? userData.fullname
      : "Người dùng";

    const data = {
      name,
      email: userData.email || "",
      phone: userData.phone || "",
      role: userData.role || "Customer",
    };

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setIsLoginOpen(false);
  };

  // Lấy thông tin user đã lưu
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Sticky header logic
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={styles.mainHeader}>
      {/* Banner top */}
      <div className={styles.listBanner}>
        <ContainerFluid>
          <div className={styles.topBanner}>
            <img src="/images/top-banner.gif" alt="Top Banner" className={styles.imgBanner} />
          </div>
        </ContainerFluid>
      </div>

      {/* Header chính */}
      <div
        ref={headerRef}
        className={`${styles['main-header--top']} ${isSticky ? styles.sticky : ''}`}
      >
        <ContainerFluid>
          <div className={styles.menu}>
            <Link href={config.routes.home}>
              <img src="/images/logo.jpg" alt="GTN Logo" className={styles.imgLogo} />
            </Link>

            <div className={styles.category}>
              <FontAwesomeIcon icon={faBars} /> Danh mục
            </div>

            {/* THAY THẾ PHẦN SEARCH CŨ BẰNG SEARCHBOX */}
            <div className={styles.searchContainer}>
              <SearchBox />
            </div>
            {/* KẾT THÚC */}

            <div className={styles.hotline}>
              <FontAwesomeIcon icon={faPhone} />
              <div className={styles.hotlineText}>
                <span>Hotline</span>
                <span>1900.1000</span>
              </div>
            </div>

            <Link href={config.routes.showroom}>
              <div className={styles.showroomSystem}>
                <FontAwesomeIcon icon={faStore} />
                <div className={styles.showroomSystemText}>
                  <span>Hệ thống</span>
                  <span>Showroom</span>
                </div>
              </div>
            </Link>

            <div className={styles.trackOder}>
              <FontAwesomeIcon icon={faTruck} />
              <div className={styles.trackOderText}>
                <span>Tra cứu</span>
                <span>đơn hàng</span>
              </div>
            </div>

            <Link href={config.routes.cart}>
              <div className={styles.userCart}>
                <div className={styles.iconCart}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span className={styles.quantity}>0</span>
                </div>
                <div className={styles.userCartText}>
                  <span>Giỏ</span>
                  <span>hàng</span>
                </div>
              </div>
            </Link>

            {/* User Menu */}
            <nav className={styles.nav}>
              {!user ? (
                <button onClick={() => setIsLoginOpen(true)} className={styles.login}>
                  <FontAwesomeIcon icon={faUser} />
                  <div className={styles.titleLogin}>
                    <span>Đăng </span>
                    <span>nhập</span>
                  </div>
                </button>
              ) : (
                <div
                  className={styles.userMenu}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {/*Hiển thị fullname nếu có, ngược lại hiển thị "Người dùng" */}
                  <span className={styles.userName} onClick={toggleDropdown}>
                    Xin chào {user.name}
                  </span>

                  {dropdownOpen && (
                    <div className={styles.dropdown}>
                      <Link href="/tai-khoan/thong-tin" className={styles.dropdownItem}>
                        <ReactFaUser className={styles.icon} /> Thông tin tài khoản
                      </Link>
                      <Link href="/tai-khoan/don-hang" className={styles.dropdownItem}>
                        <FaBoxOpen className={styles.icon} /> Đơn hàng của tôi
                      </Link>
                      <Link href="/tai-khoan/san-pham-da-xem" className={styles.dropdownItem}>
                        <FaEye className={styles.icon} /> Đã xem gần đây
                      </Link>
                      <p className={styles.dropdownItem} onClick={handleLogout}>
                        <FaSignOutAlt className={styles.icon} /> Đăng xuất
                      </p>
                    </div>
                  )}
                </div>
              )}
            </nav>

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
          </div>
        </ContainerFluid>
      </div>
      <div
        className={`${styles.headerPlaceholder} ${isSticky ? styles.active : ''}`}
        style={{ height: `${headerHeight}px` }}
      />
    </header>
  );
}