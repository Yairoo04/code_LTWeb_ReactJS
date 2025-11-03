"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./login.scss";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [otpExpireTime, setOtpExpireTime] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);
  const [lockRemaining, setLockRemaining] = useState(0); // ⏱ Thời gian còn lại
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

  //  Gửi OTP (giới hạn 1 phút/lần)
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
        alert(" Mã OTP đã được gửi đến email admin!");
        setStep(2);
      } else {
        setError("Gửi mail thất bại: " + data.error);
      }
    } catch (err) {
      setError("❌ Lỗi kết nối tới server!");
    }
  };

  //  Xử lý đăng nhập bước 1
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (lockUntil && Date.now() < lockUntil) {
      return; // đang khóa thì không xử lý
    }

    setSubmitting(true);

    setTimeout(() => {
      const uname = username.trim().toLowerCase();
      const allowed = { admin: "ADMIN", manager: "MANAGER", staff01: "STAFF" };
      if (allowed[uname] && password === "123456") {
        sendOtp();
        setFailedAttempts(0);
      } else {
        setFailedAttempts((prev) => prev + 1);
        setError("❌ Sai tên đăng nhập hoặc mật khẩu!");
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
      setSubmitting(false);
    }, 800);
  };

  //  Xử lý xác minh OTP
  const handleVerify = (e) => {
    e.preventDefault();

    if (Date.now() > otpExpireTime) {
      setError("Mã OTP đã hết hạn, vui lòng yêu cầu mã mới!");
      return;
    }

    if (otp.trim() === serverOtp) {
      Cookies.set("isLoggedIn", "true", { path: "/" });
      sessionStorage.setItem("isLoggedIn", "true");
      const allowed = { admin: "ADMIN", manager: "MANAGER", staff01: "STAFF" };
      const role = allowed[username.trim().toLowerCase()] || "STAFF";
      sessionStorage.setItem("user", JSON.stringify({ username, role }));

      alert(" Đăng nhập thành công!");
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
      <form
        onSubmit={step === 1 ? handleLogin : handleVerify}
        className={`login-box ${shake ? "shake" : ""}`}
      >
        <h2>Đăng nhập quản trị</h2>

        {error && (
          <div className="error-box">
            {error}

          </div>
        )}

        {step === 1 && (
          <>
            <div className="input-group">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUser(e.target.value)}
                disabled={!!lockUntil}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                disabled={!!lockUntil}
              />
            </div>

            <button type="submit" disabled={isSubmitting || !!lockUntil}>
              {isSubmitting
                ? "Đang xác thực..."
                : lockUntil
                ? `Đang bị khóa (${lockRemaining}s)`
                : "Đăng nhập"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p>Nhập mã OTP được gửi đến email admin</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button type="submit">Xác nhận OTP</button>
          </>
        )}
      </form>
    </div>
  );
}
