import './menuList.scss';
import Link from 'next/link';

const MenuList = () => {
    return (
      <div className="menu-list">
            <ul>
                <li className="menu-item menu-gioi-thieu">
                    <Link href="/gioi-thieu-GTN">Giới thiệu</Link>
                </li>
                <li className="menu-item menu-showroom">
                    <Link href="/he-thong-cua-hang-GTN">Hệ thống cửa hàng</Link>
                </li>
                <li className="menu-item menu-bang-gia">
                    <Link href="/bang-gia-thu-san-pham-cu">Bảng giá thu sản phẩm cũ</Link>
                </li>
                <li className="menu-item menu-ho-tro">
                    <Link href="/ho-tro-ky-thuat">Hỗ trợ kỹ thuật tận nơi</Link>
                </li>
                <li className="menu-item menu-sua-chua">
                    <Link href="/sua-chua">Dịch vụ sữa chữa</Link>
                </li>
                <li className="menu-item menu-bao-hanh-tra-cuu">
                    <Link href="/tra-cuu-bao-hanh">Tra cứu thông tin bảo hành</Link>
                </li>
                <li className="menu-item menu-giao-hang">
                    <Link href="/chinh-sach-giao-hang">Chính sách giao hàng</Link>
                </li>
                <li className="menu-item menu-bao-hanh">
                    <Link href="/chinh-sach-bao-hanh">Chính sách bảo hành</Link>
                </li>
                <li className="menu-item menu-thanh-toan">
                    <Link href="/thanh-toan">Thanh toán</Link>
                </li>
                <li className="menu-item menu-tra-gop">
                    <Link href="/tra-gop">Mua hàng trả góp</Link>
                </li>
                <li className="menu-item menu-huong-dan">
                    <Link href="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link>
                </li>
                <li className="menu-item menu-bao-mat">
                    <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
                </li>
                <li className="menu-item menu-dieu-khoan">
                    <Link href="/dieu-khoan">Điều khoản dịch vụ</Link>
                </li>
                <li className="menu-item menu-ve-sinh">
                    <Link href="/ve-sinh">Dịch vụ vệ sinh miễn phí</Link>
                </li>
            </ul>
        </div>
    );
};

export default MenuList;
