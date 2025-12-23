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
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = isLoggedIn();
    setLoggedIn(check);
    setUser(getCurrentUser());

    // Nếu chưa login mà không ở trang login, forgot-password, reset-password → chuyển hướng
    if (
      !check &&
      !["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(path)
    ) {
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

    // Lấy thông báo đánh giá + đơn hàng mới ở trạng thái 'Pending' hoặc 'Chờ xác nhận'
    async function fetchNotifications() {
      try {
        // Chỉ lấy thông báo từ bảng Notifications
        const notifRes = await fetch("/api/admin/notifications");
        const notifData = await notifRes.json();
        const notifications = (notifData.data || []).sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setNotificationCount(notifications.length);
        setNotifications(notifications);
      } catch {}
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15s refresh
    return () => clearInterval(interval);
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


  // Nếu đang ở /admin/login, /admin/forgot-password, /admin/reset-password → KHÔNG render sidebar, KHÔNG render loading
  if (["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(path)) {
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
            {/* Flash Sale menu item */}
            {hasRole(user, ["ADMIN", "MANAGER"]) && (
              <li className={path === "/admin/flash-sale" ? "active" : ""}>
                <Link href="/admin/flash-sale"> Flash Sale</Link>
              </li>
            )}
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
            <li className={path === "/admin/reviews" ? "active" : ""}>
              <Link href="/admin/reviews"> Đánh giá</Link>
            </li>
          </ul>
        </nav>
        <button className="logout-btn sidebar-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <span>Xin chào, {user?.fullName || user?.fullname || user?.username || "Admin"} {user?.role ? `(${user.role})` : ""}</span>
          <div className="header-actions">
            <div style={{ position: "relative" }}>
              <button className="icon-btn" title="Thông báo" onClick={() => setShowNotif(v => !v)}>
                <BellIcon className="icon" />
                <span className="badge">{notificationCount}</span>
              </button>
              {showNotif && (
                <>
                  {/* Overlay để bấm ra ngoài đóng popup */}
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 99 }}
                    onClick={() => setShowNotif(false)}
                  />
                  <div
                    style={{ position: "absolute", right: 0, top: 40, minWidth: 260, maxHeight: 350, overflowY: "auto", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", borderRadius: 8, zIndex: 100, padding: 12 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <h4 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Thông báo</h4>
                    {notifications.length === 0 ? (
                      <div style={{ color: "#888", fontSize: 14 }}>Không có thông báo mới.</div>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {notifications.map(n => (
                          <li key={n.NotificationId} style={{ padding: "8px 0", borderBottom: "1px solid #eee", fontSize: 14 }}>
                            {n.Type === "review" ? (
                              <a
                                href="/admin/reviews"
                                style={{ color: "#1677ff", textDecoration: "none", cursor: "pointer" }}
                                onClick={async () => {
                                  setShowNotif(false);
                                  await fetch("/api/admin/notifications", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ notificationId: n.NotificationId })
                                  });
                                  setNotifications(notifications => notifications.filter(x => x.NotificationId !== n.NotificationId));
                                  setNotificationCount(c => c > 0 ? c - 1 : 0);
                                }}
                              >
                                <span style={{ fontWeight: 500 }}>Đánh giá mới:</span> {n.Message}
                              </a>
                            ) : (
                              <span>
                                <span style={{ fontWeight: 500 }}>Đơn hàng:</span> {n.Message}
                              </span>
                            )}
                            <br />
                            <span style={{ color: "#aaa", fontSize: 12 }}>{new Date(n.CreatedAt).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
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
