"use client";
import { useState } from "react";
import "../admin.scss";

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: 101,
      customer: "Nguyễn Văn A",
      total: 2500000,
      status: "Đang giao",
      details: [
        { product: "Tai nghe Sony", quantity: 1 },
        { product: "Cáp sạc", quantity: 2 },
      ],
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="admin-page">
      <h2>Quản lý đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.total.toLocaleString()}₫</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                >
                  <option>Huỷ</option>
                  <option>Đang chuẩn bị</option>
                  <option>Đang giao</option>
                  <option>Hoàn thành</option>
                </select>
              </td>
              <td>
                {o.details.map((d, i) => (
                  <p key={i}>
                    {d.product} × {d.quantity}
                  </p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
