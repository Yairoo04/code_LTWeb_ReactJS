'use client';

import { useEffect, useState } from 'react';
import styles from './AddressPage.module.scss';
import { getAuth } from '../../../lib/auth';

// Gửi sự kiện mở modal đăng nhập trên Header
const openLoginModal = () => {
  window.dispatchEvent(new CustomEvent('open-login-modal'));
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState({
    ReceiverName: '',
    PhoneNumber: '',
    Street: '',
    City: '',
    Province: '',
    IsDefault: false,
  });

  const { user, token } = getAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // === TỰ ĐỘNG ĐIỀN KHI MỞ FORM THÊM MỚI ===
  const openForm = (address = null) => {
    setEditingAddress(address);
    if (address) {
      setForm({ ...address });
    } else {
      setForm({
        ReceiverName: user?.name || '',
        PhoneNumber: user?.phone || '',
        Street: '',
        City: '',
        Province: '',
        IsDefault: addresses.length === 0, // Mặc định nếu chưa có địa chỉ
      });
    }
    setShowForm(true);
  };

  // Hàm fetch có xử lý 401 (hết hạn token)
  const fetchWithAuth = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      // Token hết hạn → xóa và mở modal đăng nhập ngay trên Header
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      openLoginModal(); // ← Đây là điểm quan trọng
      throw new Error('Phiên đăng nhập đã hết hạn');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi kết nối');
    }

    return res;
  };

  // === FETCH ADDRESSES ===
  useEffect(() => {
    if (!token) {
      openLoginModal();
      return;
    }

    let isMounted = true;

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAuth(`${API_URL}/api/address`);
        const data = await res.json();

        if (isMounted) {
          setAddresses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted && !err.message.includes('hết hạn')) {
          alert(err.message || 'Không thể tải danh sách địa chỉ');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAddresses();
    return () => { isMounted = false; };
  }, [token, API_URL]);

  // === SAVE (POST/PUT) ===
  const handleSave = async (e) => {
    e.preventDefault();
    const required = ['ReceiverName', 'PhoneNumber', 'Street', 'City', 'Province'];
    const missing = required.find(f => !form[f]);
    if (missing) {
      alert('Vui lòng điền đầy đủ!');
      return;
    }

    setLoading(true);
    try {
      const url = `${API_URL}/api/address`;
      const method = editingAddress ? 'PUT' : 'POST';

      const body = editingAddress
        ? { ...form, AddressId: editingAddress.AddressId }
        : form;

      await fetchWithAuth(url, {
        method,
        body: JSON.stringify(body),
      });
      const res = await fetchWithAuth(`${API_URL}/api/address`);
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : []);
      setShowForm(false);
      alert('Lưu địa chỉ thành công!');
    } catch (err) {
      if (!err.message.includes('hết hạn')) {
        alert(err.message || 'Lưu địa chỉ thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  // === DELETE ===
 const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;

    try {
      await fetchWithAuth(`${API_URL}/api/address?AddressId=${id}`, {
        method: 'DELETE',
      });
      setAddresses(prev => prev.filter(a => a.AddressId !== id));
      alert('Xóa thành công!');
    } catch (err) {
      if (!err.message.includes('hết hạn')) {
        alert(err.message || 'Xóa thất bại');
      }
    }
  };

  return (
    <div className={styles.addressBox}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Sổ địa chỉ</h2>
        <button
          onClick={() => openForm()}
          className={styles.addBtn}
          disabled={loading || addresses.length >= 5}
        >
          + Thêm địa chỉ
        </button>
      </div>

      {/* List */}
      <div className={styles.addressList}>
        {loading ? (
          <div className={styles.loadingCard}>
            <p className={styles.loadingText}>Đang tải địa chỉ...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className={styles.emptyCard}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <p className={styles.emptyText}>Bạn chưa có địa chỉ nào</p>
            <button onClick={() => openForm()} className={styles.addFirstBtn}>
              + Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          addresses.map(addr => (
            <div key={addr.AddressId} className={styles.addressItem}>
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  {addr.IsDefault && <span className={styles.defaultBadge}>Mặc định</span>}
                  <span className={styles.nameText}>{addr.ReceiverName}</span>
                </div>
                <p className={styles.addressText}>
                  {addr.Street}, {addr.City}, {addr.Province}
                </p>
                <p className={styles.phoneText}>{addr.PhoneNumber}</p>
              </div>
              <div className={styles.actions}>
                <button onClick={() => openForm(addr)} className={styles.editBtn}>Sửa</button>
                <button onClick={() => handleDelete(addr.AddressId)} className={styles.deleteBtn}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
            <form onSubmit={handleSave}>
              <input
                className={styles.formInput}
                placeholder="Họ tên người nhận *"
                value={form.ReceiverName}
                onChange={e => setForm({ ...form, ReceiverName: e.target.value })}
                required
              />
              <input
                className={styles.formInput}
                type="tel"
                placeholder="Số điện thoại *"
                value={form.PhoneNumber}
                onChange={e => setForm({ ...form, PhoneNumber: e.target.value })}
                required
              />
              <input
                className={styles.formInput}
                placeholder="Đường, số nhà *"
                value={form.Street}
                onChange={e => setForm({ ...form, Street: e.target.value })}
                required
              />
              <input
                className={styles.formInput}
                placeholder="Quận/Huyện *"
                value={form.City}
                onChange={e => setForm({ ...form, City: e.target.value })}
                required
              />
              <input
                className={styles.formInput}
                placeholder="Tỉnh/Thành phố *"
                value={form.Province}
                onChange={e => setForm({ ...form, Province: e.target.value })}
                required
              />
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.IsDefault}
                  onChange={e => setForm({ ...form, IsDefault: e.target.checked })}
                />
                Đặt làm mặc định
              </label>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
                  Hủy
                </button>
                <button type="submit" className={styles.saveBtn} disabled={loading}>
                  {loading ? 'Đang lưu...' : editingAddress ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}