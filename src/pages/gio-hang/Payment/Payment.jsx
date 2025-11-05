// Payment.jsx - Component cho bước Thanh toán
'use client';

import Link from 'next/link';
import styles from './Payment.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faFileAlt, faCreditCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function Payment() {
  return (
    <div className={styles.paymentBox}>
      <Link href="/thong-tin-dat-hang" className={styles.backLink}>
        &lt; Quay lại thông tin
      </Link>

      <div className={styles.progressBar}>
        <div className={styles.stepCompleted}>
          <FontAwesomeIcon icon={faShoppingCart} className={styles.stepIcon} />
          <span>Giỏ hàng</span>
        </div>
        <div className={styles.stepLine}>—</div>
        <div className={styles.stepCompleted}>
          <FontAwesomeIcon icon={faFileAlt} className={styles.stepIcon} />
          <span>Thông tin đặt hàng</span>
        </div>
        <div className={styles.stepLine}>—</div>
        <div className={styles.stepActive}>
          <FontAwesomeIcon icon={faCreditCard} className={styles.stepIcon} />
          <span>Thanh toán</span>
        </div>
        <div className={styles.stepLine}>—</div>
        <div className={styles.step}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.stepIcon} />
          <span>Hoàn tất</span>
        </div>
      </div>

      <div className={styles.paymentOptions}>
        {/* Các lựa chọn thanh toán: COD, thẻ, ví điện tử, v.v. */}
        <button onClick={() => {/* Xử lý thanh toán */}} className={styles.payButton}>
          THANH TOÁN
        </button>
      </div>
    </div>
  );
}