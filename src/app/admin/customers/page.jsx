"use client";
import "../admin.scss";
import { useMemo, useState, useEffect } from "react";
import { getCurrentUser, hasRole } from "@/utils/auth";
import styles from "./customers.module.scss";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

function currency(v) {
  try {
    return v?.toLocaleString("vi-VN") + "đ";
  } catch {
    return v + "đ";
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [filterActive, setFilterActive] = useState("all");

  // Fetch customers từ API khi component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/customers`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let list = customers.filter((c) => {
      const s = ((c.FullName || "") + (c.Email || "") + (c.PhoneNumber || "")).toLowerCase();
      return s.includes(q.toLowerCase());
    });
    if (filterActive !== "all") {
      list = list.filter(c => String(c.IsActive) === filterActive);
    }
    switch (sort) {
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)
        );
        break;
      case "ordersDesc":
        list = [...list].sort((a, b) => b.TotalOrders - a.TotalOrders);
        break;
      case "spentDesc":
        list = [...list].sort((a, b) => b.TotalSpent - a.TotalSpent);
        break;
    }
    return list;
  }, [customers, q, sort, filterActive]);

  function resetFilters() {
    setQ("");
    setSort("newest");
  }

  async function viewCustomerDetails(customerId) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/customers?customerId=${customerId}`);
      const data = await res.json();
      if (data.success) {
        setSelected(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    }
  }

  async function deleteCustomer(customerId) {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này? Thao tác này không thể hoàn tác!")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/customers?customerId=${customerId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => prev.filter((c) => c.UserId !== customerId));
        setSelected(null);
        alert("Xóa khách hàng thành công!");
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert("Xóa khách hàng thất bại!");
    }
  }

  // Lấy user hiện tại
  const user = getCurrentUser();
  const isAdmin = hasRole(user, ["ADMIN"]);


  // Toggle khóa/mở tài khoản
  async function toggleActive(userId) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/customers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: userId, action: "toggleBlock" })
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => prev.map(c => c.UserId === userId ? { ...c, IsActive: data.isActive } : c));
      } else {
        alert(data.message || "Thao tác thất bại");
      }
    } catch (e) {
      alert("Không thể cập nhật trạng thái tài khoản!");
    }
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
              <th>Ngày tạo</th>
              <th>Khóa/Mở tài khoản</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.UserId}
                className={styles.rowClickable}
                onClick={() => viewCustomerDetails(c.UserId)}
              >
                <td>KH{c.UserId.toString().padStart(3, '0')}</td>
                <td>{c.FullName || "Chưa có tên"}</td>
                <td>{c.Email}</td>
                <td>{c.PhoneNumber || "Chưa có"}</td>
                <td>{c.TotalOrders}</td>
                <td>{currency(c.TotalSpent)}</td>
                <td>{c.CreatedAt ? new Date(c.CreatedAt).toLocaleDateString("vi-VN", {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }) : "N/A"}</td>
                <td>
                  <button
                    className={c.IsActive ? styles.statusActive : styles.statusInactive}
                    onClick={e => { e.stopPropagation(); toggleActive(c.UserId); }}
                    title={c.IsActive ? "Nhấn để khóa tài khoản" : "Nhấn để mở khóa tài khoản"}
                  >
                    {c.IsActive ? (
                      <span style={{color: '#16a34a', fontWeight: 600}}>
                        Đang hoạt động
                      </span>
                    ) : (
                      <span style={{color: '#dc2626', fontWeight: 600}}>
                        Đang khóa
                      </span>
                    )}
                  </button>
                </td>
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
              <div className={styles.field}><span>Mã KH:</span><b>KH{selected.UserId.toString().padStart(3, '0')}</b></div>
              <div className={styles.field}><span>Họ tên:</span><b>{selected.FullName}</b></div>
              <div className={styles.field}><span>Email:</span><b>{selected.Email}</b></div>
              <div className={styles.field}><span>SĐT:</span><b>{selected.PhoneNumber || "Chưa có"}</b></div>
              <div className={styles.field}><span>Số đơn hàng:</span><b>{selected.TotalOrders}</b></div>
              <div className={styles.field}><span>Tổng chi tiêu:</span><b>{currency(selected.TotalSpent)}</b></div>
              <div className={styles.field}><span>Ngày tạo:</span><b>{new Date(selected.CreatedAt).toLocaleString("vi-VN")}</b></div>
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
