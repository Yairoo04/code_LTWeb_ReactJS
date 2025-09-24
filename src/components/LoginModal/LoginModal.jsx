"use client";

import { useState } from "react";
import { FaUser, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa";
import styles from "./LoginModal.module.scss";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra form
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Giả lập login thành công
    const userData = { name: "Nguyệt", email };
    onLoginSuccess(userData);

    // Đóng modal
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 className={styles.title}>Đăng nhập</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Mật khẩu"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
