// Complete.jsx - Component cho bước Hoàn tất
'use client';

import Link from 'next/link';
import styles from './Complete.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faFileAlt, faCreditCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function Complete() {
  return (
    <div className={styles.completeBox}>
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
        <div className={styles.stepCompleted}>
          <FontAwesomeIcon icon={faCreditCard} className={styles.stepIcon} />
          <span>Thanh toán</span>
        </div>
        <div className={styles.stepLine}>—</div>
        <div className={styles.stepActive}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.stepIcon} />
          <span>Hoàn tất</span>
        </div>
      </div>

      <div className={styles.successMessage}>
        <p>Đơn hàng của bạn đã được đặt thành công!</p>
        <Link href="/" className={styles.homeButton}>
          QUAY VỀ TRANG CHỦ
        </Link>
      </div>
    </div>
  );
}