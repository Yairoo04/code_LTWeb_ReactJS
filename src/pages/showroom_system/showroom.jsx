import "./style.scss"; // style của bạn

const Showroom = () => {
  return (
    <div className="showroom-system-container">
      {/* Menu bên trái */}
      <div className="menu-list">
        <ul>
          <li><a href="link">Giới thiệu</a></li>
          <li><a href="link">Hệ thống cửa hàng</a></li>
          <li><a href="link">Bảng giá thu sản phẩm cũ</a></li>
          <li><a href="link">Hỗ trợ kỹ thuật tận nơi</a></li>
          <li><a href="link">Dịch vụ sữa chữa</a></li>
          <li><a href="link">Tra cứu thông tin bảo hành</a></li>
          <li><a href="link">Chính sách giao hàng</a></li>
          <li><a href="link">Chính sách bảo hành</a></li>
          <li><a href="link">Thanh toán</a></li>
          <li><a href="link">Mua hàng trả góp</a></li>
          <li><a href="link">Hướng dẫn mua hàng</a></li>
          <li><a href="link">Chính sách bảo mật</a></li>
          <li><a href="link">Điều khoản dịch vụ</a></li>
          <li><a href="link">Dịch vụ vệ sinh miễn phí</a></li>
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
