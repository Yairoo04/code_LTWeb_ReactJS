


import React from 'react';
import './style.scss';
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';

const ChinhSachGiaoHang = () => {
    return (
        <div className="showroom-system-container">
            {/* Menu bên trái */}
            <MenuListShowroom active="/chinh-sach-giao-hang" />

            {/* Content bên phải */}
            <div className="content">
                <h2 className="title-page">Chính sách vận chuyển</h2>

                <section className="intro">
                    <p>
                        <b><i>GTN cung cấp dịch vụ giao hàng toàn quốc, giao hàng tận nơi đến địa chỉ cung cấp của Quý khách.</i></b>
                    </p>
                    <p>Thời gian giao hàng dự kiến phụ thuộc vào khu vực địa chỉ nhận hàng của Quý khách. Đa phần đơn hàng GearVN cần vài giờ làm việc để kiểm tra thông tin và đóng gói. Nếu sản phẩm có sẵn, GearVN sẽ nhanh chóng bàn giao cho đối tác vận chuyển.</p>
                </section>

                <section className="shipping-fee">
                    <h3>Phí dịch vụ giao hàng</h3>
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
                                <td colSpan="3" className="highlight">GIAO HÀNG NHANH 2H ĐẾN 4H</td>
                            </tr>
                            <tr>
                                <td>Đơn hàng dưới 5 triệu đồng</td>
                                <td>40.000 VND</td>
                                <td>Không áp dụng</td>
                            </tr>
                            <tr>
                                <td>Đơn hàng trên 5 triệu đồng</td>
                                <td>Miễn phí</td>
                                <td>Không áp dụng</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="effective-date"><i>Chính sách này có hiệu lực từ ngày 03/09/2025</i></p>
                </section>

                <section className="delivery-time">
                    <h3>Thời gian dự kiến giao hàng</h3>
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
                </section>

                <section className="area-list">
                    <h3>Nội thành</h3>
                    <ul>
                        <li>TP.HCM: Quận 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, Bình Tân, Gò Vấp, Thủ Đức, Bình Thạnh, Phú Nhuận, Tân Phú, Tân Bình.</li>
                        <li>Hà Nội: Hoàn Kiếm, Đống Đa, Ba Đình, Hai Bà Trưng, Hoàng Mai, Thanh Xuân, Tây Hồ, Cầu Giấy, Long Biên, Hà Đông, Nam Từ Liêm, Bắc Từ Liêm.</li>
                    </ul>
                </section>

                <section className="note">
                    <h4>Lưu ý</h4>
                    <ul>
                        <li>Hàng hóa không có sẵn tại kho gần nhất có thể làm chậm thời gian giao.</li>
                        <li>Ngày làm việc: từ thứ 2 – thứ 6 (không tính thứ 7, chủ nhật, ngày lễ).</li>
                    </ul>
                </section>

                <section className="receive-tips">
                    <h3>Một số lưu ý khi nhận hàng</h3>
                    <ul className="luu-y-nhan-hang">
                        <li>HTTK hoặc bưu tá liên hệ trước 3–5 phút để xác nhận giao hàng.</li>
                        <li>Nếu khách không có mặt lần 1, bưu tá sẽ liên lạc thêm ít nhất 2 lần khác.</li>
                        <li>Quay video khi nhận hàng; nếu không đồng ý nhận hàng do sản phẩm không đảm bảo sẽ hủy đơn.</li>
                        <li>Kiểm tra kỹ sản phẩm: rách, móp, ướt, mất niêm phong,... gọi <a href="tel:19005301">1900.5301</a> nếu cần từ chối.</li>
                        <li>Thay đổi/hủy đơn liên hệ <a href="tel:19005301">1900.5301</a>, fanpage hoặc <a href="https://gearvn.com/">website</a>.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default ChinhSachGiaoHang;
