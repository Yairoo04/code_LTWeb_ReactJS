'use client';

import { useEffect, useState } from 'react';
import styles from './AddressPage.module.scss';
import { getAuth } from '../../../lib/auth';

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

  // === FETCH ADDRESSES ===
  useEffect(() => {
    if (!token) {
      alert('Vui lòng đăng nhập!');
      window.location.href = '/dang-nhap';
      return;
    }

    let isMounted = true;

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          alert('Phiên hết hạn. Đăng nhập lại!');
          localStorage.clear();
          window.location.href = '/dang-nhap';
          return;
        }

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Không thể tải địa chỉ');
        }

        const data = await res.json();
        if (isMounted) {
          setAddresses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) console.error(err);
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

      // LOẠI BỎ UserId HOÀN TOÀN
      const { UserId, ...cleanForm } = form;

      const body = editingAddress
        ? { ...cleanForm, AddressId: editingAddress.AddressId }
        : cleanForm;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Lưu thất bại');
      }

      const refresh = await fetch(`${API_URL}/api/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await refresh.json();
      setAddresses(Array.isArray(data) ? data : []);
      setShowForm(false);
      alert('Thành công!');
    } catch (err) {
      alert(err.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  // === DELETE ===
  const handleDelete = async (id) => {
    if (!confirm('Xóa địa chỉ này?')) return;
    try {
      await fetch(`${API_URL}/api/address?AddressId=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter(a => a.AddressId !== id));
    } catch (err) {
      alert('Xóa thất bại');
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