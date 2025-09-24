// src/layout/menu_list/menu_list_showroom.jsx
// import React from "react";
// import "./menu_list_showroom.scss";

'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import './menu_list_showroom.scss';

const MenuListShowroom = ({ active }) => {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    const menuItems = [
        { path: 'gioi-thieu-GTN/gioi-thieu-GTN', label: 'Giới thiệu' },
        { path: '/he-thong-cua-hang-gtn/he-thong-cua-hang-gtn', label: 'Hệ thống cửa hàng' },
        { path: '/bang-gia-thu-san-pham-cu/bang-gia-thu-san-pham-cu', label: 'Bảng giá thu sản phẩm cũ' },
        { path: '/ho-tro-ky-thuat/ho-tro-ky-thuat', label: 'Hỗ trợ kỹ thuật tận nơi' },
        { path: '/sua-chua/sua-chua', label: 'Dịch vụ sửa chữa' },
        { path: '/tra-cuu-bao-hanh/tra-cuu-bao-hanh', label: 'Tra cứu bảo hành' },
        { path: '/chinh-sach-giao-hang/chinh-sach-giao-hang', label: 'Chính sách giao hàng' },
        { path: '/chinh-sach-bao-hanh/chinh-sach-bao-hanh', label: 'Chính sách bảo hành' },
        { path: '/thanh-toan/thanh-toan', label: 'Thanh toán' },
        { path: '/tra-gop/tra-gop', label: 'Mua hàng trả góp' },
        { path: '/huong-dan-mua-hang/huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
        { path: '/chinh-sach-bao-mat/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
        { path: '/dieu-khoan/dieu-khoan', label: 'Điều khoản dịch vụ' },
        { path: '/ve-sinh/ve-sinh', label: 'Dịch vụ vệ sinh miễn phí' },
    ];

    return (
        <div className="menu-list">
            <ul>
                {menuItems.map((item) => (
                    <li key={item.path} className={pathname === item.path ? 'active' : ''}>
                        <a href={item.path}>{item.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuListShowroom;
