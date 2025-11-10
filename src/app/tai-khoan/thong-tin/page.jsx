'use client';

import { useEffect, useState } from 'react';
import styles from './ThongTinPage.module.scss';
import { getAuth } from '../../../lib/auth';

export default function ThongTinPage() {
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        phone: '',
        gender: 'Khác',
        customerType: '',
    });
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // ============================
    // Lấy thông tin người dùng
    // ============================
    useEffect(() => {
        const { user: savedUser, token } = getAuth();
        if (!savedUser || !token) return;

        const fetchUserInfo = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customer?email=${savedUser.email}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await res.json();
                console.log('API response:', data);

                // Kiểm tra đúng cấu trúc trả về
                if (data?.success && data.data) {
                    const c = data.data;
                    setUser({
                        fullName: c.FullName || '',
                        email: c.Email || '',
                        phone: c.Phone || '',
                        gender: c.Gender || 'Khác',
                        customerType: c.CustomerType || '',
                    });
                } else {
                    console.warn('Không tìm thấy dữ liệu hợp lệ:', data);
                }
            } catch (err) {
                console.error('Lỗi tải thông tin người dùng:', err);
            }
        };

        fetchUserInfo();
    }, []);

    // ============================
    // Cập nhật thông tin người dùng
    // ============================
    const handleSave = async (e) => {
        e.preventDefault();
        const { user: savedUser, token } = getAuth();
        if (!savedUser || !token) {
            alert('Chưa đăng nhập!');
            return;
        }

        setLoading(true);
        try {
            // Cập nhật thông tin cơ bản
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/customer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    gender: user.gender,
                }),
            });

            const data = await res.json();
            console.log('PUT response:', data);

            if (data?.success) {
                // Nếu người dùng nhập mật khẩu mới → xử lý đổi mật khẩu
                if (newPassword.trim()) {
                    const oldPassword = prompt('Nhập mật khẩu hiện tại:');
                    if (!oldPassword) {
                        alert('Bạn chưa nhập mật khẩu cũ.');
                        return;
                    }

                    const passRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ oldPassword, newPassword }),
                    });

                    const passData = await passRes.json();
                    if (!passData.success) throw new Error(passData.message || 'Đổi mật khẩu thất bại.');
                }

                alert('Cập nhật thông tin thành công!');
                setNewPassword('');
            } else {
                throw new Error(data?.message || 'Không thể cập nhật thông tin.');
            }
        } catch (err) {
            console.error('PUT error:', err);
            alert('Lỗi: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Giao diện
    // ============================
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Thông tin tài khoản</h2>

            <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.row}>
                    <label>Họ và tên</label>
                    <input
                        type="text"
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    />
                </div>

                <div className={styles.row}>
                    <label>Giới tính</label>
                    <div className={styles.radioWrapper}>
                        {['Nam', 'Nữ', 'Khác'].map((g) => (
                            <label key={g} className={styles.radioItem}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value={g}
                                    checked={user.gender === g}
                                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                                />
                                {g}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.row}>
                    <label>Số điện thoại</label>
                    <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                </div>

                <div className={styles.row}>
                    <label>Email</label>
                    <input type="email" value={user.email} disabled />
                </div>

                <div className={styles.row}>
                    <label>Loại khách hàng</label>
                    <input type="text" value={user.customerType} disabled />
                </div>

                <div className={styles.row}>
                    <label>Đổi mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới (nếu muốn đổi)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
                    </button>
                </div>
            </form>
        </div>
    );
}
