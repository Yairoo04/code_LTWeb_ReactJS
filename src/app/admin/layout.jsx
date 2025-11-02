"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout, isLoggedIn } from "@/utils/auth";
import "./admin.scss";

export default function AdminLayout({ children }) {
  const path = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = isLoggedIn();
    setLoggedIn(check);

    // Nếu chưa login mà không ở trang login → chuyển hướng
    if (!check && path !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [path, router]);

  const handleLogout = () => logout(router);

  // Nếu đang ở /admin/login → KHÔNG render sidebar
  if (path === "/admin/login") {
    return <>{children}</>;
  }

  // Nếu chưa login → render loading nhẹ
  if (!loggedIn) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>GTN Admin</h2>
        <nav>
          <ul>
            <li className={path === "/admin/dashboard" ? "active" : ""}>
              <Link href="/admin/dashboard">🏠 Dashboard</Link>
            </li>
            <li className={path === "/admin/products" ? "active" : ""}>
              <Link href="/admin/products">📦 Sản phẩm</Link>
            </li>
            <li className={path === "/admin/categories" ? "active" : ""}>
              <Link href="/admin/categories">📂 Danh mục</Link>
            </li>
            <li className={path === "/admin/orders" ? "active" : ""}>
              <Link href="/admin/orders">🧾 Đơn hàng</Link>
            </li>
            <li className={path === "/admin/customers" ? "active" : ""}>
              <Link href="/admin/customers">👤 Khách hàng</Link>
            </li>
            <li className={path === "/admin/accounts" ? "active" : ""}>
              <Link href="/admin/accounts">🔐 Tài khoản</Link>
            </li>
            <li className={path === "/admin/statistics" ? "active" : ""}>
              <Link href="/admin/statistics">📊 Thống kê</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <span>Xin chào, Admin</span>
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </header>
        <section className="admin-main">{children}</section>
      </main>
    </div>
  );
}
