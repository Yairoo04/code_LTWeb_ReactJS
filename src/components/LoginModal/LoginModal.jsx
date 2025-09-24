"use client";

import { useState } from "react";
import { FaUser, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa";
import styles from "./LoginModal.module.scss";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 className={styles.title}>Đăng nhập</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input type="email" placeholder="Email" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input type="password" placeholder="Mật khẩu" className={styles.input} />
          </div>

          <button type="submit" className={styles.button}>ĐĂNG NHẬP</button>
        </form>

        <div className={styles.socialLogin}>
          <p>hoặc đăng nhập bằng</p>
          <div className={styles.socialButtons}>
            <button className={`${styles.socialBtn} ${styles.google}`}>
              <FaGoogle /> Google
            </button>
            <button className={`${styles.socialBtn} ${styles.facebook}`}>
              <FaFacebookF /> Facebook
            </button>
          </div>
        </div>

        <p className={styles.footer}>
          Bạn chưa có tài khoản?{" "}
          <span className={styles.link} onClick={onSwitchToRegister}>
            Đăng ký ngay!
          </span>
        </p>
      </div>
    </div>
  );
}
