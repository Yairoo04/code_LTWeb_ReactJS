import styles from './chinh-sach-bao-hanh.module.scss';
import React from 'react';
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';
import common from '@/styles/common.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';

const ChinhSachBaoHanh = () => {
    return (
        <>
            <div className={common.breadcrumbWrap}>
                <ContainerFluid>
                    <div className={common.breadcrumbList}>
                        <ol className={common.breadcrumbArrow}>
                            <FontAwesomeIcon icon={faHouse} className={common.icon} />
                            <li><a href="/"> Trang chủ</a></li>
                            <li><strong>Tất cả sản phẩm</strong></li>
                        </ol>
                    </div>
                </ContainerFluid>
            </div>
            <div className={common.showroomSystemContainer}>
                {/* Menu bên trái */}
                <MenuListShowroom active="/chinh-sach-bao-hanh" />

                {/* Nội dung bên phải */}
                <div className={styles.policyContent}>
                    <h1>Chính sách bảo hành</h1>
                    <p>
                        GearVN cam kết mang đến cho khách hàng dịch vụ hậu mãi tốt nhất với chính sách bảo hành rõ ràng,
                        minh bạch và nhanh chóng. Tất cả sản phẩm khi mua tại GearVN đều được hưởng chế độ bảo hành chính
                        hãng hoặc bảo hành tại hệ thống GearVN tùy theo từng sản phẩm.
                    </p>

                    <h2>I. Điều kiện bảo hành</h2>
                    <ul>
                        <li>Sản phẩm còn trong thời hạn bảo hành được tính kể từ ngày mua hàng.</li>
                        <li>Sản phẩm phải còn tem bảo hành của hãng hoặc của GearVN.</li>
                        <li>
                            Sản phẩm không thuộc trường hợp từ chối bảo hành (hư hỏng do tác động vật lý, vào nước, cháy nổ,
                            tự ý sửa chữa... ).
                        </li>
                    </ul>

                    <h2>II. Trường hợp từ chối bảo hành</h2>
                    <ul>
                        <li>Sản phẩm hết thời hạn bảo hành.</li>
                        <li>
                            Hư hỏng do lỗi người dùng (rơi vỡ, biến dạng, cháy nổ, vào chất lỏng, côn trùng xâm nhập...).
                        </li>
                        <li>Không có tem bảo hành, tem bị rách hoặc có dấu hiệu cạo sửa.</li>
                        <li>Sản phẩm đã được sửa chữa ở nơi khác ngoài hệ thống GearVN hoặc TTBH chính hãng.</li>
                    </ul>

                    <h2>III. Thời gian bảo hành</h2>
                    <p>
                        GearVN tiếp nhận và xử lý bảo hành trong thời gian nhanh nhất có thể. Thông thường, thời gian bảo
                        hành từ 7 – 15 ngày làm việc (tùy thuộc vào tình trạng và linh kiện thay thế).
                    </p>

                    <h2>IV. Quy định đổi sản phẩm mới</h2>
                    <ul>
                        <li>
                            Sản phẩm bị lỗi kỹ thuật trong vòng <b>7 ngày</b> kể từ ngày mua sẽ được đổi mới cùng model hoặc
                            sản phẩm tương đương.
                        </li>
                        <li>Sản phẩm đổi mới phải đầy đủ hộp, phụ kiện và không bị trầy xước, móp méo.</li>
                    </ul>

                    <h2>V. Hướng dẫn bảo hành</h2>
                    <p>Khách hàng có thể bảo hành sản phẩm theo 2 cách:</p>
                    <ul>
                        <li>Đem trực tiếp sản phẩm đến hệ thống cửa hàng GearVN trên toàn quốc.</li>
                        <li>Gửi sản phẩm qua đường bưu điện / chuyển phát nhanh về trung tâm bảo hành của GearVN.</li>
                    </ul>

                    <h2>VI. Liên hệ hỗ trợ</h2>

                    <div className={styles.contactInfo}>
                        <p>Khi có nhu cầu bảo hành sản phẩm, khách hàng vui lòng liên hệ với GearVN qua các hình thức:</p>
                        <ul>
                            <li>
                                📞 Gọi tổng đài bảo hành: <b>1900.5325</b>
                            </li>
                            <li>💬 Gửi tin nhắn trực tiếp tại website hoặc fanpage</li>
                            <li>
                                🏢 Mang sản phẩm trực tiếp đến các chi nhánh cửa hàng hoặc Trung tâm bảo hành của GearVN
                            </li>
                            <li>🏭 Mang sản phẩm trực tiếp đến Trung tâm bảo hành của hãng/nhà cung cấp</li>
                        </ul>
                        <p>Xem hệ thống Showroom GearVN tại đây:</p>
                        <div className={styles.mapSection}>
                            <h2>Hệ thống Showroom GearVN</h2>
                            <div className={styles.mapGrid}>
                                <div className={styles.mapBox}>
                                    <iframe
                                        src="https://www.google.com/maps?q=16.0722,108.2230&hl=vi&z=15&output=embed"
                                        title="Showroom 1"
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                    ></iframe>
                                </div>
                                <div className={styles.mapBox}>
                                    <iframe
                                        src="https://www.google.com/maps?q=10.762622,106.660172&hl=vi&z=15&output=embed"
                                        title="Showroom 2"
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                    ></iframe>
                                </div>
                                <div className={styles.mapBox}>
                                    <iframe
                                        src="https://www.google.com/maps?q=21.0278,105.8342&hl=vi&z=15&output=embed"
                                        title="Showroom 3"
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                    ></iframe>
                                </div>
                                <div className={styles.mapBox}>
                                    <iframe
                                        src="https://www.google.com/maps?q=10.7620,106.6825&hl=vi&z=15&output=embed"
                                        title="Showroom 4"
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tra cứu phiếu bảo hành */}
                    <div className={styles.traCuuSection}>
                        <h2>Tra cứu phiếu bảo hành</h2>
                        <form>
                            <div className={styles.formGroup}>
                                <label>Số điện thoại</label>
                                <input type="text" placeholder="Nhập số điện thoại" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mã phiếu</label>
                                <input type="text" placeholder="Nhập mã phiếu" />
                            </div>
                            <button type="submit">Tra cứu</button>
                        </form>
                    </div>

                    {/* Tra cứu IMEI */}
                    <div className={styles.traCuuSection}>
                        <h2>Tra cứu IMEI</h2>
                        <form>
                            <div className={styles.formGroup}>
                                <label>IMEI</label>
                                <input type="text" placeholder="Nhập số IMEI" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Captcha</label>
                                <input type="text" placeholder="Nhập mã xác thực" />
                            </div>
                            <button type="submit">Xác thực</button>
                        </form>
                    </div>

                    <div className={styles.note}>
                        Khách hàng cũng có thể gửi sản phẩm bảo hành thông qua đơn vị vận chuyển. GearVN sẽ phản hồi thông
                        tin liên quan sau khi tiếp nhận sản phẩm. Vui lòng liên hệ nhân viên tư vấn trước khi gửi hàng để
                        được hỗ trợ.
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChinhSachBaoHanh;