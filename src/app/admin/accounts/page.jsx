"use client";
import { useState } from "react";
import "../admin.scss";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([
    { id: 1, username: "admin", role: "Quản trị viên" },
  ]);

  const addAccount = () => {
    const name = prompt("Tên tài khoản:");
    if (name) {
      setAccounts([...accounts, { id: Date.now(), username: name, role: "Nhân viên" }]);
    }
  };

  return (
    <div className="admin-page">
      <h2>Quản lý tài khoản</h2>
      <button onClick={addAccount}>Thêm tài khoản</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.username}</td>
              <td>{a.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
