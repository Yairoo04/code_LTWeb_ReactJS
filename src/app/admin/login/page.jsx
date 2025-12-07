"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./login.scss";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = [
    useState(null)[0],
    useState(null)[0],
    useState(null)[0],
    useState(null)[0],
    useState(null)[0],
    useState(null)[0]
  ];
  const [serverOtp, setServerOtp] = useState("");
  const [otpExpireTime, setOtpExpireTime] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);
  const [lockRemaining, setLockRemaining] = useState(0);
  const [lastOtpTime, setLastOtpTime] = useState(0);
  const router = useRouter();

  // 🕒 Khi load trang, kiểm tra xem có đang bị khóa không
  useEffect(() => {
    const savedLock = localStorage.getItem("lockUntil");
    if (savedLock && Date.now() < parseInt(savedLock)) {
      const remain = Math.ceil((parseInt(savedLock) - Date.now()) / 1000);
      setLockUntil(parseInt(savedLock));
      setLockRemaining(remain);
      setError(`🔒 Tài khoản đang bị khóa. Thử lại sau ${remain}s.`);
    } else {
      localStorage.removeItem("lockUntil");
    }
  }, []);

  // ⏳ Đếm ngược thời gian khóa mỗi giây
  useEffect(() => {
    if (!lockUntil) return;
    const timer = setInterval(() => {
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
        setLockUntil(null);
        setLockRemaining(0);
        localStorage.removeItem("lockUntil");
        setError("");
      } else {
        setLockRemaining(remaining);
        setError(`🔒 Tài khoản đang bị khóa. Thử lại sau ${remaining}s.`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lockUntil]);

  // 📧 Gửi OTP (giới hạn 1 phút/lần)
  const sendOtp = async () => {
    const now = Date.now();
    if (now - lastOtpTime < 60000) {
      setError("⏳ Vui lòng chờ 1 phút trước khi yêu cầu mã OTP mới!");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    setServerOtp(code.toString());
    setOtpExpireTime(Date.now() + 2 * 60 * 1000);
    setLastOtpTime(now);

    try {
      const res = await fetch("/admin/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "quoctribmt111@gmail.com",
          otp: code,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Mã OTP đã được gửi đến email admin!");
        setStep(2);
      } else {
        setError("❌ Gửi mail thất bại: " + data.error);
      }
    } catch (err) {
      setError("❌ Lỗi kết nối tới server!");
    }
  };

  // 🔐 Xử lý đăng nhập bước 1
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (lockUntil && Date.now() < lockUntil) {
      return;
    }

    setSubmitting(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('user', JSON.stringify(data.data));
        if (data.data.role === 'Admin') {
          sendOtp();
        } else {
          Cookies.set("isLoggedIn", "true", { path: "/" });
          sessionStorage.setItem("isLoggedIn", "true");
          alert("✅ Đăng nhập thành công!");
          localStorage.removeItem("lockUntil");
          router.push("/admin/dashboard");
        }
        setFailedAttempts(0);
      } else {
        setFailedAttempts((prev) => prev + 1);
        setError(`❌ ${data.error || 'Sai tên đăng nhập hoặc mật khẩu!'}`);
        setShake(true);
        setTimeout(() => setShake(false), 500);

        if (failedAttempts + 1 >= 3) {
          const lockTime = Date.now() + 30000;
          setLockUntil(lockTime);
          localStorage.setItem("lockUntil", lockTime.toString());
          setFailedAttempts(0);
          setError("🔒 Bạn đã nhập sai quá 3 lần. Vui lòng thử lại sau 30 giây!");
        }
      }
    } catch (err) {
      setError("❌ Lỗi kết nối tới server!");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý nhập OTP từng ô
  const handleOtpChange = (index, value) => {
    // Chỉ cho phép số
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus ô tiếp theo
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  // Xử lý phím Backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  // Xử lý paste OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus ô cuối cùng có giá trị
    const lastIndex = Math.min(pastedData.length, 5);
    const lastInput = document.querySelector(`input[name="otp-${lastIndex}"]`);
    if (lastInput) lastInput.focus();
  };

  // ✅ Xử lý xác minh OTP
  const handleVerify = (e) => {
    e.preventDefault();

    if (Date.now() > otpExpireTime) {
      setError("⏱️ Mã OTP đã hết hạn, vui lòng yêu cầu mã mới!");
      return;
    }

    if (otp.join("").trim() === serverOtp) {
      Cookies.set("isLoggedIn", "true", { path: "/" });
      sessionStorage.setItem("isLoggedIn", "true");
      alert("✅ Đăng nhập thành công!");
      localStorage.removeItem("lockUntil");
      router.push("/admin/dashboard");
    } else {
      setError("❌ Mã OTP không đúng!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-box ${shake ? "shake" : ""}`}>
        {/* Logo */}
        <img 
          src="/images/logo.png" 
          alt="GTN Logo"
        />

        {/* Title */}
        <h2>Admin Portal</h2>
        <p>Đăng nhập vào hệ thống quản trị</p>

        {/* Error Message */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* STEP 1: Login Form */}
        {step === 1 && (
          <>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={username}
                onChange={(e) => setUser(e.target.value)}
                disabled={!!lockUntil}
              />
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                disabled={!!lockUntil}
              />
              <span
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5 0-9.27-3.11-10.74-7.5a10.05 10.05 0 0 1 2.54-3.73"/>
                    <path d="M1 1l22 22"/>
                    <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c.96 0 1.84-.36 2.5-.95"/>
                    <path d="M14.47 14.47A3.5 3.5 0 0 0 12 8.5c-.96 0-1.84.36-2.5.95"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12C2.73 7.61 7 4.5 12 4.5s9.27 3.11 10.74 7.5C21.27 16.39 17 19.5 12 19.5S2.73 16.39 1 12z"/>
                    <circle cx="12" cy="12" r="3.5"/>
                  </svg>
                )}
              </span>
            </div>

            <div className="remember-row">
              <label className="remember-label">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="forgot-link">Quên mật khẩu?</a>
            </div>

            <button onClick={handleLogin} disabled={isSubmitting || !!lockUntil}>
              {isSubmitting
                ? "Đang xác thực..."
                : lockUntil
                ? `Đang bị khóa (${lockRemaining}s)`
                : "Đăng nhập"}
            </button>
          </>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <>
            <p style={{ marginBottom: '25px', fontSize: '14px', color: '#64748b' }}>
              Nhập mã OTP được gửi đến email admin
            </p>

            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="off"
                />
              ))}
            </div>

            <button onClick={handleVerify}>Xác nhận OTP</button>

            {error && error.includes('hết hạn') && (
              <button
                type="button"
                onClick={sendOtp}
              >
                📧 Gửi lại mã OTP
              </button>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ color: '#fda4af', fontSize: '13px', marginTop: '25px', fontWeight: 500 }}>
           Bảo mật bởi SSL Encryption
        </div>
      </div>
    </div>
  );
}