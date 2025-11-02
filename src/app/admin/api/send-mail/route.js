"use server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    // 🧩 Log kiểm tra biến môi trường
    console.log("ADMIN_EMAIL =", process.env.ADMIN_EMAIL);
    console.log("ADMIN_PASS =", process.env.ADMIN_PASS ? "ĐÃ TẢI ✅" : "CHƯA TẢI ❌");

    // 1️⃣ Cấu hình SMTP (dùng Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, // tạo biến môi trường
        pass: process.env.ADMIN_PASS,
      },
    });

    // 2️⃣ Gửi mail
    await transporter.sendMail({
      from: `"Hệ thống quản trị" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Mã xác thực đăng nhập (OTP)",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Xin chào Admin 👋</h2>
          <p>Mã OTP của bạn là:</p>
          <h1 style="color:#d62828;">${otp}</h1>
          <p>Mã này chỉ có hiệu lực trong 2 phút.</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Send mail error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}
