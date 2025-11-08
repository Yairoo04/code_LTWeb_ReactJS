"use client";
import "../admin.scss";
import { useMemo, useState } from "react";
import styles from "./customers.module.scss";

const SAMPLE_CUSTOMERS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0901234567",
    status: "active",
    createdAt: "2025-01-12T10:25:00Z",
    totalOrders: 5,
    totalSpent: 5250000,
    address: "12 Trần Hưng Đạo, Q.1, TP.HCM",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@gmail.com",
    phone: "0907654321",
    status: "active",
    createdAt: "2025-02-08T08:15:00Z",
    totalOrders: 2,
    totalSpent: 980000,
    address: "45 Nguyễn Trãi, Q.5, TP.HCM",
  },
  {
    id: 3,
    name: "Lê Minh C",
    email: "minhc@example.com",
    phone: "0912345678",
    status: "blocked",
    createdAt: "2024-12-20T14:10:00Z",
    totalOrders: 7,
    totalSpent: 11200000,
    address: "89 Láng Hạ, Đống Đa, Hà Nội",
  },
  {
    id: 4,
    name: "Phạm Duy D",
    email: "duyd@example.com",
    phone: "0987654321",
    status: "active",
    createdAt: "2025-03-15T09:00:00Z",
    totalOrders: 1,
    totalSpent: 350000,
    address: "22 Điện Biên Phủ, Bình Thạnh, TP.HCM",
  },
  {
    id: 5,
    name: "Đỗ Thị E",
    email: "e.do@example.com",
    phone: "0933332222",
    status: "active",
    createdAt: "2025-04-01T12:30:00Z",
    totalOrders: 10,
    totalSpent: 21450000,
    address: "5 Hai Bà Trưng, Hoàn Kiếm, Hà Nội",
  },
];

function currency(v) {
  try {
    return v?.toLocaleString("vi-VN") + "đ";
  } catch {
    return v + "đ";
  }
}

export default function CustomersPage() {
  const [customers] = useState(SAMPLE_CUSTOMERS);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = customers.filter((c) => {
      const s = (c.name + c.email + c.phone).toLowerCase();
      return s.includes(q.toLowerCase());
    });
    if (status !== "all") list = list.filter((c) => c.status === status);
    switch (sort) {
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "ordersDesc":
        list = [...list].sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case "spentDesc":
        list = [...list].sort((a, b) => b.totalSpent - a.totalSpent);
        break;
    }
    return list;
  }, [customers, q, status, sort]);

  function resetFilters() {
    setQ("");
    setStatus("all");
    setSort("newest");
  }

  return (
    <div className="admin-page">
      <h2>Khách hàng</h2>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Tìm theo tên, email, SĐT..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="blocked">Đã chặn</option>
        </select>
        <select
          className={styles.select}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="ordersDesc">Đơn hàng nhiều nhất</option>
          <option value="spentDesc">Chi tiêu cao nhất</option>
        </select>
        <button className={styles.btnReset} onClick={resetFilters}>Hiện tất cả</button>
      </div>

      <div className={styles.summary}>
        Tổng khách hàng: <b>{customers.length}</b> — Đang hiển thị: <b>{filtered.length}</b>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Đơn hàng</th>
              <th>Chi tiêu</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)} className={styles.rowClickable}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.totalOrders}</td>
                <td>{currency(c.totalSpent)}</td>
                <td>
                  <span className={c.status === "active" ? styles.badgeActive : styles.badgeBlocked}>
                    {c.status === "active" ? "Hoạt động" : "Đã chặn"}
                  </span>
                </td>
                <td>{new Date(c.createdAt).toLocaleDateString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Thông tin khách hàng</h3>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.field}><span>Mã KH:</span><b>{selected.id}</b></div>
              <div className={styles.field}><span>Họ tên:</span><b>{selected.name}</b></div>
              <div className={styles.field}><span>Email:</span><b>{selected.email}</b></div>
              <div className={styles.field}><span>SĐT:</span><b>{selected.phone}</b></div>
              <div className={styles.field}><span>Địa chỉ:</span><b>{selected.address}</b></div>
              <div className={styles.field}><span>Trạng thái:</span>
                <b>{selected.status === "active" ? "Hoạt động" : "Đã chặn"}</b>
              </div>
              <div className={styles.field}><span>Số đơn hàng:</span><b>{selected.totalOrders}</b></div>
              <div className={styles.field}><span>Tổng chi tiêu:</span><b>{currency(selected.totalSpent)}</b></div>
              <div className={styles.field}><span>Ngày tạo:</span><b>{new Date(selected.createdAt).toLocaleString("vi-VN")}</b></div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closePrimary} onClick={() => setSelected(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
