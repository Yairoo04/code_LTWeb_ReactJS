import "./style.scss"; // style của bạn
import Link from "next/link";

const Showroom = () => {
  return (
    <div className="showroom-system-container">
      {/* Menu bên trái */}
     <div className="menu-list">
        <ul>
          <li><Link href="/gioi-thieu-GTN">Giới thiệu</Link></li>
          <li><Link href="/he-thong-cua-hang-gtn">Hệ thống cửa hàng</Link></li>
          <li><Link href="/bang-gia-thu-san-pham-cu">Bảng giá thu sản phẩm cũ</Link></li>
          <li><Link href="/ho-tro-ky-thuat">Hỗ trợ kỹ thuật tận nơi</Link></li>
          <li><Link href="/sua-chua">Dịch vụ sữa chữa</Link></li>
          <li><Link href="tra-cuu-bao-hanh/tra-cuu-bao-hanh">Tra cứu thông tin bảo hành</Link></li>
          <li><Link href="chinh-sach-giao-hang/chinh-sach-giao-hang">Chính sách giao hàng</Link></li>
          <li><Link href="/chinh-sach-bao-hanh">Chính sách bảo hành</Link></li>
          <li><Link href="thanh-toan/thanh-toan">Thanh toán</Link></li>
          <li><Link href="/tra-gop">Mua hàng trả góp</Link></li>
          <li><Link href="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link></li>
          <li><Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
          <li><Link href="/dieu-khoan/dieu-khoan">Điều khoản dịch vụ</Link></li>
          <li><Link href="/ve-sinh">Dịch vụ vệ sinh miễn phí</Link></li>
        </ul>
      </div>

      {/* Nội dung */}
      <div className="content">
        <h1>Hệ thống cửa hàng GTN</h1>

        <div className="gioMuacua">
          <p style={{ color: "brown" }}>➜</p>
          <p>Giờ mở cửa:</p>
          <p style={{ fontWeight: "bolder" }}>08:00 - 21:00</p>
        </div>

        <div className="call">
          <a href="tel:19005301">
            <div className="showroom-hotline-text-header">
              <span>📞GỌI NGAY:1900.5301</span>
            </div>
          </a>
        </div>

        {/* HCM stores */}
        <h3 className="section-title">CỬA HÀNG TẠI TP.HỒ CHÍ MINH</h3>
        <div className="store-grid">
          <div className="store-card">
            <h4>📍 TÂN BÌNH - HOÀNG HOA THÁM</h4>
            <p>
              <b>Địa chỉ:</b>{" "}
              <a href="link">7B-80-82 Hoàng Hoa Thám, Phường Bảy Hiền, TP.HCM</a>
            </p>
            <p><b>Giờ làm việc:</b> 8:00 - 21:00</p>
            <a href="link" className="btn-direction">
              <span className="st-direction-text">📌 Chỉ đường</span>
            </a>
          </div>

          <div className="store-card">
            <h4>📍 TP THỦ ĐỨC - KHA VẠN CÂN</h4>
            <p>
              <b>Địa chỉ:</b>{" "}
              <a href="link">905 Phường Linh Tây, TP.HCM</a>
            </p>
            <p><b>Giờ làm việc:</b> 8:00 - 21:00</p>
            <a href="link" className="btn-direction">
              <span className="st-direction-text">📌 Chỉ đường</span>
            </a>
          </div>

          <div className="store-card">
            <h4>📍 QUẬN 5 - TRẦN HƯNG ĐẠO</h4>
            <p>
              <b>Địa chỉ:</b>{" "}
              <a href="link">1081-1083 Trần Hưng Đạo, Phường An Đông, TP.HCM</a>
            </p>
            <p><b>Giờ làm việc:</b> 8:00 - 21:00</p>
            <a href="link" className="btn-direction">
              <span className="st-direction-text">📌 Chỉ đường</span>
            </a>
          </div>

          <div className="store-card">
            <h4>📍 BÌNH THẠNH - NGUYỄN CỬU VÂN</h4>
            <p>
              <b>Địa chỉ:</b>{" "}
              <a href="link">63 Nguyễn Cửu Vân, Phường Gia Định, TP.HCM</a>
            </p>
            <p><b>Giờ làm việc:</b> 8:00 - 21:00</p>
            <a href="link" className="btn-direction">
              <span className="st-direction-text">📌 Chỉ đường</span>
            </a>
          </div>
        </div>

        {/* Hà Nội stores */}
        <h3 className="section-title">CỬA HÀNG TẠI HÀ NỘI</h3>
        <div className="store-grid">
          <div className="store-card">
            <h4>📍 ĐỐNG ĐA - THÁI HÀ</h4>
            <p>
              <b>Địa chỉ:</b>{" "}
              <a href="link">162-164 Thái Hà, Phường Đống Đa, Hà Nội</a>
            </p>
            <p><b>Giờ làm việc:</b> 8:00 - 21:00</p>
            <a href="link" className="btn-direction">
              <span className="st-direction-text">📌 Chỉ đường</span>
            </a>
          </div>
        </div>

        {/* Liên hệ */}
        <div className="lienHe">
          <p><b>Liên hệ với chúng tôi</b></p>
          <a href="tel:19005301">
            <div className="showroom-hotline-text-footer">
              <span>HOTLINE: 1900.5301</span>
            </div>
          </a>
          <div className="email-website">
            Email: <a href="mailto:cskh@gearvn.com">cskh@gearvn.com</a> | Website:{" "}
            <a href="https://gearvn.com" target="_blank" rel="noreferrer">
              www.gearvn.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showroom;
