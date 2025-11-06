import styles from './thanh-toan.module.scss';
import React from 'react';
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';
import common from '@/styles/common.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';

const ThanhToan = () => {
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
                <MenuListShowroom active="/thanh-toan" />

                <div className={styles.paymentContent}>
                    <h1>Hướng dẫn Thanh toán</h1>
                    <p className={styles.intro}>
                        Chúng tôi cung cấp nhiều hình thức thanh toán linh hoạt, an toàn và tiện lợi. Quý khách vui lòng
                    </p>

                    <div className={styles.paymentStep}>
                        <h2>1. Thanh toán khi nhận hàng (COD)</h2>
                        <p>
                            - Quý khách trả tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm. <br />- Hỗ trợ
                            toàn quốc, nhanh chóng và tiện lợi.
                        </p>
                    </div>

                    <div className={styles.paymentStep}>
                        <h2>2. Chuyển khoản ngân hàng</h2>
                        <p>
                            - Quý khách chuyển khoản theo thông tin sau, nội dung ghi rõ{' '}
                            <strong>Họ tên + SĐT + Mã đơn hàng</strong>:
                        </p>
                        <ul>
                            <li>
                                <strong>Ngân hàng:</strong> Vietcombank – Chi nhánh TP.HCM
                            </li>
                            <li>
                                <strong>Số tài khoản:</strong> 0123456789
                            </li>
                            <li>
                                <strong>Chủ tài khoản:</strong> Công ty TNHH GTN
                            </li>
                        </ul>
                    </div>

                    <div className={styles.paymentStep}>
                        <h2>3. Thanh toán qua ví điện tử</h2>
                        <p>
                            Chúng tôi hỗ trợ các ví điện tử phổ biến: MoMo, ZaloPay, ShopeePay. Khi đặt hàng, chọn “Thanh
                            toán qua ví điện tử” để được hướng dẫn.
                        </p>
                    </div>

                    <div className={styles.paymentStep}>
                        <h2>4. Lưu ý</h2>
                        <ul>
                            <li>Luôn giữ lại hoá đơn hoặc biên lai để tiện đối chiếu.</li>
                            <li>
                                Mọi thắc mắc xin gọi <strong>1900 9999</strong> để được hỗ trợ 24/7.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThanhToan;