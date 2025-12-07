// app/products/[productId]/BuyNowButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.scss';
import Image from 'next/image';
import MoMoQRPayment from '@/components/MoMoQRPayment/MoMoQRPayment';

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

type PaymentMethod = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

const PAYMENT_METHODS = [
  { id: 1, name: 'Thanh toán khi nhận hàng (COD)', icon: '/images/banks/cod.jpg' },
  { id: 2, name: 'Chuyển khoản (MOMO)', icon: '/images/banks/momo.jpg' },
  { id: 3, name: 'Thanh toán tiền mặt tại cửa hàng', icon: '/images/banks/cash.jpg' },
] as const;
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<1 | 2 | 3>(1);

  // MOMO QR
  const [showMoMoQR, setShowMoMoQR] = useState(false);
  const [payUrl, setPayUrl] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

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

  // MOMO Polling
  useEffect(() => {
    if (!currentOrderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:4000/api/orders/${currentOrderId}`);
        const data = await res.json();

        if (data.data?.StatusId === 2) {
          clearInterval(interval);
          alert('Thanh toán MoMo thành công!');
          router.replace(`/hoan-tat?orderId=${currentOrderId}&paid=1&refresh=true`);
        }
      } catch (e) { }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentOrderId]);

  // Phuong thuc thanh toan
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
          paymentMethodId: selectedPaymentMethod,
        }),
      });

      const data = await res.json();
      const orderId = data.data?.orderId;
      const amount = data.data?.totalAmount;

      if (!orderId || !amount) {
        throw new Error("Không lấy được thông tin đơn hàng");
      }

      // MOMO Payment
      if (selectedPaymentMethod === 2) {
        const momoRes = await fetch('http://localhost:4000/api/payment/momo/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount,
            extraData: `realOrderId=${orderId}`
          })

        });

        const momoData = await momoRes.json();

        if (momoData.success && momoData.payUrl) {
          setCurrentOrderId(orderId);
          setPayUrl(momoData.payUrl);
          setShowMoMoQR(true);
          return;
        } else {
          throw new Error(momoData.error || 'Không tạo được thanh toán MoMo');
        }
      }

      // COD
      router.push(`/hoan-tat?orderId=${orderId}&refresh=true`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showMoMoQR) {
    return (
      <MoMoQRPayment
        payUrl={payUrl}
        currentOrderId={currentOrderId}
        totalAmount={0}
        onBack={() => setShowMoMoQR(false)}
      />
    );
  }

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
            {/* Phương thức thanh toán */}
            <div className={styles.paymentSection}>
              <div className={styles.sectionTitle}>Phương thức thanh toán</div>
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.id}
                  className={`${styles.paymentOption} ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                  data-method={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id as 1 | 2 | 3)}
                >
                  <input type="radio" name="payment" checked={selectedPaymentMethod === method.id} onChange={() => { }} />
                  <Image
                    src={method.icon}
                    alt={method.name}
                    width={30}
                    height={30}
                    className="rounded-md object-contain"
                  />
                  <span className={styles.label}>{method.name}</span>
                  {selectedPaymentMethod === method.id && <span className={styles.check}></span>}
                </label>
              ))}
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