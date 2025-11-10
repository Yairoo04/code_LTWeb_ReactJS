"use client";
import Cookies from "js-cookie";

//  Kiểm tra trạng thái đăng nhập
export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return Cookies.get("isLoggedIn") === "true"; //  đọc từ cookie
};

//  Lấy thông tin người dùng hiện tại (username, role)
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const hasRole = (user, roles) => {
  if (!user) return false;
  if (!roles || roles.length === 0) return true;
  // So sánh không phân biệt hoa thường
  const userRole = (user.role || '').toUpperCase();
  return roles.some(r => r.toUpperCase() === userRole);
};

// �🚪 Hàm đăng xuất
export const logout = (router) => {
  Cookies.remove("isLoggedIn");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  router.push("/admin/login");
};
