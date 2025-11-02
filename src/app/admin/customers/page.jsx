"use client";
import "../admin.scss";

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", phone: "0901234567" },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", phone: "0907654321" },
  ];

  return (
    <div className="admin-page">
      <h2>Danh sách khách hàng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>SĐT</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
