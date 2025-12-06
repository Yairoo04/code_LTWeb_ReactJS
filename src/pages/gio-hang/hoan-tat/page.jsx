'use client';

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function HoanTatPage() {
  const searchParams = useSearchParams();

  const momoOrderId = searchParams.get("orderId") || "";
  const resultCode = Number(searchParams.get("resultCode"));   // ép thành số để chắc ăn
  const partnerCode = searchParams.get("partnerCode");

  // Lấy orderId thực sự từ chuỗi GTN1234_1712345678
  const match = momoOrderId.match(/GTN(\d+)_/);
  const realOrderId = match ? match[1] : "N/A";

  const isMomo = partnerCode === "MOMO";
  const isSuccess = isMomo && resultCode === 0;
  const isFailed = isMomo && resultCode !== 0;

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: isSuccess ? '#e30019' : 'red', fontSize: '36px' }}>
        {isSuccess ? "ĐẶT HÀNG THÀNH CÔNG!" : "THANH TOÁN THẤT BẠI"}
      </h1>

      <p style={{ fontSize: '24px', margin: '20px 0' }}>
        Mã đơn hàng: <strong style={{ color: '#e30019' }}>#{realOrderId}</strong>
      </p>

      {isSuccess && (
        <div style={{
          display: 'inline-block',
          background: '#e30019',
          color: 'white',
          padding: '16px 40px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '20px',
          margin: '20px 0'
        }}>
          THANH TOÁN THÀNH CÔNG QUA MOMO
        </div>
      )}

      {isFailed && (
        <div style={{
          display: 'inline-block',
          background: 'gray',
          color: 'white',
          padding: '16px 40px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '20px',
          margin: '20px 0'
        }}>
          THANH TOÁN THẤT BẠI – ĐƠN HÀNG ĐÃ BỊ HỦY
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <Link
          href={`/tai-khoan/don-hang/${realOrderId}`}
          style={{
            display: 'inline-block',
            background: '#e30019',
            color: 'white',
            padding: '16px 40px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            margin: '0 15px'
          }}
        >
          XEM CHI TIẾT ĐƠN HÀNG
        </Link>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: '#333',
            color: 'white',
            padding: '16px 40px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            margin: '0 15px'
          }}
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    </div>
  );
}
