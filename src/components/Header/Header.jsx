'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPhone, faStore, faTruck, faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import ContainerFluid from '../../pages/main_Page/container-fluid.jsx';
import config from '../../config';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import styles from './Header.module.scss';
import { FaUser, FaBoxOpen, FaEye, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
    const pathname = usePathname();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        document.querySelectorAll('#menu-list-showroom li a').forEach((link) => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            link.parentElement.classList.toggle('active', pathname === linkPath);
        });
    }, [pathname]);

    const handleLoginSuccess = (userData) => {
        // Ví dụ userData được backend trả về
        const data = {
            name: userData.fullname || 'Trần Thị Ánh Nguyệt',
            email: userData.email || 'anhnguyett21@gmail.com',
        };

        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsLoginOpen(false);
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    return (
        <header className="main-header">
            <div className="list-banner">
                <ContainerFluid>
                    <div className="top-banner">
                        <img src="/images/top-banner.gif" alt="Top Banner" className="img-banner" />
                    </div>
                </ContainerFluid>
            </div>

            <div className="main-header--top">
                <ContainerFluid>
                    <div className="menu">
                        <Link href={config.routes.home}>
                            <img src="/images/logo.jpg" alt="GTN Logo" className="img-logo" />
                        </Link>
                        <div className="category">
                            <FontAwesomeIcon icon={faBars} /> Danh mục
                        </div>
                        <div className="search-box">
                            <input type="text" className="search" placeholder="Tìm kiếm sản phẩm..." />
                            <button className="button-search">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                        <div className="hotline">
                            <FontAwesomeIcon icon={faPhone} />
                            <div className="hotline-text">
                                <span>Hotline</span>
                                <span>1900.1000</span>
                            </div>
                        </div>
                        <Link href={config.routes.showroom}>
                            <div className="showroom-system">
                                <FontAwesomeIcon icon={faStore} />
                                <div className="showroom-system-text">
                                    <span>Hệ thống</span>
                                    <span>Showroom</span>
                                </div>
                            </div>
                        </Link>
                        <div className="track-oder">
                            <FontAwesomeIcon icon={faTruck} />
                            <div className="track-oder-text">
                                <span>Tra cứu</span>
                                <span>đơn hàng</span>
                            </div>
                        </div>
                        <div className="user-cart">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span className="quantity">0</span>
                            <div className="user-cart-text">
                                <span>Giỏ</span>
                                <span>hàng</span>
                            </div>
                        </div>

                        <nav className="nav">
                            {!user ? (
                                <button onClick={() => setIsLoginOpen(true)} className="login">
                                    Đăng nhập
                                </button>
                            ) : (
                                <div
                                    className={styles.userMenu}
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                    {/* thêm onClick để toggle */}
                                    <span className={styles.userName} onClick={toggleDropdown}>
                                        Xin chào {user.name}
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
                                            <p className={styles.dropdownItem} onClick={handleLogout}>
                                                <FaSignOutAlt className={styles.icon} /> Đăng xuất
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </nav>

                        <LoginModal
                            isOpen={isLoginOpen}
                            onClose={() => setIsLoginOpen(false)}
                            onSwitchToRegister={() => {
                                setIsLoginOpen(false);
                                setIsRegisterOpen(true);
                            }}
                            onLoginSuccess={(userData) => {
                                const data = {
                                    name: userData.fullname || 'Người dùng',
                                    email: userData.email || '',
                                    phone: userData.phone || '',
                                    gender: userData.gender || 'Nam',
                                    birthday: userData.birthday || { day: '', month: '', year: '' },
                                };

                                localStorage.setItem('user', JSON.stringify(data));
                                setUser(data);
                            }}
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
        </header>
    );
}
