"use client";

import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ContainerFluid from "../../pages/main_Page/ContainerFluid/container-fluid";
import styles from "./forgot-password.module.scss";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const handleSend = async () => {
        setMsg("Đang gửi email...");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
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
                    <h2 className={styles.title}>Khôi phục mật khẩu</h2>

                    <input
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                    />

                    <button className={styles.button} onClick={handleSend}>
                        Gửi mail khôi phục
                    </button>

                    <p className={styles.message}>{msg}</p>
                </div>
            </ContainerFluid>

            <Footer />
        </>
    );
}
