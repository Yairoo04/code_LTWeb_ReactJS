"use client";
import { useState, useEffect } from "react";
import "./../../admin/admin.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import AdminPageTitle from "@/components/AdminPageTitle";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  TruckIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  // ===============================
  // 🔹 STATE QUẢN LÝ DỮ LIỆU
  // ===============================
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [revenue7Days, setRevenue7Days] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);

  // ===============================
  // 🔹 FETCH DỮ LIỆU TỪ API
  // ===============================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

        // 1. Tổng quan
        const overviewRes = await fetch(`${API_BASE}/api/admin/dashboard-overview`);
        const overviewData = await overviewRes.json();
        if (overviewData.success) setOverview(overviewData.data);

        // 2. Doanh thu 7 ngày
        const revenue7Res = await fetch(`${API_BASE}/api/admin/revenue-7days`);
        const revenue7Data = await revenue7Res.json();
        if (revenue7Data.success) setRevenue7Days(revenue7Data.data);

        // 3. Trạng thái đơn hàng
        const statusRes = await fetch(`${API_BASE}/api/admin/order-status`);
        const statusData = await statusRes.json();
        if (statusData.success) setOrderStatus(statusData.data);

        // 4. Sản phẩm bán chạy
        const topProdRes = await fetch(`${API_BASE}/api/admin/top-products?top=5`);
        const topProdData = await topProdRes.json();
        if (topProdData.success) setTopProducts(topProdData.data);

        // 5. Đơn hàng gần nhất
        const ordersRes = await fetch(`${API_BASE}/api/admin/recent-orders`);
        const ordersData = await ordersRes.json();
        if (ordersData.success) setRecentOrders(ordersData.data);

        // 6. Doanh thu theo danh mục
        const categoryRes = await fetch(`${API_BASE}/api/admin/revenue-by-category`);
        const categoryData = await categoryRes.json();
        if (categoryData.success) setRevenueByCategory(categoryData.data);

      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ===============================
  // 🔹 FORMAT SỐ TIỀN
  // ===============================
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // ===============================
  // 🔹 CHUẨN BỊ DỮ LIỆU CHO CARDS
  // ===============================
  const stats = overview ? [
    { 
      title: "Doanh thu hôm nay", 
      value: formatMoney(overview.doanhThuHomNay), 
      icon: CurrencyDollarIcon, 
      color: "blue" 
    },
    { 
      title: "Đơn hàng mới", 
      value: overview.donHangMoi.toString(), 
      icon: ShoppingCartIcon, 
      color: "amber" 
    },
    { 
      title: "Khách hàng mới", 
      value: overview.khachHangMoi.toString(), 
      icon: UserPlusIcon, 
      color: "emerald" 
    },
    { 
      title: "Tổng sản phẩm", 
      value: overview.tongSanPham.toString(), 
      icon: ComputerDesktopIcon, 
      color: "indigo" 
    },
    { 
      title: "Đơn hàng đang giao", 
      value: overview.donDangGiao.toString(), 
      icon: TruckIcon, 
      color: "violet" 
    },
    { 
      title: "Doanh thu tháng này", 
      value: formatMoney(overview.doanhThuThangNay), 
      icon: ClipboardDocumentListIcon, 
      color: "rose" 
    },
  ] : [];

  // ===============================
  // 🔹 DỮ LIỆU BIỂU ĐỒ 1: Doanh thu 7 ngày
  // ===============================
  const revenueData = {
    labels: revenue7Days.map(d => {
      const days = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'];
      return days[new Date(d.Ngay).getDay()];
    }),
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: revenue7Days.map(d => d.DoanhThu),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // ===============================
  // 🔹 DỮ LIỆU BIỂU ĐỒ 2: Doanh thu theo danh mục
  // ===============================
  const categoryData = {
    labels: revenueByCategory.map(c => c.DanhMuc || 'Khác'),
    datasets: [
      {
        label: "Doanh thu (triệu ₫)",
        data: revenueByCategory.map(c => c.DoanhThu / 1000000),
        backgroundColor: [
          "#2563eb",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
      },
    ],
  };

  // ===============================
  // 🔹 DỮ LIỆU BIỂU ĐỒ 3: Tỷ lệ trạng thái đơn hàng
  // ===============================
  const orderStatusData = {
    labels: orderStatus.map(s => s.TrangThai),
    datasets: [
      {
        data: orderStatus.map(s => s.SoLuong),
        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#10b981",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
        ],
      },
    ],
  };

  // Options cho biểu đồ Pie với hiển thị %
  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} đơn (${percentage}%)`;
          }
        }
      },
      legend: {
        position: 'bottom',
      }
    }
  };

  // ===============================
  // 🔹 HIỂN THỊ LOADING
  // ===============================
  if (loading) {
    return (
      <div className="admin-page">
        <AdminPageTitle>Trang chủ</AdminPageTitle>
        <LoadingSpinner message="Đang tải dữ liệu tổng quan..." />
      </div>
    );
  }

  // ===============================
  // 🔹 RENDER GIAO DIỆN
  // ===============================
  return (
    <div className="admin-page">
      <AdminPageTitle>Trang chủ</AdminPageTitle>

      {/* --- Cards thống kê --- */}
      <div className="dashboard-stats">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className={`stat-card is-${s.color || 'blue'}`} key={i}>
              <div className="icon-wrap">
                <Icon className="icon" />
              </div>
              <div>
                <h3>{s.title}</h3>
                <p className="stat-value">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Biểu đồ chi tiết --- */}
      <div className="charts-grid">
        <div className="chart-box">
          <h3>Doanh thu 7 ngày gần nhất</h3>
          {revenue7Days.length > 0 ? (
            <Line data={revenueData} />
          ) : (
            <p>Chưa có dữ liệu</p>
          )}
        </div>
        <div className="chart-box">
          <h3>Doanh thu theo danh mục</h3>
          {revenueByCategory.length > 0 ? (
            <Bar data={categoryData} />
          ) : (
            <p>Chưa có dữ liệu</p>
          )}
        </div>
        <div className="chart-box">
          <h3>Tỷ lệ đơn hàng theo trạng thái</h3>
          {orderStatus.length > 0 ? (
            <Pie data={orderStatusData} options={pieOptions} />
          ) : (
            <p>Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      {/* --- Bảng dữ liệu nhanh --- */}
      <div className="tables-section">
        <div className="table-box">
          <h3> Đơn hàng gần nhất</h3>
          <table>
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.OrderId}>
                  <td>DH{o.OrderId.toString().padStart(3, '0')}</td>
                  <td>{o.RecipientName}</td>
                  <td>{formatMoney(o.TotalAmount)}</td>
                  <td>{o.Status}</td>
                  <td>{formatDate(o.CreatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h3> Sản phẩm bán chạy</h3>
          <table>
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Đã bán</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.ProductId}>
                  <td>SP{p.ProductId.toString().padStart(3, '0')}</td>
                  <td>{p.Name}</td>
                  <td>{p.TongSoLuongBan}</td>
                  <td>{formatMoney(p.TongDoanhThu)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}