"use client";
import Cookies from "js-cookie";

// 🧭 Kiểm tra trạng thái đăng nhập
export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return Cookies.get("isLoggedIn") === "true"; //  đọc từ cookie
};

// 🚪 Hàm đăng xuất
export const logout = (router) => {
  Cookies.remove("isLoggedIn");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  router.push("/admin/login");
};
