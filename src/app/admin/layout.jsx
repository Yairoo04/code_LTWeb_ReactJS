"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout, isLoggedIn, getCurrentUser, hasRole } from "@/utils/auth";
import "./admin.scss";
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const path = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = isLoggedIn();
    setLoggedIn(check);
    setUser(getCurrentUser());

    // Nếu chưa login mà không ở trang login → chuyển hướng
    if (!check && path !== "/admin/login") {
      router.push("/admin/login");
      return;
    }

    // Chặn truy cập các route không đủ quyền
    const u = getCurrentUser();
    if (u) {
      // STAFF: không được xem Dashboard
      if (path === "/admin/dashboard" && !hasRole(u, ["ADMIN", "MANAGER"])) {
        router.replace("/admin/orders");
      }
      if (path === "/admin/accounts" && !hasRole(u, ["ADMIN"])) {
        router.replace("/admin/dashboard");
      }
      if (path === "/admin/statistics" && !hasRole(u, ["ADMIN", "MANAGER"])) {
        router.replace("/admin/dashboard");
      }
    }
  }, [path, router]);

  const handleLogout = () => logout(router);

  // Darkmode: persist and toggle root class
  useEffect(() => {
    const saved = localStorage.getItem("adminTheme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("adminTheme", next ? "dark" : "light");
  };

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
            {hasRole(user, ["ADMIN", "MANAGER"]) && (
              <li className={path === "/admin/dashboard" ? "active" : ""}>
                <Link href="/admin/dashboard"> Trang chủ</Link>
              </li>
            )}
            <li className={path === "/admin/products" ? "active" : ""}>
              <Link href="/admin/products"> Sản phẩm</Link>
            </li>
            <li className={path === "/admin/orders" ? "active" : ""}>
              <Link href="/admin/orders"> Đơn hàng</Link>
            </li>
            <li className={path === "/admin/customers" ? "active" : ""}>
              <Link href="/admin/customers"> Khách hàng</Link>
            </li>
            {hasRole(user, ["ADMIN"]) && (
              <li className={path === "/admin/accounts" ? "active" : ""}>
                <Link href="/admin/accounts"> Tài khoản</Link>
              </li>
            )}
            {hasRole(user, ["ADMIN", "MANAGER"]) && (
              <li className={path === "/admin/statistics" ? "active" : ""}>
                <Link href="/admin/statistics"> Thống kê</Link>
              </li>
            )}
          </ul>
        </nav>
        <button className="logout-btn sidebar-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <span>Xin chào, {user?.username || "Admin"} {user?.role ? `(${user.role})` : ""}</span>
          <div className="header-actions">
            <button className="icon-btn" title="Thông báo">
              <BellIcon className="icon" />
              <span className="badge">3</span>
            </button>
            <button className="icon-btn" title="Tin nhắn">
              <ChatBubbleLeftRightIcon className="icon" />
              <span className="badge">5</span>
            </button>
            <button className="icon-btn" onClick={toggleDark} title="Chế độ tối / sáng">
              {dark ? <SunIcon className="icon" /> : <MoonIcon className="icon" />}
            </button>
          </div>
        </header>
        <section className="admin-main">{children}</section>
      </main>
    </div>
  );
}
