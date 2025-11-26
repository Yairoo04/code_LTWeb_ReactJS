"use client";
import { useRef, useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./shipper-orders.module.scss";

const TABS = [
  { key: "home", label: "Trang chủ" },
  { key: "orders", label: "Quản lý đơn" },
  { key: "profile", label: "Thông tin cá nhân" },
];

// Map trạng thái tiếng Anh sang tiếng Việt
const statusVi = (status) => {
  switch (status) {
    case 'Pending': return 'Chờ xác nhận';
    case 'Processing': return 'Đang chuẩn bị';
    case 'Shipping': return 'Đang giao';
    case 'Delivered': return 'Đã giao';
    case 'Completed': return 'Hoàn thành';
    case 'Cancelled': return 'Hủy';
    default: return status;
  }
};

export default function ShipperOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shipper, setShipper] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const searchRef = useRef();

  useEffect(() => {
    const user = sessionStorage.getItem("shipper");
    if (!user) {
      window.location.href = "/shipper/login";
      return;
    }
    let shipperData = JSON.parse(user);
    // Nếu thiếu trường id, tự động thêm từ UserId
    if (!shipperData.id && shipperData.UserId) {
      shipperData = { id: shipperData.UserId, ...shipperData };
      sessionStorage.setItem("shipper", JSON.stringify(shipperData));
    }
    setShipper(shipperData);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/shipper/orders`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Không lấy được đơn hàng");
      }
    } catch (err) {
      setError("Lỗi kết nối tới server!");
    } finally {
      setLoading(false);
    }
  };

  // Toast nổi góc phải dưới
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    };
    toast.style.cssText = `position:fixed;bottom:32px;right:32px;background:${colors[type]};color:white;padding:14px 24px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.18);z-index:9999;font-size:15px;animation:slideIn 0.3s ease;`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  const handleDelivered = async (orderId) => {
    if (!shipper) return;
    showToast("Xác nhận giao thành công!", 'success'); // Hiện toast ngay
    try {
      const res = await fetch(`/api/shipper/orders/${orderId}/delivered`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipperId: shipper.id }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || "Không thể xác nhận giao hàng!", 'error');
      }
      fetchOrders();
    } catch (err) {
      showToast("Lỗi kết nối tới server!", 'error');
    }
  };

  const handleAccept = async (orderId) => {
    if (!shipper) return;
    showToast("Nhận đơn thành công!", 'success'); // Hiện toast ngay
    try {
      const res = await fetch(`/api/shipper/orders/${orderId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipperId: shipper.id }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || "Không thể nhận đơn!", 'error');
      }
      fetchOrders();
    } catch (err) {
      showToast("Lỗi kết nối tới server!", 'error');
    }
  };

  // Lọc và tìm kiếm
  const filteredOrders = orders.filter((order) => {
    let matchStatus = filter === "all" ||
      (filter === "pending" && (order.status === "Processing" || order.status === "Pending")) ||
      (filter === "shipping" && order.status === "Shipping") ||
      (filter === "done" && order.status === "Delivered" && order.ShipperId === shipper?.id);
    let matchSearch = !search ||
      order.id.toString().includes(search) ||
      (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  // Thống kê tổng số đơn đã giao thành công
  const totalDelivered = orders.filter(o => o.status === 'Delivered' && o.ShipperId === shipper?.id).length;

  if (loading) return <div className="shipper-loading">Đang tải đơn hàng...</div>;
  if (error) return <div className="shipper-error">{error}</div>;

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      {/* Sidebar */}
      <div style={{width:220,background:'#f5f7fa',padding:'32px 0 0 0',borderRight:'1.5px solid #e0e0e0',display:'flex',flexDirection:'column',alignItems:'stretch'}}>
        <div style={{fontWeight:700,fontSize:22,color:'#1976d2',textAlign:'center',marginBottom:32}}>Shipper</div>
        {TABS.map(tab => (
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{
            background:activeTab===tab.key?'#e3f2fd':'transparent',
            color:'#1976d2',
            border:'none',
            borderLeft:activeTab===tab.key?'4px solid #1976d2':'4px solid transparent',
            padding:'14px 18px',
            textAlign:'left',
            fontWeight:activeTab===tab.key?700:500,
            fontSize:17,
            cursor:'pointer',
            outline:'none',
            transition:'all 0.2s',
            marginBottom:10 // tăng khoảng cách giữa các tab
          }}>{tab.label}</button>
        ))}
        <div style={{flex:1}}></div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(90deg, #ef4444 60%, #f87171 100%)',
            color: '#fff',
            border: 'none',
            padding: '10px 22px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            margin: '8px 16px 0 16px',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            boxShadow: '0 2px 8px #ef44441a',
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #dc2626 60%, #f87171 100%)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 4px 16px #ef444433';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #ef4444 60%, #f87171 100%)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 8px #ef44441a';
          }}
          onClick={() => {
            sessionStorage.removeItem('shipper');
            window.location.href = '/shipper/login';
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M16 17v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 12h10m0 0-3-3m3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Đăng xuất
        </button>
      </div>
      {/* Main content */}
      <div style={{flex:1,padding:'36px 36px 0 36px',background:'#f8fafc'}}>
        {activeTab === 'home' && (
          <div style={{maxWidth:600,margin:'0 auto'}}>
            <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:32}}>
              <div style={{background:'#1976d2',borderRadius:'50%',width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/></svg>
              </div>
              <div>
                <div style={{fontSize:22,fontWeight:700,color:'#1976d2',marginBottom:2}}>Chào mừng, {shipper?.FullName || shipper?.fullName || shipper?.Username || shipper?.username}!</div>
                <div style={{fontSize:16,color:'#555'}}>Chúc bạn một ngày giao hàng hiệu quả 🎉</div>
              </div>
            </div>
            <div style={{display:'flex',gap:32,justifyContent:'center',marginTop:24}}>
              <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 12px #1976d21a',padding:'28px 38px',minWidth:220,display:'flex',flexDirection:'column',alignItems:'center'}}>
                <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><path d="M20 8h-3V6a5 5 0 0 0-10 0v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM8 6a4 4 0 0 1 8 0v2H8V6Zm12 14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10Zm-8-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="#22c55e"/></svg>
                <div style={{fontSize:18,fontWeight:600,color:'#1976d2',marginTop:10}}>Đơn đã giao thành công</div>
                <div style={{fontSize:32,fontWeight:700,color:'#22c55e',marginTop:6}}>{totalDelivered}</div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{marginBottom: "28px", marginTop: "4px", letterSpacing: "0.5px"}}>Quản lý đơn hàng Shipper</h2>
            <div className={styles["shipper-toolbar"]} style={{marginBottom: "18px"}}>
              <div className={styles["shipper-filters"]} style={{gap: "18px"}}>
                <button className={filter === "all" ? styles.active : ""} onClick={() => setFilter("all")}>Tất cả</button>
                <button className={filter === "pending" ? styles.active : ""} onClick={() => setFilter("pending")}>Chờ nhận</button>
                <button className={filter === "shipping" ? styles.active : ""} onClick={() => setFilter("shipping")}>Đang giao</button>
                <button className={filter === "done" ? styles.active : ""} onClick={() => setFilter("done")}>Đã giao</button>
              </div>
              <div className={styles["shipper-search"]}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Tìm mã đơn, tên khách..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button onClick={fetchOrders} title="Làm mới danh sách">↻</button>
              </div>
            </div>
            {filteredOrders.length === 0 ? (
              <div className={styles["shipper-empty"]}>Không có đơn hàng nào phù hợp.</div>
            ) : (
              <ul className={styles["shipper-list"]}>
                {filteredOrders.map((order) => {
                  const viStatus = statusVi(order.status);
                  let statusClass = styles["order-status"];
                  if (order.status === 'Shipping') statusClass += ' ' + styles["shipping"];
                  else if (order.status === 'Delivered') statusClass += ' ' + styles["done"];
                  else if (order.status === 'Pending' || order.status === 'Processing') statusClass += ' ' + styles["pending"];
                  return (
                    <li key={order.id} className={styles["shipper-order-item"]}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                        <span className={statusClass}>{viStatus}</span>
                        <span style={{fontWeight:600, color:'#1976d2'}}>#{order.id}</span>
                      </div>
                      <div><b>Khách:</b> {order.customerName}</div>
                      <div><b>Địa chỉ:</b> {order.address}</div>
                      <div><b>SĐT:</b> {order.phone}</div>
                      <div><b>Số tiền:</b> {order.total?.toLocaleString()} đ</div>
                      {/* Nút nhận đơn và xác nhận giao đúng logic trạng thái */}
                      {order.status === 'Processing' && !order.ShipperId ? (
                        <button onClick={() => handleAccept(order.id)}>Nhận đơn</button>
                      ) : order.status === 'Shipping' && order.ShipperId === shipper?.id ? (
                        <button onClick={() => handleDelivered(order.id)}>Đã giao</button>
                      ) : order.status === 'Delivered' && order.ShipperId === shipper?.id ? (
                        <span className={styles["order-done"]}>✔ Đã hoàn thành</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        {activeTab === 'profile' && shipper && (
          <div style={{maxWidth:520,margin:'0 auto',marginTop:24}}>
            <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 12px #1976d21a',padding:'32px 36px'}}>
              <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:18}}>
                <div style={{background:'#1976d2',borderRadius:'50%',width:54,height:54,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/></svg>
                </div>
                <div>
                  <div style={{fontSize:20,fontWeight:700,color:'#1976d2',marginBottom:2}}>Thông tin cá nhân</div>
                  <div style={{fontSize:15,color:'#555'}}>{shipper?.FullName || shipper?.fullName}</div>
                </div>
              </div>
              <div style={{fontSize:17,marginTop:8,lineHeight:'2.1'}}>
                <div><b>Họ tên:</b> {shipper.FullName || shipper.fullName}</div>
                <div><b>Tên đăng nhập:</b> {shipper.Username || shipper.username}</div>
                <div><b>Email:</b> {shipper.Email || shipper.email}</div>
                <div><b>SĐT:</b> {shipper.Phone || shipper.phone}</div>
                <div><b>Ngày tạo:</b> {shipper.CreatedAt ? new Date(shipper.CreatedAt).toLocaleString() : ''}</div>
                <div><b>Trạng thái:</b> {shipper.IsActive === false || shipper.IsActive === 0 ? <span style={{color:'#ef4444'}}>Đã khóa</span> : <span style={{color:'#22c55e'}}>Đang hoạt động</span>}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
