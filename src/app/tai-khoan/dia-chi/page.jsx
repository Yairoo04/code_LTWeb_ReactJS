'use client';
import styles from './AddressPage.module.scss';

export default function AddressPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Sổ địa chỉ</h2>
                <button className={styles.addBtn}>+ Thêm địa chỉ</button>
            </div>

            {/* danh sách địa chỉ */}
            <div className={styles.addressList}>
                <p>Chưa có địa chỉ nào.</p>
            </div>
        </div>
    );
}
