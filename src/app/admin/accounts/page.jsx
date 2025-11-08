"use client";
import { useMemo, useState } from "react";
import "../admin.scss";
import styles from "./accounts.module.scss";

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Quản lý" },
  { value: "STAFF", label: "Nhân viên" },
];

const SAMPLE_ACCOUNTS = [
  { id: 1, username: "admin", fullName: "Super Admin", email: "admin@gtn.vn", role: "ADMIN", active: true, lastLogin: "2025-10-12T09:30:00Z" },
  { id: 2, username: "manager", fullName: "Nguyễn Quản Lý", email: "manager@gtn.vn", role: "MANAGER", active: true, lastLogin: "2025-10-10T08:00:00Z" },
  { id: 3, username: "staff01", fullName: "Trần Nhân Viên", email: "staff01@gtn.vn", role: "STAFF", active: true, lastLogin: "2025-10-08T14:25:00Z" },
];

function RoleBadge({ role }) {
  const map = {
    ADMIN: styles.badgeAdmin,
    MANAGER: styles.badgeManager,
    STAFF: styles.badgeStaff,
  };
  const label = ROLES.find((r) => r.value === role)?.label || role;
  return <span className={map[role] || styles.badgeStaff}>{label}</span>;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(SAMPLE_ACCOUNTS);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showPwdFor, setShowPwdFor] = useState(null);

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

  function saveAccount(data) {
    if (data.id) {
      setAccounts((prev) => prev.map((a) => (a.id === data.id ? { ...a, ...data } : a)));
    } else {
      const id = Math.max(0, ...accounts.map((a) => a.id)) + 1;
      setAccounts((prev) => [...prev, { ...data, id, active: true, lastLogin: null }]);
    }
    setSelected(null);
  }

  function removeAccount(id) {
    if (confirm("Xóa tài khoản này?")) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
  }

  function changePassword(id, newPwd) {
    // Mock: chỉ đóng modal. Thực tế sẽ gọi API.
    console.log("Change password for", id, newPwd);
    setShowPwdFor(null);
    alert("Đổi mật khẩu thành công (demo)");
  }

  return (
    <div className="admin-page">
      <h2>Tài khoản</h2>

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
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Đăng nhập gần nhất</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td className={styles.mono}>{a.username}</td>
                <td>{a.fullName}</td>
                <td>{a.email}</td>
                <td><RoleBadge role={a.role} /></td>
                <td>
                  <span className={a.active ? styles.badgeActive : styles.badgeBlocked}>
                    {a.active ? "Hoạt động" : "Khóa"}
                  </span>
                </td>
                <td>{a.lastLogin ? new Date(a.lastLogin).toLocaleString("vi-VN") : "—"}</td>
                <td className={styles.actions}>
                  <button className={styles.btnGhost} onClick={() => setSelected(a)}>Sửa</button>
                  <button className={styles.btnGhost} onClick={() => setShowPwdFor(a)}>Đổi mật khẩu</button>
                  <button className={styles.btnDanger} onClick={() => removeAccount(a.id)}>Xóa</button>
                </td>
              </tr>
            ))}
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
    role: value?.role || "STAFF",
    active: value?.active ?? true,
  });

  function submit() {
    if (!form.username.trim() || !form.fullName.trim() || !form.email.trim()) {
      alert("Vui lòng nhập đầy đủ Username, Họ tên và Email");
      return;
    }
    onSave(form);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            <label>
              <span>Username</span>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </label>
            <label>
              <span>Họ tên</span>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              <span>Vai trò</span>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </label>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              <span>Hoạt động</span>
            </label>
          </div>

          <div className={styles.roleHint}>
            Quyền:
            <ul>
              <li><b>Admin</b>: toàn quyền mọi chức năng.</li>
              <li><b>Quản lý</b>: quản lý sản phẩm, đơn hàng, khách hàng; không chỉnh cấu hình hệ thống.</li>
              <li><b>Nhân viên</b>: xem/chuẩn bị đơn, cập nhật trạng thái; không xóa dữ liệu.</li>
            </ul>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btn} onClick={submit}>{isEdit ? "Lưu" : "Thêm"}</button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ value, onClose, onSave }) {
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [show, setShow] = useState(false);

  function submit() {
    if (pwd1.length < 6) return alert("Mật khẩu tối thiểu 6 ký tự");
    if (pwd1 !== pwd2) return alert("Mật khẩu nhập lại không khớp");
    onSave(value.id, pwd1);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Đổi mật khẩu cho {value.username}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            <label>
              <span>Mật khẩu mới</span>
              <input type={show ? "text" : "password"} value={pwd1} onChange={(e) => setPwd1(e.target.value)} />
            </label>
            <label>
              <span>Nhập lại mật khẩu</span>
              <input type={show ? "text" : "password"} value={pwd2} onChange={(e) => setPwd2(e.target.value)} />
            </label>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
              <span>Hiện mật khẩu</span>
            </label>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btn} onClick={submit}>Cập nhật</button>
        </div>
      </div>
    </div>
  );
}
