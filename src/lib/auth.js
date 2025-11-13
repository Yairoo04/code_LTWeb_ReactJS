export const saveAuth = (user, token) => {
  if (typeof window === "undefined") return;

  if (!user) return;

  localStorage.setItem("user", JSON.stringify(user));

  // Lưu shortcut để FE dùng nhanh
  if (user.userId) localStorage.setItem("userId", String(user.userId));

  if (token) localStorage.setItem("token", token);
};

export const getAuth = () => {
  if (typeof window === "undefined") return { user: {}, token: null };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  return { user, token };
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
