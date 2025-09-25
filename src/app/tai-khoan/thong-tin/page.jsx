'use client';
import { useEffect, useState } from 'react';
import styles from './ThongTinPage.module.scss';

export default function ThongTinPage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        gender: 'Nam',
        birthday: { day: '', month: '', year: '' },
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Thông tin tài khoản</h2>

            <form className={styles.form}>
                {/* Họ tên */}
                <div className={styles.row}>
                    <label>Họ Tên</label>
                    <input type="text" defaultValue={user.name} />
                </div>

                {/* Giới tính */}
                <div className={styles.row}>
                    <label>Giới tính</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input type="radio" name="gender" value="Nam" defaultChecked={user.gender === 'Nam'} /> Nam
                        </label>
                        <label>
                            <input type="radio" name="gender" value="Nữ" defaultChecked={user.gender === 'Nữ'} /> Nữ
                        </label>
                    </div>
                </div>

                {/* Số điện thoại */}
                <div className={styles.row}>
                    <label>Số điện thoại</label>
                    <input type="tel" placeholder="Nhập số điện thoại" defaultValue={user.phone} />
                </div>

                {/* Email */}
                <div className={styles.row}>
                    <label>Email</label>
                    <input type="email" defaultValue={user.email} disabled />
                </div>

                {/* Ngày sinh */}
                <div className={styles.row}>
                    <label>Ngày sinh</label>
                    <div className={styles.birthday}>
                        <select defaultValue={user.birthday?.day || ''}>
                            <option value="">Ngày</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <select defaultValue={user.birthday?.month || ''}>
                            <option value="">Tháng</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <select defaultValue={user.birthday?.year || ''}>
                            <option value="">Năm</option>
                            {Array.from({ length: 60 }, (_, i) => 2024 - i).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn}>
                        LƯU THAY ĐỔI
                    </button>
                </div>
            </form>
        </div>
    );
}
