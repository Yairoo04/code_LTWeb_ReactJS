'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './menu_list_showroom.module.scss';

const MenuListShowroom = () => {
    const pathname = usePathname();

    const menuItems = [
        { path: '/gioi-thieu-gtn', label: 'Giới thiệu' },
        { path: '/he-thong-cua-hang-gtn', label: 'Hệ thống cửa hàng' },
        // { path: '/bang-gia-thu-san-pham-cu', label: 'Bảng giá thu sản phẩm cũ' },
        // { path: '/ho-tro-ky-thuat', label: 'Hỗ trợ kỹ thuật tận nơi' },
        // { path: '/sua-chua', label: 'Dịch vụ sửa chữa' },
        { path: '/tra-cuu-bao-hanh', label: 'Tra cứu bảo hành' },
        { path: '/chinh-sach-giao-hang', label: 'Chính sách giao hàng' },
        { path: '/chinh-sach-bao-hanh', label: 'Chính sách bảo hành' },
        { path: '/thanh-toan', label: 'Thanh toán' },
        { path: '/tra-gop', label: 'Mua hàng trả góp' },
        { path: '/', label: 'Hướng dẫn mua hàng' },
        { path: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
        { path: '/dieu-khoan-dich-vu', label: 'Điều khoản dịch vụ' },
        // { path: '/ve-sinh', label: 'Dịch vụ vệ sinh miễn phí' },
    ];

    return (
        <div className={styles.menuList}>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.path} className={pathname === item.path ? styles.active : ''}>
                        <Link href={item.path}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuListShowroom;