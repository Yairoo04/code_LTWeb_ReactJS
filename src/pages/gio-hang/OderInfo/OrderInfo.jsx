// OrderInfo.jsx - Component cho bước Thông tin đặt hàng
'use client';

import Link from 'next/link';
import styles from './OrderInfo.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faFileAlt, faCreditCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function OrderInfo() {
  return (
    <div className={styles.orderBox}>
      <Link href="/gio-hang" className={styles.backLink}>
        &lt; Quay lại giỏ hàng
      </Link>

      <div className={styles.progressBar}>
        <div className={styles.stepCompleted}>
          <FontAwesomeIcon icon={faShoppingCart} className={styles.stepIcon} />
          <span>Giỏ hàng</span>
        </div>
        <div className={styles.stepLine}>—</div>
        <div className={styles.stepActive}>
          <FontAwesomeIcon icon={faFileAlt} className={styles.stepIcon} />
          <span>Thông tin đặt hàng</span>
        </div>
        <div className={styles.stepLine}>—</div>
        <div className={styles.step}>
          <FontAwesomeIcon icon={faCreditCard} className={styles.stepIcon} />
          <span>Thanh toán</span>
        </div>
        <div className={styles.stepLine}>—</div>
        <div className={styles.step}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.stepIcon} />
          <span>Hoàn tất</span>
        </div>
      </div>

      <form className={styles.orderForm}>
        {/* Các trường thông tin: tên, địa chỉ, email, phone, ghi chú, v.v. */}
        <input type="text" placeholder="Họ và tên" required />
        <input type="email" placeholder="Email" required />
        <input type="tel" placeholder="Số điện thoại" required />
        <input type="text" placeholder="Địa chỉ" required />
        {/* Thêm các trường khác */}
        <Link href="/thanh-toan" className={styles.nextButton}>
          TIẾP TỤC THANH TOÁN
        </Link>
      </form>
    </div>
  );
}