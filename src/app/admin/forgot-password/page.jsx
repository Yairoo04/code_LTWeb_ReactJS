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
    <div className="admin-forgot-password-page">
      <h2>Quên mật khẩu Admin</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
      {message && <div className="message">{message}</div>}
      <div style={{ marginTop: 16 }}>
        <Link href="/admin/login">Quay lại đăng nhập</Link>
      </div>
    </div>
  );
}
