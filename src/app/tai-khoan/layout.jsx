'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './accountLayout.module.scss';

export default function AccountLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    const menu = [
        { href: '/tai-khoan/thong-tin', label: 'Thông tin tài khoản' },
        { href: '/tai-khoan/dia-chi', label: 'Sổ địa chỉ' },
        { href: '/tai-khoan/don-hang', label: 'Quản lý đơn hàng' },
        { href: '/tai-khoan/san-pham-da-xem', label: 'Sản phẩm đã xem' },
    ];

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        setShowModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowModal(false);
        router.push('/');
    };

    return (
        <>
            <Header />

            <div className={styles.accountWrapper}>
                <aside className={styles.sidebar}>
                    <div className={styles.userBox}>
                        <div className={styles.avatar}>👤</div>
                        <p className={styles.username}>
                            {user?.name || user?.email || 'Khách'}
                        </p>
                    </div>
                    <nav>
                        {menu.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.menuItem} ${pathname === item.href ? styles.active : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <button className={styles.logout} onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </nav>
                </aside>
                <section className={styles.content}>{children}</section>
            </div>

            <Footer />

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p>Bạn muốn thoát tài khoản?</p>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowModal(false)}>Không</button>
                            <button onClick={confirmLogout} className={styles.confirmBtn}>
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
