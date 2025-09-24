"use client";

import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import styles from "./RegisterModal.module.scss";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 className={styles.title}>Tạo tài khoản mới</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input type="text" placeholder="Tên của bạn" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.icon} />
            <input type="email" placeholder="Email" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input type="password" placeholder="Mật khẩu" className={styles.input} />
          </div>

          <button type="submit" className={styles.button}>ĐĂNG KÝ</button>
        </form>

        <p className={styles.footer}>
          Đã có tài khoản?{" "}
          <span className={styles.link} onClick={onSwitchToLogin}>
            Đăng nhập ngay!
          </span>
        </p>
      </div>
    </div>
  );
}
