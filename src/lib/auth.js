export const saveAuth = (user, token) => {
  if (typeof window === "undefined") return;
  if (!user) return;

  // Lưu user object
  localStorage.setItem("user", JSON.stringify(user));

  // LƯU userId CHUẨN HÓA (hỗ trợ nhiều key)
  const userId = user.userId || user.UserId || user.id;
  if (userId != null) {
    localStorage.setItem("userId", String(userId));
  }

  // Lưu token
  if (token) {
    localStorage.setItem("token", token);
  }
};

/**
 * Lấy thông tin auth từ localStorage
 * @returns {{ user: Object, token: string|null, userId: number|null }}
 */
export const getAuth = () => {
  if (typeof window === "undefined") {
    return { user: {}, token: null, userId: null };
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const userIdStr = localStorage.getItem("userId");
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;

  return { user, token, userId };
};