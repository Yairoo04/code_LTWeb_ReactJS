"use client";
import { useMemo, useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import AdminPageTitle from "@/components/AdminPageTitle";
import "../admin.scss";
import styles from "./orders.module.scss";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const STATUS = [
  "Pending",
  "Processing",
  "Shipping",
  "Delivered",
  "Completed",
  "Cancelled"
];

const STATUS_VI = {
  "Pending": "Chờ xác nhận",
  "Processing": "Đang chuẩn bị",
  "Shipping": "Đang giao",
  "Delivered": "Đã giao",
  "Completed": "Hoàn thành",
  "Cancelled": "Huỷ"
};

function currency(v) {
  try {
    return v?.toLocaleString("vi-VN") + "đ";
  } catch {
    return v + "đ";
  }
}

// Không dùng SAMPLE_ORDERS nữa - lấy từ API
const _SAMPLE_ORDERS_OLD = [
  {
    id: 20251001,
    createdAt: "2025-10-10T10:40:34.461Z",
    status: "Đang chuẩn bị",
    receiver: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "12 Trần Hưng Đạo, Q.1, TP.HCM",
    },
    customer: { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com" },
    items: [
      { sku: "DLXPS13", name: "Laptop Dell XPS 13", qty: 1, price: 25000000 },
      { sku: "K2", name: "Keychron K2", qty: 1, price: 1890000 },
    ],
  },
  {
    id: 20251002,
    createdAt: "2025-10-11T09:15:00.000Z",
    status: "Đang giao",
    receiver: {
      name: "Trần Thị B",
      phone: "0907654321",
      address: "45 Nguyễn Trãi, Q.5, TP.HCM",
    },
    customer: { id: 2, name: "Trần Thị B", email: "b@gmail.com" },
    items: [
      { sku: "G502", name: "Logitech G502 HERO", qty: 2, price: 1490000 },
      { sku: "VSV2432", name: "Viewsonic VA2432A-H", qty: 1, price: 1800000 },
    ],
  },
  {
    id: 20251003,
    createdAt: "2025-10-12T15:00:00.000Z",
    status: "Hoàn thành",
    receiver: {
      name: "Lê Minh C",
      phone: "0912345678",
      address: "89 Láng Hạ, Đống Đa, Hà Nội",
    },
    customer: { id: 3, name: "Lê Minh C", email: "minhc@example.com" },
    items: [
      { sku: "HPPA15", name: "Laptop HP Pavilion 15", qty: 1, price: 15000000 },
    ],
  },
  {
    id: 20251004,
    createdAt: "2025-10-12T17:20:00.000Z",
    status: "Huỷ",
    receiver: {
      name: "Phạm Duy D",
      phone: "0987654321",
      address: "22 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    },
    customer: { id: 4, name: "Phạm Duy D", email: "duyd@example.com" },
    items: [
      { sku: "K2", name: "Keychron K2", qty: 1, price: 1299000 },
      { sku: "G502", name: "Logitech G502 HERO", qty: 1, price: 1490000 },
    ],
  },
  {
    id: 20251005,
    createdAt: "2025-10-13T08:00:00.000Z",
    status: "Đã giao",
    receiver: {
      name: "Đỗ Thị E",
      phone: "0933332222",
      address: "5 Hai Bà Trưng, Hoàn Kiếm, Hà Nội",
    },
    customer: { id: 5, name: "Đỗ Thị E", email: "e.do@example.com" },
    items: [
      { sku: "VSV2432", name: "Viewsonic VA2432A-H", qty: 2, price: 1800000 },
      { sku: "K2", name: "Keychron K2", qty: 1, price: 1890000 },
    ],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch orders từ API khi component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/orders`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setQ("");
    setStatus("all");
    setSort("newest");
    setFromDate("");
    setToDate("");
  }

  const filtered = useMemo(() => {
    let list = orders.filter((o) => {
      const hay = (
        o.OrderId +
        (o.CustomerName || "") +
        (o.CustomerEmail || "") +
        (o.RecipientPhone || "")
      )
        .toString()
        .toLowerCase();
      return hay.includes(q.toLowerCase());
    });
    if (status !== "all") list = list.filter((o) => o.Status === status);
    // Lọc theo ngày tạo (từ/đến)
    const start = fromDate ? new Date(fromDate + "T00:00:00") : null;
    const end = toDate ? new Date(toDate + "T23:59:59.999") : null;
    if (start) list = list.filter((o) => new Date(o.CreatedAt) >= start);
    if (end) list = list.filter((o) => new Date(o.CreatedAt) <= end);
    switch (sort) {
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)
        );
        break;
      case "totalDesc":
        list = [...list].sort((a, b) => b.TotalAmount - a.TotalAmount);
        break;
    }
    return list;
  }, [orders, q, status, sort, fromDate, toDate]);

  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.OrderId === id ? { ...o, Status: newStatus } : o)));
        if (selected?.OrderId === id) setSelected((s) => ({ ...s, Status: newStatus }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  }

  async function viewOrderDetails(orderId) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders?orderId=${orderId}`);
      const data = await res.json();
      if (data.success) {
        setSelected(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  }

  const badgeClass = (s) => {
    switch (s) {
      case "Cancelled":
      case "Huỷ":
        return styles.badgeCancel;
      case "Pending":
      case "Chờ xác nhận":
        return styles.badgePending;
      case "Processing":
      case "Đang chuẩn bị":
        return styles.badgePrepare;
      case "Shipping":
      case "Đang giao":
        return styles.badgeShipping;
      case "Delivered":
      case "Đã giao":
        return styles.badgeDelivered;
      case "Completed":
      case "Hoàn thành":
        return styles.badgeDone;
      default:
        return styles.badgeDefault;
    }
  };

  function formatUTCDate(dateStr) {
    const d = new Date(dateStr);
    return d.getUTCDate().toString().padStart(2, '0') + '/' +
      (d.getUTCMonth() + 1).toString().padStart(2, '0') + '/' +
      d.getUTCFullYear() + ' ' +
      d.getUTCHours().toString().padStart(2, '0') + ':' +
      d.getUTCMinutes().toString().padStart(2, '0') + ':' +
      d.getUTCSeconds().toString().padStart(2, '0');
  }

  return (
    <div className="admin-page">
      <AdminPageTitle>Đơn hàng</AdminPageTitle>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Tìm theo mã, tên khách, email, SĐT..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>{STATUS_VI[s]}</option>
          ))}
        </select>
        <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="totalDesc">Tổng tiền cao nhất</option>
        </select>
        <input
          className={styles.date}
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          className={styles.date}
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button className={styles.btnReset} onClick={resetFilters}>Hiện tất cả</button>
      </div>

      {loading ? (
        <LoadingSpinner message="Đang tải đơn hàng..." minHeight={200} />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Người nhận</th>
                <th>Liên hệ</th>
                <th>Tổng tiền</th>
                <th>Phương thức TT</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.OrderId}>
                  <td>DH{o.OrderId.toString().padStart(3, '0')}</td>
                  <td>
                    <div className={styles.name}>{o.RecipientName || "Không có tên"}</div>
                  </td>
                  <td>
                    <div>{o.RecipientPhone || "Chưa có"}</div>
                  </td>
                  <td>{currency(o.TotalAmount)}</td>
                  <td>
                    <span className={styles.paymentBadge}>{o.PaymentMethod || "Chưa rõ"}</span>
                  </td>
                  <td>
                    <span className={badgeClass(o.Status)}>{STATUS_VI[o.Status] || o.Status}</span>
                  </td>
                  <td>{formatUTCDate(o.CreatedAt)}</td>
                  <td className={styles.actionsCell}>
                    <button className={styles.iconBtn} data-tooltip="Xem chi tiết đơn hàng" onClick={() => viewOrderDetails(o.OrderId)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <select
                      className={styles.selectInline}
                      value={o.Status}
                      onChange={(e) => updateStatus(o.OrderId, e.target.value)}
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>{STATUS_VI[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Chi tiết đơn hàng DH{selected.OrderId.toString().padStart(3, '0')}</h3>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <section className={styles.section}>
                <h4>Trạng thái</h4>
                <div className={styles.statusRow}>
                  <span className={badgeClass(selected.Status)}>{STATUS_VI[selected.Status] || selected.Status}</span>
                  <select
                    className={styles.selectInline}
                    value={selected.Status}
                    onChange={(e) => updateStatus(selected.OrderId, e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>{STATUS_VI[s]}</option>
                    ))}
                  </select>
                </div>
              </section>

              <section className={styles.sectionGrid}>
                <div>
                  <h4>Thông tin khách hàng</h4>
                  <div className={styles.field}><span>Mã KH:</span><b>{selected.CustomerId ? `KH${selected.CustomerId.toString().padStart(3, '0')}` : "N/A"}</b></div>
                  <div className={styles.field}><span>Họ tên:</span><b>{selected.RecipientName}</b></div>
                  <div className={styles.field}><span>SĐT:</span><b>{selected.RecipientPhone || "Chưa có"}</b></div>
                  <div className={styles.field}><span>Email:</span><b>{selected.CustomerEmail || "N/A"}</b></div>
                </div>
                <div>
                  <h4>Thanh toán</h4>
                  <div className={styles.field}>
                    <span>Phương thức:</span>
                    <b>{selected.PaymentMethod || 'Chưa xác định'}</b>
                  </div>
                  <div className={styles.field}><span>Tổng tiền:</span><b className={styles.totalPrice}>{currency(selected.TotalAmount)}</b></div>
                </div>
              </section>

              <section className={styles.section}>
                <h4>Sản phẩm</h4>
                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Sản phẩm</th>
                      <th>SL</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.Items?.map((it) => (
                      <tr key={it.OrderItemId}>
                        <td>{it.SKU || "N/A"}</td>
                        <td>{it.ProductName}</td>
                        <td>{it.Quantity}</td>
                        <td>{currency(it.UnitPrice)}</td>
                        <td>{currency(it.Quantity * it.UnitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className={styles.tdRight}>Tổng cộng</td>
                      <td><b>{currency(selected.TotalAmount)}</b></td>
                    </tr>
                  </tfoot>
                </table>
              </section>

              <div className={styles.miniInfo}>Tạo lúc: {formatUTCDate(selected.CreatedAt)}</div>
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
