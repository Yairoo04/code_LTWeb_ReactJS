"use client";

import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import styles from "./RegisterModal.module.scss";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // Luu loi hien thi len form
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  // Kiem tra mat khau manh
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (!/[A-Z]/.test(pwd)) return "Mật khẩu phải chứa ít nhất một chữ cái in hoa.";
    if (!/[a-z]/.test(pwd)) return "Mật khẩu phải chứa ít nhất một chữ cái thường.";
    if (!/[0-9]/.test(pwd)) return "Mật khẩu phải chứa ít nhất một chữ số.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Kiem tra du lieu dau vao
    if (!username || !email || !password || !phone) {
      setErrorMsg("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiem tra dinh dang email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("⚠️ Email không hợp lệ!");
      return;
    }

    // Kiem tra so dien thoai
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg("⚠️ Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!");
      return;
    }

    // Kiem tra do manh mat khau
    const pwdError = validatePassword(password);
    if (pwdError) {
      setErrorMsg("⚠️ " + pwdError);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Đăng ký thất bại!");
        return;
      }

      // Thành công
      setSuccessMsg("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
      setTimeout(() => {
        onClose();
        onSwitchToLogin();
      }, 1500);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setErrorMsg("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 className={styles.title}>Tạo tài khoản mới</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              placeholder="Tên người dùng"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FaPhone className={styles.icon} />
            <input
              type="text"
              placeholder="Số điện thoại"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Mật khẩu (8 ký tự, có hoa, thường và số)"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Hien thi loi hoac thong bao thanh cong */}
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
          {successMsg && <p className={styles.success}>{successMsg}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
          </button>
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
