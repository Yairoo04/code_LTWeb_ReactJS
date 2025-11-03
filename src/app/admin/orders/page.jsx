"use client";
import { useMemo, useState } from "react";
import "../admin.scss";
import styles from "./orders.module.scss";

const STATUS = [
  "Huỷ",
  "Đang chuẩn bị",
  "Đang giao",
  "Đã giao",
  "Hoàn thành",
];

function currency(v) {
  try {
    return v?.toLocaleString("vi-VN") + "đ";
  } catch {
    return v + "đ";
  }
}

const SAMPLE_ORDERS = [
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

function calcTotal(order) {
  return order.items.reduce((s, it) => s + it.qty * it.price, 0);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(
    SAMPLE_ORDERS.map((o) => ({ ...o, total: calcTotal(o) }))
  );
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
        o.id +
        o.customer.name +
        (o.customer.email || "") +
        o.receiver.phone
      )
        .toString()
        .toLowerCase();
      return hay.includes(q.toLowerCase());
    });
    if (status !== "all") list = list.filter((o) => o.status === status);
    // Lọc theo ngày tạo (từ/đến)
    const start = fromDate ? new Date(fromDate + "T00:00:00") : null;
    const end = toDate ? new Date(toDate + "T23:59:59.999") : null;
    if (start) list = list.filter((o) => new Date(o.createdAt) >= start);
    if (end) list = list.filter((o) => new Date(o.createdAt) <= end);
    switch (sort) {
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "totalDesc":
        list = [...list].sort((a, b) => b.total - a.total);
        break;
    }
    return list;
  }, [orders, q, status, sort, fromDate, toDate]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    if (selected?.id === id) setSelected((s) => ({ ...s, status: newStatus }));
  };

  const badgeClass = (s) => {
    switch (s) {
      case "Huỷ":
        return styles.badgeCancel;
      case "Đang chuẩn bị":
        return styles.badgePrepare;
      case "Đang giao":
        return styles.badgeShipping;
      case "Đã giao":
        return styles.badgeDelivered;
      case "Hoàn thành":
        return styles.badgeDone;
      default:
        return styles.badgeDefault;
    }
  };

  return (
    <div className="admin-page">
      <h2>Đơn hàng</h2>

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
            <option key={s} value={s}>{s}</option>
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

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>
                  <div className={styles.name}>{o.customer.name}</div>
                  <div className={styles.note}>Đã đăng ký</div>
                </td>
                <td>
                  <div>{o.customer.email || ""}</div>
                  <div className={styles.muted}>{o.receiver.phone}</div>
                </td>
                <td>{currency(o.total)}</td>
                <td>
                  <span className={badgeClass(o.status)}>{o.status}</span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.btnGhost} onClick={() => setSelected(o)}>Xem</button>
                  <select
                    className={styles.selectInline}
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
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
              <h3>Chi tiết đơn hàng #{selected.id}</h3>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <section className={styles.section}>
                <h4>Trạng thái</h4>
                <div className={styles.statusRow}>
                  <span className={badgeClass(selected.status)}>{selected.status}</span>
                  <select
                    className={styles.selectInline}
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </section>

              <section className={styles.sectionGrid}>
                <div>
                  <h4>Người nhận</h4>
                  <div className={styles.field}><span>Họ tên:</span><b>{selected.receiver.name}</b></div>
                  <div className={styles.field}><span>SĐT:</span><b>{selected.receiver.phone}</b></div>
                  <div className={styles.field}><span>Địa chỉ:</span><b>{selected.receiver.address}</b></div>
                </div>
                <div>
                  <h4>Khách hàng</h4>
                  <div className={styles.field}><span>Mã KH:</span><b>{selected.customer.id}</b></div>
                  <div className={styles.field}><span>Họ tên:</span><b>{selected.customer.name}</b></div>
                  <div className={styles.field}><span>Email:</span><b>{selected.customer.email}</b></div>
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
                    {selected.items.map((it) => (
                      <tr key={it.sku}>
                        <td>{it.sku}</td>
                        <td>{it.name}</td>
                        <td>{it.qty}</td>
                        <td>{currency(it.price)}</td>
                        <td>{currency(it.qty * it.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className={styles.tdRight}>Tổng cộng</td>
                      <td><b>{currency(selected.total)}</b></td>
                    </tr>
                  </tfoot>
                </table>
              </section>

              <div className={styles.miniInfo}>Tạo lúc: {new Date(selected.createdAt).toLocaleString("vi-VN")}</div>
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
