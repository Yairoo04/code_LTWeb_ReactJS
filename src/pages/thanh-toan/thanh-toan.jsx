import styles from './thanh-toan.module.scss';
import React from 'react';
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';
import common from '@/styles/common.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';


import { useEffect, useState } from 'react';
import { calculateGHNShippingFee } from '../../lib/api';

const ThanhToan = () => {
    const [shippingFee, setShippingFee] = useState(null);
    const [loadingFee, setLoadingFee] = useState(false);
    // Địa chỉ mẫu
    const receiverInfo = {
        name: 'nguyễn đình trí',
        phone: '0911754842',
        address: '97 Man Thiện, phường Hiệp Phú, thành phố Thủ Đức, thành phố Hồ Chí Minh',
    };

    useEffect(() => {
        async function fetchFee() {
            setLoadingFee(true);
            try {
                const fee = await calculateGHNShippingFee({
                    toAddress: receiverInfo.address,
                    weight: 5000,
                    length: 20,
                    width: 20,
                    height: 20,
                });
                setShippingFee(fee);
            } catch (e) {
                setShippingFee('Không lấy được phí ship');
            }
            setLoadingFee(false);
        }
        fetchFee();
    }, []);

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
                        <h2>Phí vận chuyển (GHN)</h2>
                        <div>
                            <strong>Người nhận:</strong> {receiverInfo.name}<br />
                            <strong>Số điện thoại:</strong> {receiverInfo.phone}<br />
                            <strong>Địa chỉ:</strong> {receiverInfo.address}<br />
                            <strong>Khối lượng:</strong> 5kg<br />
                            <strong>Kích thước:</strong> 20x20x20cm<br />
                            <strong>Phí ship:</strong> {loadingFee ? 'Đang tính...' : (shippingFee ? `${shippingFee.toLocaleString()}đ` : 'Không có dữ liệu')}
                        </div>
                    </div>

                    {/* ...existing code... */}
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