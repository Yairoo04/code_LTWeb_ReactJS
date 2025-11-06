"use client";

import styles from './Footer.module.scss';
import Link from 'next/link';
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';

export default function Footer() {
  return (
    <footer className={styles.mainFooter}>
      <ContainerFluid>
        <div className={styles.mainFooterTop}>
          <div className={styles.companyInfo}>
            <h4>VỀ GTN</h4>
            <ul>
              <li><Link href="/gioi-thieu-gtn">Giới thiệu</Link></li>
              <li><Link href="/tuyen-dung">Tuyển dụng</Link></li>
              <li><Link href="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          <div className={styles.companyInfo}>
            <h4>CHÍNH SÁCH</h4>
            <ul>
              <li><Link href="/chinh-sach-bao-hanh">Chính sách bảo hành</Link></li>
              <li><Link href="/chinh-sach-giao-hang">Chính sách giao hàng</Link></li>
              <li><Link href="/chinh-sach-thanh-toan">Chính sách thanh toán</Link></li>
              <li><Link href="/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
              <li><Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div className={styles.companyInfo}>
            <h4>THÔNG TIN</h4>
            <ul>
              <li><Link href="/he-thong-cua-hang">Hệ thống cửa hàng</Link></li>
              <li><Link href="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/build-pc">Build PC</Link></li>
            </ul>
          </div>
          <div className={styles.supportInfo}>
            <h4>TỔNG ĐÀI HỖ TRỢ (8:00 - 21:00)</h4>
            <div className={styles.listInfo}>
              <p>
                <span>Mua hàng:</span>
                <a href="">1900.5301</a>
              </p>
              <p>
                <span>Bảo hành:</span>
                <a href="">1900.5325</a>
              </p>
              <p>
                <span>Khiếu nại:</span>
                <a href="">1800.6173</a>
              </p>
              <p>
                <span>Email:</span>
                <a href="">cskh@gtn.com</a>
              </p>
            </div>
          </div>

          <div className={styles.companyInfo_paymentOption}>
            <div className={styles.shippingInfo}>
              <h4>ĐƠN VỊ VẬN CHUYỂN</h4>
              <div className={styles.shippingList}>
                <img src="/images/footerImg/GTN_logistic.jpg" alt="GTN Logistic" />
                {/* Thêm các logo khác nếu cần */}
              </div>
            </div>
            <div className={styles.payment}>
              <h4>CÁCH THỨC THANH TOÁN</h4>
              <div className={styles.bankList}>
                <img src="/images/footerImg/zalo_pay_banking.png" alt="ZaloPay" />
                <img src="/images/footerImg/momo_banking.png" alt="MoMo" />
                {/* Thêm các logo khác nếu cần */}
              </div>
            </div>
          </div>
        </div>
      </ContainerFluid>

      <ContainerFluid>
        <div className={styles.mainFooterBottom}>
          <div className={styles.companyInfo}>
            <h4>KẾT NỐI VỚI CHÚNG TÔI</h4>
            <div className={styles.socialIcons}>
              <a href="https://facebook.com"><img src="/images/footerImg/facebook_icon.png" alt="Facebook" /></a>
              <a href="https://tiktok.com"><img src="/images/footerImg/tiktok_icon.png" alt="TikTok" /></a>
              <a href="https://youtube.com"><img src="/images/footerImg/youtube_icon.png" alt="YouTube" /></a>
              <a href="https://zalo.me"><img src="/images/footerImg/zalo_icon.png" alt="Zalo" /></a>
            </div>
          </div>
          <div className={styles.address}>
            {/* <img src="/images/bo-cong-thuong.png" alt="Bộ Công Thương" /> */}
          </div>
        </div>
      </ContainerFluid>
    </footer>
  );
}