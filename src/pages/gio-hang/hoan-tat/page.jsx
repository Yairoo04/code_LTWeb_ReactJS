'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function HoanTatPage() {
  const searchParams = useSearchParams();

  const fromMoMo = searchParams.get('from');
  const momoOrderId = searchParams.get('orderId');
  const resultCode = searchParams.get('resultCode');
  const orderId = searchParams.get('orderId') || 'N/A';
  const paid = searchParams.get('paid');

  // CHỈ CHẠY KHI TRẢ VỀ TỪ MOMO
  useEffect(() => {
    if (fromMoMo === 'momo' && momoOrderId && resultCode === '0') {
      const realOrderId = momoOrderId.split('GTN')[1]?.split('_')[0];
      if (!realOrderId || isNaN(Number(realOrderId))) return;

      const updateStatus = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const res = await fetch('http://localhost:4000/api/orders/update-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId: Number(realOrderId) }),
          });

          if (res.ok) {
            console.log('CẬP NHẬT TRẠNG THÁI THÀNH CÔNG TẠI TRANG HOÀN TẤT #', realOrderId);
          }
        } catch (err) {
          console.error('Lỗi update-status:', err);
        }
      };

      updateStatus();
    }
  }, [fromMoMo, momoOrderId, resultCode]);

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#e30019', fontSize: '36px' }}>ĐẶT HÀNG THÀNH CÔNG!</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>
        Mã đơn hàng: <strong style={{ color: '#e30019' }}>#{orderId}</strong>
      </p>

      {paid === '1' && (
        <div style={{ 
          display: 'inline-block', 
          background: '#e30019', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          margin: '20px 0'
        }}>
          ĐÃ THANH TOÁN QUA MOMO
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <Link href={`/don-hang/${orderId}`} style={{
          display: 'inline-block',
          background: '#e30019',
          color: 'white',
          padding: '14px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          margin: '0 10px'
        }}>
          XEM CHI TIẾT ĐƠN HÀNG
        </Link>

        <Link href="/" style={{
          display: 'inline-block',
          background: '#333',
          color: 'white',
          padding: '14px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          margin: '0 10px'
        }}>
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    </div>
  );
}