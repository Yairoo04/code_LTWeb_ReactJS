// app/products/[productId]/BuyNowButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.scss';

type Address = {
  AddressId: number;
  ReceiverName: string;
  PhoneNumber: string;
  Street: string;
  City: string;
  Province: string;
  IsDefault: boolean;
  fullAddress: string;
  displayText: string;
};

type Props = {
  productId: number;
  stock: number;
  productName?: string;
};

// GỬI SỰ KIỆN MỞ MODAL ĐĂNG NHẬP
const openLoginModal = () => {
  window.dispatchEvent(new CustomEvent('open-login-modal'));
};

export default function BuyNowButton({ productId, stock, productName }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);

  const router = useRouter();
  const maxQty = Math.min(stock, 99);

  // Hàm fetch có xử lý 401 
  const fetchWithAuth = async (url: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      openLoginModal();
      throw new Error('Chưa đăng nhập');
    }

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      openLoginModal();
      throw new Error('Phiên đăng nhập hết hạn');
    }

    if (!res.ok) throw new Error('Lỗi tải dữ liệu');
    return res.json();
  };

  // Lấy danh sách địa chỉ khi mở modal
  useEffect(() => {
    if (!showModal) return;

    const loadAddresses = async () => {
      try {
        const rawAddrs = await fetchWithAuth('/api/address');
        const formatted = (rawAddrs || []).map((addr: any) => {
          const parts = [addr.Street, addr.City, addr.Province].filter(Boolean);
          const full = parts.length > 0 ? parts.join(', ') : 'Chưa có địa chỉ chi tiết';
          return {
            ...addr,
            fullAddress: full,
            displayText: `${addr.ReceiverName} | ${addr.PhoneNumber} - ${full}`,
          };
        });

        setAddresses(formatted);

        // Tự động chọn địa chỉ mặc định
        const defaultAddr = formatted.find((a: Address) => a.IsDefault);
        const addrToUse = defaultAddr || formatted[0];
        if (addrToUse) {
          setSelectedAddress(addrToUse.fullAddress);
          setName(addrToUse.ReceiverName);
          setPhone(addrToUse.PhoneNumber);
        }
      } catch (err) {
        console.error('Lỗi tải địa chỉ:', err);
      }
    };

    loadAddresses();
  }, [showModal]);

  // Khi chọn địa chỉ → tự động cập nhật tên + sđt
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAddress(value);

    const selected = addresses.find(a => a.fullAddress === value);
    if (selected) {
      setName(selected.ReceiverName);
      setPhone(selected.PhoneNumber);
    }
  };

  const handleBuyNow = async () => {
    if (!name.trim()) return alert('Vui lòng nhập họ tên!');
    if (!/^\d{9,11}$/.test(phone.replace(/\D/g, ''))) return alert('Số điện thoại không hợp lệ!');
    if (!selectedAddress) return alert('Vui lòng chọn địa chỉ giao hàng!');

    const addr = addresses.find(a => a.fullAddress === selectedAddress);
    if (!addr) return alert('Địa chỉ không hợp lệ!');

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders/buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
          addressId: addr.AddressId,
          recipientName: name.trim(),
          recipientPhone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đặt hàng thất bại');

      router.push(`/hoan-tat?orderId=${data.data?.orderId || data.orderId}`);
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (stock <= 0) {
    return <button className={styles.outOfStockButton} disabled>HẾT HÀNG</button>;
  }

  return (
    <>
      <button className={styles.buyNowButton} onClick={() => setShowModal(true)}>
        MUA NGAY
      </button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.title}>Thông tin giao hàng</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>

            {/* Tên người nhận */}
            <input
              type="text"
              placeholder="Tên người nhận"
              value={name}
              onChange={e => setName(e.target.value)}
              className={styles.inputField}
            />

            {/* Số điện thoại */}
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className={styles.inputField}
            />

            {/* Chọn địa chỉ */}
            <div className={styles.formGroup} style={{ marginTop: '16px' }}>
              <select
                value={selectedAddress}
                onChange={handleAddressChange}
                className={styles.addressSelect || styles.inputField}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">-- Chọn địa chỉ giao hàng --</option>
                {addresses.map(addr => (
                  <option key={addr.AddressId} value={addr.fullAddress}>
                    {addr.displayText} {addr.IsDefault ? '(Mặc định)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Số lượng */}
            <div className={styles.quantitySection}>
              <div className={styles.quantityWrapper}>
                <span className={styles.quantityLabel}>Số lượng:</span>
                <div className={styles.quantityControls}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className={styles.quantityBtn}>−</button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} className={styles.quantityBtn}>+</button>
                </div>
              </div>
              {quantity >= stock && stock > 0 && (
                <p className={styles.stockWarning}>Chỉ còn {stock} sản phẩm trong kho!</p>
              )}
            </div>

            <button
              className={styles.confirmBtn}
              disabled={loading || !selectedAddress}
              onClick={handleBuyNow}
            >
              {loading ? 'Đang xử lý...' : `XÁC NHẬN MUA NGAY (${quantity} sản phẩm)`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}