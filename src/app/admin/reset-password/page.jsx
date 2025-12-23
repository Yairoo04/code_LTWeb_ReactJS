"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "../forgot-password/forgot-password.scss";

export default function AdminResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Mật khẩu không khớp.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Đặt lại mật khẩu thành công. Đang chuyển hướng...");
        setTimeout(() => router.push("/admin/login"), 2000);
      } else {
        setMessage(data.error || "Có lỗi xảy ra.");
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-forgot-password-page">
      <h2>Đặt lại mật khẩu Admin</h2>
      <form onSubmit={handleSubmit}>
        <label>Mật khẩu mới</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label>Xác nhận mật khẩu</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </button>
      </form>
      {message && <div className="message">{message}</div>}
      <div style={{ marginTop: 16 }}>
        <Link href="/admin/login">Quay lại đăng nhập</Link>
      </div>
    </div>
  );
}
