"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "./login.module.scss";

export default function ShipperLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);
  const [lockRemaining, setLockRemaining] = useState(0);
  const router = useRouter();

  // Khi load trang, kiểm tra có đang bị khóa không
  useEffect(() => {
    const savedLock = localStorage.getItem("shipperLockUntil");
    if (savedLock && Date.now() < parseInt(savedLock)) {
      const remain = Math.ceil((parseInt(savedLock) - Date.now()) / 1000);
      setLockUntil(parseInt(savedLock));
      setLockRemaining(remain);
      setError(`🔒 Tài khoản đang bị khóa. Thử lại sau ${remain}s.`);
    } else {
      localStorage.removeItem("shipperLockUntil");
    }
  }, []);

  // Đếm ngược thời gian khóa
  useEffect(() => {
    if (!lockUntil) return;
    const timer = setInterval(() => {
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
        setLockUntil(null);
        setLockRemaining(0);
        localStorage.removeItem("shipperLockUntil");
        setError("");
      } else {
        setLockRemaining(remaining);
        setError(`🔒 Tài khoản đang bị khóa. Thử lại sau ${remaining}s.`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lockUntil]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (lockUntil && Date.now() < lockUntil) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/shipper/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        Cookies.set("shipperLoggedIn", "true", { path: "/" });
        const user = data.user;
        const shipperObj = { id: user.UserId, ...user };
        sessionStorage.setItem("shipper", JSON.stringify(shipperObj));
        localStorage.removeItem("shipperLockUntil");
        setFailedAttempts(0);
        router.push("/shipper");
      } else {
        // Nếu backend trả về "Sai tài khoản hoặc mật khẩu" thì kiểm tra user tồn tại
        if (data.message && data.message.toLowerCase().includes('tài khoản hoặc mật khẩu')) {
          // Nếu backend trả về thêm trường userNotFound thì không tăng failedAttempts
          if (data.userNotFound) {
            setError("❌ Tài khoản không tồn tại!");
            setFailedAttempts(0);
          } else {
            // Username đúng, password sai
            const nextFailed = failedAttempts + 1;
            setFailedAttempts(nextFailed);
            setError("❌ Sai mật khẩu!");
            if (nextFailed >= 3) {
              const lockTime = Date.now() + 30000;
              setLockUntil(lockTime);
              localStorage.setItem("shipperLockUntil", lockTime.toString());
              setFailedAttempts(0);
              setError("🔒 Bạn đã nhập sai mật khẩu 3 lần. Vui lòng thử lại sau 30 giây!");
            }
          }
        } else if (data.message && data.message.toLowerCase().includes('bị khóa')) {
          setError("❌ Tài khoản đã bị khóa. Vui lòng liên hệ admin!");
        } else if (data.message && data.message.toLowerCase().includes('quyền truy cập')) {
          setError("❌ Bạn không có quyền truy cập!");
        } else {
          setError("❌ " + (data.message || "Đăng nhập thất bại!"));
        }
      }
    } catch (err) {
      setError("Lỗi kết nối tới server!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-box">
        <h2>Đăng nhập Shipper</h2>
        {error && <div className="error-box" style={{maxWidth:320,margin:'0 auto',fontSize:'0.98rem',padding:'6px 10px',whiteSpace:'pre-line',minHeight:0}}>{error}</div>}
        <div className="input-group">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={!!lockUntil}
          />
        </div>
        <div className="input-group" style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!!lockUntil}
            style={{ paddingRight: '38px' }}
          />
          <span
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#888',
              fontSize: '1.2em',
              userSelect: 'none',
            }}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5 0-9.27-3.11-10.74-7.5a10.05 10.05 0 0 1 2.54-3.73"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c.96 0 1.84-.36 2.5-.95"/><path d="M14.47 14.47A3.5 3.5 0 0 0 12 8.5c-.96 0-1.84.36-2.5.95"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12C2.73 7.61 7 4.5 12 4.5s9.27 3.11 10.74 7.5C21.27 16.39 17 19.5 12 19.5S2.73 16.39 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
            )}
          </span>
        </div>
        <button type="submit" className="login-box__submit" disabled={isSubmitting || !!lockUntil}>
          {isSubmitting ? "Đang xác thực..." : lockUntil ? `Đang bị khóa (${lockRemaining}s)` : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
