"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import styles from "./LoginModal.module.scss";
import { GoogleLogin } from "@react-oauth/google";
import { saveAuth } from "../../lib/auth";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ĐĂNG NHẬP THƯỜNG
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Sai tài khoản hoặc mật khẩu!");
        return;
      }

      const userData = {
        id: data.user?.id,
        fullname: data.user?.fullname || "Người dùng",
        email: data.user?.email || email,
        phone: data.user?.phone || "",
        role: data.user?.role || "Customer",
      };

      console.log("Login success:", { userData, token: data.token });
      saveAuth(userData, data.token);
      onLoginSuccess?.(userData);
      onClose();
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // ĐĂNG NHẬP GOOGLE
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        setError("Không nhận được credential từ Google!");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập Google thất bại!");
        return;
      }

      const userData = {
        id: data.user?.id,
        userId: data.user?.userId, // 👈 Thêm dòng này
        fullname: data.user?.fullname || data.user?.username || "Người dùng Google",
        email: data.user?.email,
        phone: data.user?.phone || "",
        role: data.user?.role || "Customer",
      };

      console.log("Google login success:", { userData, token: data.token });
      saveAuth(userData, data.token);
      onLoginSuccess?.(userData);
      onClose();
    } catch (err) {
      console.error("Google login error:", err);
      setError("Không thể kết nối tới máy chủ Google.");
    }
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

          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <div className={styles.socialLogin}>
          <p>hoặc đăng nhập bằng Google</p>
          <div className={styles.googleWrap}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login thất bại!")}
            />
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
