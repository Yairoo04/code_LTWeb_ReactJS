import styles from './dieu-khoan-dich-vu.module.scss';
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';
import common from '@/styles/common.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';

const DieuKhoan = () => {
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
                <MenuListShowroom active="/dieu-khoan" />

                {/* Nội dung */}
                <div className={styles.termsContent}>
                    <h1>Điều khoản dịch vụ</h1>

                    <h2>1. Giới thiệu</h2>
                    <p>Chào mừng quý khách hàng đến với website chúng tôi.</p>
                    <p>
                        Khi quý khách hàng truy cập vào trang website của chúng tôi có nghĩa là quý khách đồng ý với các
                        điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều
                        khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên
                        trang web mà không cần thông báo trước. Và khi quý khách tiếp tục sử dụng trang web, sau khi các
                        thay đổi về Điều khoản này được đăng tải, có nghĩa là quý khách chấp nhận với những thay đổi đó.
                    </p>
                    <p>Quý khách hàng vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi.</p>

                    <h2>2. Hướng dẫn sử dụng website</h2>
                    <p>
                        Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của
                        cha mẹ hay người giám hộ hợp pháp. Khách hàng đảm bảo có đầy đủ hành vi dân sự để thực hiện các giao
                        dịch mua bán hàng hóa theo quy định hiện hành của pháp luật Việt Nam.
                    </p>
                    <p>
                        Trong suốt quá trình đăng ký, quý khách đồng ý nhận email quảng cáo từ website. Nếu không muốn tiếp
                        tục nhận mail, quý khách có thể từ chối bằng cách nhấp vào đường link ở dưới cùng trong mọi email
                        quảng cáo.
                    </p>

                    <h2>3. Thanh toán an toàn và tiện lợi</h2>
                    <p>
                        Người mua có thể tham khảo các phương thức thanh toán sau đây và lựa chọn áp dụng phương thức phù
                        hợp:
                    </p>
                    <ul>
                        <li>Cách 1: Thanh toán trực tiếp (người mua nhận hàng tại địa chỉ người bán)</li>
                        <li>Cách 2: Thanh toán sau (COD – giao hàng và thu tiền tận nơi)</li>
                        <li>Cách 3: Thanh toán online qua thẻ tín dụng, chuyển khoản</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DieuKhoan;