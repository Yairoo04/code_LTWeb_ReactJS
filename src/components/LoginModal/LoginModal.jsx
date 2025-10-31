"use client";

import { useState } from "react";
import { FaUser, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa";
import styles from "./LoginModal.module.scss";
import { GoogleLogin } from "@react-oauth/google";


export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // reset lỗi

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Sai tài khoản hoặc mật khẩu!");
        return;
      }

      const userData = {
        username: data.user?.Username,
        fullname: data.user?.FullName || data.user?.fullname || "Người dùng",
        email: data.user?.Email,
        phone: data.user?.Phone,
        role: data.role,
        token: data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      onLoginSuccess(userData);

      alert("Đăng nhập thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
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
              placeholder="Email hoặc Username"
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
          <p>hoặc đăng nhập bằng</p>
          {/* <div className={styles.socialButtons}> */}
          {/* <button className={`${styles.socialBtn} ${styles.google}`}>
              <FaGoogle /> Google
            </button> */}
          <div className={styles.googleWrap}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const tokenGoogle = credentialResponse.credential;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/googleLogin`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tokenGoogle }),
                });

                const data = await res.json();
                if (!res.ok) {
                  setError(data.message || "Google login failed");
                  return;
                }

                const userData = {
                  username: data.user?.Username,
                  fullname: data.user?.FullName || "Người dùng",
                  email: data.user?.Email,
                  role: data.role,
                  token: data.token,
                };

                localStorage.setItem("user", JSON.stringify(userData));
                onLoginSuccess(userData);
                alert("Đăng nhập bằng Google thành công!");
                onClose();
              }}
              onError={() => setError("Google login thất bại!")}
            />
          </div>
          {/* <button className={`${styles.socialBtn} ${styles.facebook}`}>
              <FaFacebookF /> Facebook
            </button> */}
          {/* </div> */}
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
