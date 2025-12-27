"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./forgot-password.scss";



export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      } else {
        setMessage(data.error || "Không tìm thấy tài khoản hoặc email không đúng.");
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page forgot-bg">
      <div className="login-box forgot-box">
        <h2>Quên mật khẩu</h2>
        <p style={{color:'#64748b', marginBottom: 18, fontWeight: 500}}>Nhập email tài khoản admin hoặc staff để nhận hướng dẫn đặt lại mật khẩu.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
        {message && <div className="message" style={{marginTop:12}}>{message}</div>}
        <div style={{ marginTop: 24 }}>
          <Link href="/admin/login" className="forgot-link">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
