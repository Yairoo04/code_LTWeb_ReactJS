import classNames from 'classnames/bind';
import Link from 'next/link';
import ContainerFluid from '../../pages/main_Page/container-fluid.jsx';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

export default function Footer() {
  return (
    <ContainerFluid>
      <footer>
        <div className={cx("footer-bottom")}>
          <div className={cx("company-info")}>
            <h4>Hỗ trợ khách hàng</h4>
            <ul>
              <li><Link href="/offers">Thẻ ưu đãi</Link></li>
              <li><Link href="/buy-online">Hướng dẫn mua online</Link></li>
              <li><Link href="/business">Ưu đãi dành cho Doanh nghiệp</Link></li>
              <li><Link href="/installment">Chính sách trả góp</Link></li>
              <li><Link href="/repair">Dịch vụ sửa chữa</Link></li>
            </ul>
          </div>
          <div className={cx("company-info")}>
            <h4>Chính sách mua hàng</h4>
            <ul>
              <li><Link href="/terms">Điều kiện giao dịch chung</Link></li>
              <li><Link href="/warranty-policy">Chính sách bảo hành</Link></li>
              <li><Link href="/return-policy">Chính sách đổi trả</Link></li>
              <li><Link href="/payment-policy">Chính sách thanh toán</Link></li>
              <li><Link href="/delivery">Giao hàng và Lắp đặt tại nhà</Link></li>
              <li><Link href="/deposit">Quy định Đặt cọc và Giữ hàng</Link></li>
            </ul>
          </div>
          <div className={cx("company-info")}>
            <h4>Thông tin GTN</h4>
            <ul>
              <li><Link href="/about">Giới thiệu GTN</Link></li>
              <li><Link href="/stores">Hệ thống cửa hàng</Link></li>
              <li><Link href="/warranty-center">Trung tâm bảo hành</Link></li>
              <li><Link href="/news">Tin công nghệ</Link></li>
              <li><Link href="/faq">Hỏi đáp</Link></li>
              <li><Link href="/careers">Tuyển dụng</Link></li>
            </ul>
          </div>
          <div className={cx("company-info")}>
            <h4>Cộng đồng GTN</h4>
            <ul>
              <li><Link href="/contact">Gọi mua hàng (miễn phí) 18001234</Link></li>
              <li><Link href="/support">Gọi chăm sóc 18006789</Link></li>
              <li><Link href="/facebook">Facebook GTN</Link></li>
              <li><Link href="/media">GTN Media</Link></li>
              <li><Link href="/community">GTN Hội</Link></li>
              <li><Link href="/oa">OA GTN</Link></li>
            </ul>
          </div>
          <div className={cx("company-info")}>
            <h4>Email liên hệ</h4>
            <ul>
              <li><a href="mailto:cskh@gtn.com">Hỗ trợ khách hàng: cskh@gtn.com</a></li>
              <li><a href="mailto:baogia@gtn.vn">Liên hệ báo giá: baogia@gtn.vn</a></li>
              <li><a href="mailto:hoptac@gtn.vn">Hợp tác phát triển: hoptac@gtn.vn</a></li>
            </ul>
          </div>
        </div>
        <div className={cx("payment")} >
          <h4>Phương thức thanh toán</h4>
          <div className={cx("bank-list")}>
            <div>
              <img src="/image/qr-code.png" alt="QR Code" />
              <p>QR Code</p>
            </div>
            <div>
              <img src="/image/cash.png" alt="Tiền mặt" />
              <p>Tiền mặt</p>
            </div>
            <div>
              <img src="/image/installment.png" alt="Trả góp" />
              <p>Trả góp</p>
            </div>
            <div>
              <img src="/image/banking.png" alt="Internet Banking" />
              <p>Internet Banking</p>
            </div>
          </div>
        </div>
        <div className={cx("company-info")}>
          <h4>CÔNG TY CỔ PHẦN THƯƠNG MAI - DỊCH VỤ GTN</h4>
          <p>© 1997 - 2020 Công Ty Cổ Phần Thương Mại - Dịch Vụ GTN...</p>
        </div>
        <div className={cx("address")} >
          <h4>Địa chỉ trụ sở chính:</h4>
          <p>Tầng 5, Số 117-119-121 Nguyễn Du, Phường Bến Thành, Thành Phố Hồ Chí Minh</p>
          <h4>Văn phòng điều hành miền Bắc:</h4>
          <p>Tầng 2, Số 47 Phố Thái Hà, Phường Trung Liệt, Quận Đống Đa, Thành phố Hà Nội</p>
          <h4>Văn phòng điều hành miền Nam:</h4>
          <p>677/2A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh</p>
        </div>
      </footer>
    </ContainerFluid>
  );
}