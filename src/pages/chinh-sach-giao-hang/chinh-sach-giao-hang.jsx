import React from "react";
import "./style.scss";

const ChinhSachGiaoHang = () => {
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
          <li className="active"><a href="/chinh-sach-giao-hang">Chính sách giao hàng</a></li>
          <li><a href="/chinh-sach-bao-hanh">Chính sách bảo hành</a></li>
          <li ><a href="/thanh-toan">Thanh toán</a></li>
          <li><a href="/tra-gop">Mua hàng trả góp</a></li>
          <li><a href="/huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
          <li><a href="/chinh-sach-bao-mat">Chính sách bảo mật</a></li>
          <li><a href="/dieu-khoan/dieu-khoan">Điều khoản dịch vụ</a></li>
          <li><a href="/ve-sinh">Dịch vụ vệ sinh miễn phí</a></li>
        </ul>
      </div>

      {/* Content bên phải */}
      <div className="content">
        <div className="content-chinh-sach">
          <h2 className="title-page">Chính sách vận chuyển</h2>
          <li>
            <b>
              <i>
                GTN cung cấp dịch vụ giao hàng toàn quốc, giao hàng tận nơi đến
                địa chỉ cung cấp của Quý khách. Thời gian giao hàng dự kiến phụ
                thuộc vào khu vực địa chỉ nhận hàng của Quý khách.
              </i>
            </b>
          </li>
          <p>
            Với đa phần đơn hàng, GearVN cần vài giờ làm việc để kiểm tra thông
            tin và đóng gói hàng. Nếu các sản phẩm đều có sẵn GearVN sẽ nhanh
            chóng bàn giao cho đối tác vận chuyển.
          </p>

          <li>
            <b>Phí dịch vụ giao hàng</b>
          </li>
          <table className="table-chinh-sach">
            <thead>
              <tr>
                <th>Giá trị đơn hàng</th>
                <th>Khu vực HCM/HN</th>
                <th>Khu vực Ngoại thành/ Tỉnh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3">
                  <strong>GIAO HÀNG NHANH 2H ĐẾN 4H</strong>
                </td>
              </tr>
              <tr>
                <td>• Đơn hàng dưới 5 triệu đồng</td>
                <td>40.000 vnd</td>
                <td>Không áp dụng</td>
              </tr>
              <tr>
                <td>• Đơn hàng trên 5 triệu đồng</td>
                <td>Miễn phí</td>
                <td>Không áp dụng</td>
              </tr>
            </tbody>
          </table>

          <li style={{ textAlign: "center" }}>
            <i>
              Chính sách này có hiệu lực từ ngày 03 tháng 09 năm 2025.
            </i>
          </li>

          <li>
            Thời gian dự kiến giao hàng: phụ thuộc vào kho và địa chỉ nhận hàng
            của Quý khách. Thời gian dự kiến giao hàng tiêu chuẩn như sau:
          </li>

          <table className="table-tuyen">
            <thead>
              <tr>
                <th>Tuyến</th>
                <th>Khu vực</th>
                <th>Thời gian dự kiến</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hồ Chí Minh – Hồ Chí Minh</td>
                <td>Nội thành</td>
                <td>2 – 4 giờ</td>
              </tr>
              <tr>
                <td>Hồ Chí Minh – Miền Nam</td>
                <td>Trung tâm, Tỉnh lỵ, Phổ biến</td>
                <td>3 – 4 ngày</td>
              </tr>
              <tr>
                <td>Hồ Chí Minh – Miền Trung</td>
                <td>Trung tâm, Tỉnh lỵ, Phổ biến</td>
                <td>5 – 7 ngày</td>
              </tr>
              <tr>
                <td>Hồ Chí Minh – Miền Bắc</td>
                <td>Trung tâm, Tỉnh lỵ, Phổ biến</td>
                <td>5 – 7 ngày</td>
              </tr>
            </tbody>
          </table>

          <ul>
            <li>
              Nội thành Tp.HCM: Quận 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, Bình
              Tân, Gò Vấp, Thủ Đức, Bình Thạnh, Phú Nhuận, Tân Phú, Tân Bình.
            </li>
            <li>
              Nội thành Hà Nội: Hoàn Kiếm, Đống Đa, Ba Đình, Hai Bà Trưng, Hoàng
              Mai, Thanh Xuân, Tây Hồ, Cầu Giấy, Long Biên, Hà Đông, Nam Từ
              Liêm, Bắc Từ Liêm.
            </li>
          </ul>

          <div className="note">
            <h4>
              <u>Lưu ý</u>
            </h4>
            <ul>
              <li>
                • Trong một số trường hợp, hàng hóa không có sẵn tại kho gần
                nhất, thời gian giao hàng có thể chậm hơn dự kiến.
              </li>
              <li>
                • Ngày làm việc được hiểu là từ thứ 2 đến thứ 6, không tính thứ
                7, chủ nhật và các ngày nghỉ lễ.
              </li>
            </ul>
          </div>

          <h3>MỘT SỐ LƯU Ý KHI NHẬN HÀNG</h3>
          <ul className="luu-y-nhan-hang">
            <li>
              • Trước khi tiến hành giao hàng cho Quý khách, Hỗ trợ kỹ thuật
              (HTTK) của GearVN hoặc bưu tá sẽ liên hệ qua số điện thoại của Quý
              khách trước khoảng 3 đến 5 phút để xác nhận giao hàng.
            </li>
            <li>
              • Áp dụng cho đơn hàng giao hàng tiêu chuẩn, nếu Quý khách không
              thể có mặt trong đợt nhận hàng thứ nhất, bưu tá sẽ cố gắng liên lạc
              lại thêm ít nhất 2 lần nữa (trong 02 ca giao hàng khác nhau) để
              sắp xếp thời gian giao hàng.
            </li>
            <li>
              • Khi nhận hàng, Quý khách vui lòng quay lại video quá trình khui
              nhận hàng hóa. Trong trường hợp Quý khách không đồng ý nhận hàng
              do hàng hóa của GearVN không đảm bảo, không đúng mô tả,... đơn
              hàng sẽ được hoàn lại và hủy trên hệ thống.
            </li>
            <li>
              • Nếu hộp hàng có dấu hiệu bị rách, móp, ướt, thủng, mất niêm
              phong,… vui lòng kiểm tra kỹ sản phẩm trước khi nhận. Quý khách có
              quyền từ chối và gọi hotline{" "}
              <a href="tel:19005301">1900.5301</a>.
            </li>
            <li>
              • Nếu muốn thay đổi/hủy đơn, vui lòng liên hệ sớm với GearVN qua
              hotline <a href="tel:19005301">1900.5301</a>, fanpage hoặc{" "}
              <a href="https://gearvn.com/">website</a>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChinhSachGiaoHang;
