"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ContainerFluid from "../../pages/main_Page/ContainerFluid/container-fluid";
import styles from "../forgot-password/forgot-password.module.scss";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      }
    );

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <>
      <Header />

      <ContainerFluid>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Đặt lại mật khẩu</h2>

          <input
            type="password"
            className={styles.input}
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.button} onClick={handleReset}>
            Xác nhận
          </button>

          <p className={styles.message}>{msg}</p>
        </div>
      </ContainerFluid>

      <Footer />
    </>
  );
}
