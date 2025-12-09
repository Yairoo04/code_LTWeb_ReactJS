"use client";
import { useMemo, useState, useEffect } from "react";
import "../admin.scss";
import styles from "./accounts.module.scss";

import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import AdminPageTitle from "@/components/AdminPageTitle";

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b'
  };
  toast.style.cssText = `position:fixed;top:20px;right:20px;background:${colors[type]};color:white;padding:12px 20px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;font-size:14px;animation:slideIn 0.3s ease;`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}



const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Nhân viên" },
  { value: "SHIPPER", label: "Shipper" },
];

function RoleBadge({ role }) {
  const map = {
    ADMIN: styles.badgeAdmin,
    STAFF: styles.badgeStaff,
    SHIPPER: styles.badgeShipper || styles.badgeStaff,
  };
  const label = ROLES.find((r) => r.value === role)?.label || role;
  return <span className={map[role] || styles.badgeStaff}>{label}</span>;
}
export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showPwdFor, setShowPwdFor] = useState(null);

  // Fetch accounts từ API
  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/admin/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      showToast(" Không thể tải danh sách tài khoản", "error");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let list = accounts.filter((a) =>
      (a.username + a.fullName + a.email).toLowerCase().includes(q.toLowerCase())
    );
    if (role !== "all") list = list.filter((a) => a.role === role);
    return list;
  }, [accounts, q, role]);

  function resetFilters() {
    setQ("");
    setRole("all");
  }

  async function saveAccount(data) {
    if (data.id) {
      // Cập nhật tài khoản
      const res = await fetch("http://localhost:4000/api/admin/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Cập nhật thất bại");
      }

      const updated = await res.json();
      setAccounts((prev) => prev.map((a) => (a.id === data.id ? updated : a)));
      // Nếu user đang sửa chính mình, cập nhật sessionStorage/localStorage để header đổi tên ngay
      const currentUserRaw = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (currentUserRaw) {
        const currentUser = JSON.parse(currentUserRaw);
        if (currentUser.id === updated.id || currentUser.userId === updated.id || currentUser.UserId === updated.id) {
          sessionStorage.setItem("user", JSON.stringify(updated));
          localStorage.setItem("user", JSON.stringify(updated));
        }
      }
      showToast(" Cập nhật tài khoản thành công", "success");
    } else {
      // Thêm tài khoản mới
      const res = await fetch("http://localhost:4000/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Thêm tài khoản thất bại");
      }

      const newAccount = await res.json();
      setAccounts((prev) => [newAccount, ...prev]);
      showToast(" Thêm tài khoản thành công", "success");
    }
    setSelected(null);
  }

  async function removeAccount(id) {
    if (!confirm("Xóa tài khoản này? Tất cả dữ liệu liên quan sẽ bị xóa.")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/admin/accounts?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Xóa thất bại");
      }

      // Xóa khỏi danh sách hiển thị
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      showToast(" Xóa tài khoản thành công", "success");
    } catch (error) {
      console.error("Error removing account:", error);
      showToast(`❌ ${error.message}`, "error");
    }
  }

  async function changePassword(id, currentPassword, newPassword) {
    console.log(" Sending password change request:", { id, currentPassword: "***", newPassword: "***" });
    
    const res = await fetch(`http://localhost:4000/api/admin/accounts/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, currentPassword, newPassword }),
    });

    console.log(" Response status:", res.status);

    if (!res.ok) {
      let errorMessage = "Đổi mật khẩu thất bại";
      try {
        const error = await res.json();
        errorMessage = error.error || errorMessage;
        console.error("❌ Error response:", error);
      } catch (e) {
        console.error("❌ Failed to parse error response");
      }
      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log(" Success:", result);

    setShowPwdFor(null);
    showToast(' Đổi mật khẩu thành công', 'success');
  }

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Tài khoản</h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <AdminPageTitle>Tài khoản</AdminPageTitle>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Tìm theo username, tên, email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">Tất cả vai trò</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button className={styles.btn} onClick={() => setSelected({})}>+ Thêm tài khoản</button>
        <button className={styles.btnGhost} onClick={resetFilters}>Hiện tất cả</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  Không tìm thấy tài khoản nào
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td className={styles.mono}>{a.username}</td>
                  <td>{a.fullName}</td>
                  <td>{a.email}</td>
                  <td>{a.phoneNumber || "—"}</td>
                  <td><RoleBadge role={a.role} /></td>
                  <td>
                    <span className={a.active ? styles.badgeActive : styles.badgeBlocked}>
                      {a.active ? "Hoạt động" : "Khóa"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.iconBtn} 
                      onClick={() => setSelected(a)}
                      data-tooltip="Sửa tài khoản"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      className={styles.iconBtn} 
                      onClick={() => setShowPwdFor(a)}
                      data-tooltip="Đổi mật khẩu"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </button>
                    {(a.role === 'STAFF' || a.role === 'SHIPPER') && (
                      <button 
                        className={styles.iconBtnDanger} 
                        onClick={() => removeAccount(a.id)}
                        data-tooltip="Xóa tài khoản"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              )))
            }
          </tbody>
        </table>
      </div>

      {selected !== null && (
        <AccountModal value={selected} onClose={() => setSelected(null)} onSave={saveAccount} />
      )}

      {showPwdFor !== null && (
        <PasswordModal value={showPwdFor} onClose={() => setShowPwdFor(null)} onSave={changePassword} />
      )}
    </div>
  );
}

function AccountModal({ value, onClose, onSave }) {
  const isEdit = Boolean(value?.id);
  const [form, setForm] = useState({
    id: value?.id,
    username: value?.username || "",
    fullName: value?.fullName || "",
    email: value?.email || "",
    phoneNumber: value?.phoneNumber || "",
    role: value?.role || "STAFF",
    active: value?.active ?? true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate từng field
  function validateField(name, value) {
    let error = "";
    
    switch(name) {
      case "username":
        if (!value.trim()) {
          error = "Username là bắt buộc";
        } else if (value.length < 3) {
          error = "Username tối thiểu 3 ký tự";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Username chỉ chứa chữ, số và dấu gạch dưới";
        }
        break;
      
      case "fullName":
        if (!value.trim()) {
          error = "Họ tên là bắt buộc";
        } else if (value.length < 2) {
          error = "Họ tên tối thiểu 2 ký tự";
        }
        break;
      
      case "email":
        if (!value.trim()) {
          error = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;
      
      case "phoneNumber":
        if (value && !/^[0-9]{10,11}$/.test(value)) {
          error = "Số điện thoại phải là 10-11 chữ số";
        }
        break;
    }
    
    return error;
  }

  // Handle input change với validation
  function handleChange(name, value) {
    setForm({ ...form, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  }

  // Validate toàn bộ form
  function validateForm() {
    const newErrors = {};
    newErrors.username = validateField("username", form.username);
    newErrors.fullName = validateField("fullName", form.fullName);
    newErrors.email = validateField("email", form.email);
    newErrors.phoneNumber = validateField("phoneNumber", form.phoneNumber);
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err);
  }

  async function submit() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(form);
    } catch (error) {
      // Hiển thị lỗi từ API (username trùng, email trùng, etc.)
      setErrors({ ...errors, general: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          {errors.general && (
            <div style={{ 
              padding: '10px 12px', 
              marginBottom: '12px', 
              backgroundColor: '#fee', 
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontSize: '14px'
            }}>
              ❌ {errors.general}
            </div>
          )}

          {/* Tổng số đơn đã giao cho SHIPPER */}
          {isEdit && value?.role === 'SHIPPER' && (
            <div style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '10px 18px',
              marginBottom: 18,
              fontWeight: 600,
              color: '#1976d2',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              Đơn đã giao thành công: <span style={{color:'#22c55e',fontWeight:700}}>{value.deliveredCount ?? 0}</span>
            </div>
          )}

          <div className={styles.formRow}>
            <label>
              <span>Username <span style={{ color: 'red' }}>*</span></span>
              <input 
                value={form.username} 
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Nhập username"
                disabled={isEdit}
                style={{ borderColor: errors.username ? '#ef4444' : '' }}
              />
              {errors.username && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.username}</span>}
            </label>
            <label>
              <span>Họ tên <span style={{ color: 'red' }}>*</span></span>
              <input 
                value={form.fullName} 
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Nhập họ tên đầy đủ"
                style={{ borderColor: errors.fullName ? '#ef4444' : '' }}
              />
              {errors.fullName && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</span>}
            </label>
          </div>

          <div className={styles.formRow}>
            <label>
              <span>Email <span style={{ color: 'red' }}>*</span></span>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                style={{ borderColor: errors.email ? '#ef4444' : '' }}
              />
              {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</span>}
            </label>
            <label>
              <span>Số điện thoại</span>
              <input 
                type="tel" 
                value={form.phoneNumber} 
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="0123456789"
                style={{ borderColor: errors.phoneNumber ? '#ef4444' : '' }}
              />
              {errors.phoneNumber && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.phoneNumber}</span>}
            </label>
          </div>

          <div className={styles.formRow}>
            <label>
              <span>Vai trò</span>
              <select 
                value={form.role} 
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                disabled={isEdit && form.role === 'ADMIN'}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {isEdit && form.role === 'ADMIN' && (
                <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Không thể thay đổi vai trò Admin
                </span>
              )}
            </label>
          </div>

          <label className={styles.checkRow}>
            <input 
              type="checkbox" 
              checked={form.active} 
              onChange={(e) => setForm({ ...form, active: e.target.checked })} 
            />
            <span>Tài khoản đang hoạt động</span>
          </label>

          <div className={styles.roleHint}>
            <strong>Phân quyền:</strong>
            <ul>
              <li><b>Admin</b>: Toàn quyền quản lý hệ thống, thêm/sửa/xóa tài khoản Staff, Shipper.</li>
              <li><b>Nhân viên</b>: Quản lý đơn hàng, sản phẩm, khách hàng. Không quản lý tài khoản.</li>
              <li><b>Shipper</b>: Quản lý đơn hàng được giao, xác nhận giao hàng.</li>
            </ul>
            {!isEdit && (
              <p style={{ marginTop: "8px", fontSize: "13px", color: "#6b7280", fontStyle: "italic" }}>
                 Mật khẩu mặc định: <strong>Username@123</strong> (chữ cái đầu viết hoa)
                <br />
                <span style={{ marginLeft: "20px" }}>Ví dụ: <code>shipper01</code> → <code>Shipper01@123</code></span>
              </p>
            )}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose} disabled={loading}>Hủy</button>
          <button className={styles.btn} onClick={submit} disabled={loading}>
            {loading ? " Đang xử lý..." : (isEdit ? " Lưu thay đổi" : " Thêm tài khoản")}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ value, onClose, onSave }) {
  const [currentPwd, setCurrentPwd] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    
    if (!currentPwd) {
      setError("⚠️ Vui lòng nhập mật khẩu cũ");
      return;
    }
    if (pwd1.length < 6) {
      setError("⚠️ Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }
    if (pwd1 !== pwd2) {
      setError("⚠️ Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      await onSave(value.id, currentPwd, pwd1);
      setCurrentPwd("");
      setPwd1("");
      setPwd2("");
      setError("");
    } catch (err) {
      setError(`❌ ${err.message || "Đổi mật khẩu thất bại"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3> Đổi mật khẩu cho {value.username}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          {error && (
            <div style={{ 
              padding: '10px 12px', 
              marginBottom: '12px', 
              backgroundColor: '#fee', 
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <label>
            <span>Mật khẩu hiện tại <span style={{ color: 'red' }}>*</span></span>
            <input 
              type={show ? "text" : "password"} 
              value={currentPwd} 
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </label>

          <label style={{ marginTop: '12px' }}>
            <span>Mật khẩu mới <span style={{ color: 'red' }}>*</span></span>
            <input 
              type={show ? "text" : "password"} 
              value={pwd1} 
              onChange={(e) => setPwd1(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
            />
          </label>

          <label style={{ marginTop: '12px' }}>
            <span>Nhập lại mật khẩu mới <span style={{ color: 'red' }}>*</span></span>
            <input 
              type={show ? "text" : "password"} 
              value={pwd2} 
              onChange={(e) => setPwd2(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
          </label>

          <label className={styles.checkRow} style={{ marginTop: '12px' }}>
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
            <span>Hiện mật khẩu</span>
          </label>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose} disabled={loading}>Hủy</button>
          <button className={styles.btn} onClick={submit} disabled={loading}>
            {loading ? " Đang xử lý..." : " Cập nhật mật khẩu"}
          </button>
        </div>
      </div>
    </div>
  );
}
