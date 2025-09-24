import "./style.scss"; 

const ThanhToan = () => {
  return (
    <div className="showroom-system-container">
      {/* Menu bên trái */}
      <div className="menu-list">
        <ul>
          <li><a href="/gioi-thieu-GTN">Giới thiệu</a></li>
          <li><a href="/he-thong-cua-hang-gtn">Hệ thống cửa hàng</a></li>
          <li><a href="/bang-gia-thu-san-pham-cu">Bảng giá thu sản phẩm cũ</a></li>
          <li><a href="/ho-tro-ky-thuat">Hỗ trợ kỹ thuật tận nơi</a></li>
          <li><a href="/sua-chua">Dịch vụ sửa chữa</a></li>
          <li><a href="/tra-cuu-bao-hanh">Tra cứu bảo hành</a></li>
          <li><a href="/chinh-sach-giao-hang">Chính sách giao hàng</a></li>
          <li><a href="/chinh-sach-bao-hanh">Chính sách bảo hành</a></li>
          <li className="active"><a href="/thanh-toan">Thanh toán</a></li>
          <li><a href="/tra-gop">Mua hàng trả góp</a></li>
          <li><a href="/huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
          <li><a href="/chinh-sach-bao-mat">Chính sách bảo mật</a></li>
          <li><a href="/dieu-khoan/dieu-khoan">Điều khoản dịch vụ</a></li>
          <li><a href="/ve-sinh">Dịch vụ vệ sinh miễn phí</a></li>
        </ul>
      </div>

      {/* Nội dung */}
      <div className="thanhtoan-content">
        <h1>Hướng dẫn Thanh toán</h1>
        <p className="intro">
          Chúng tôi cung cấp nhiều hình thức thanh toán linh hoạt, an toàn và tiện lợi. 
          Quý khách vui lòng tham khảo các phương thức sau:
        </p>

        <div className="payment-step">
          <h2>1. Thanh toán khi nhận hàng (COD)</h2>
          <p>
            - Quý khách trả tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm. <br />
            - Hỗ trợ toàn quốc, nhanh chóng và tiện lợi.
          </p>
        </div>

        <div className="payment-step">
          <h2>2. Chuyển khoản ngân hàng</h2>
          <p>
            - Quý khách chuyển khoản theo thông tin sau, nội dung ghi rõ <strong>Họ tên + SĐT + Mã đơn hàng</strong>:
          </p>
          <ul>
            <li><strong>Ngân hàng:</strong> Vietcombank – Chi nhánh TP.HCM</li>
            <li><strong>Số tài khoản:</strong> 0123456789</li>
            <li><strong>Chủ tài khoản:</strong> Công ty TNHH GTN</li>
          </ul>
        </div>

        <div className="payment-step">
          <h2>3. Thanh toán qua ví điện tử</h2>
          <p>
            Chúng tôi hỗ trợ các ví điện tử phổ biến: MoMo, ZaloPay, ShopeePay. 
            Khi đặt hàng, chọn “Thanh toán qua ví điện tử” để được hướng dẫn.
          </p>
        </div>

        <div className="payment-step">
          <h2>4. Lưu ý</h2>
          <ul>
            <li>Luôn giữ lại hoá đơn hoặc biên lai để tiện đối chiếu.</li>
            <li>Mọi thắc mắc xin gọi <strong>1900 9999</strong> để được hỗ trợ 24/7.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThanhToan;
