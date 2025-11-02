"use client";
import "./../../admin/admin.scss";
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
  // 🔹 DỮ LIỆU ẢO (DEMO)
  // ===============================
const stats = [
  { title: "Doanh thu hôm nay", value: "5.000.000 ₫", icon: CurrencyDollarIcon },
  { title: "Đơn hàng mới", value: "12", icon: ShoppingCartIcon },
  { title: "Khách hàng mới", value: "4", icon: UserPlusIcon },
  { title: "Tổng sản phẩm", value: "128", icon: ComputerDesktopIcon },
  { title: "Đơn hàng đang giao", value: "9", icon: TruckIcon },
  { title: "Doanh thu tháng này", value: "92.500.000 ₫", icon: ClipboardDocumentListIcon },
];


  // Biểu đồ 1: Doanh thu 7 ngày gần nhất
  const revenueLabels = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"];
  const revenueData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: [4500000, 5200000, 6100000, 4800000, 7200000, 8300000, 9100000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Biểu đồ 2: Doanh thu theo thương hiệu
  const brandData = {
    labels: ["Dell", "HP", "Asus", "Lenovo", "MSI"],
    datasets: [
      {
        label: "Doanh thu (triệu ₫)",
        data: [85, 65, 78, 50, 40],
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

  // Biểu đồ 3: Tỷ lệ trạng thái đơn hàng
  const orderStatusData = {
    labels: ["Đang xử lý", "Đang giao", "Đã giao", "Huỷ"],
    datasets: [
      {
        data: [15, 10, 35, 5],
        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#10b981",
          "#ef4444",
        ],
      },
    ],
  };

  // Bảng: Đơn hàng gần nhất
  const recentOrders = [
    { id: "DH001", customer: "Nguyễn Văn A", total: "15.200.000 ₫", status: "Đang giao", date: "20/10/2025" },
    { id: "DH002", customer: "Trần Thị B", total: "8.900.000 ₫", status: "Đã giao", date: "19/10/2025" },
    { id: "DH003", customer: "Lê Văn C", total: "12.500.000 ₫", status: "Đang xử lý", date: "19/10/2025" },
    { id: "DH004", customer: "Phạm Minh D", total: "5.600.000 ₫", status: "Huỷ", date: "18/10/2025" },
    { id: "DH005", customer: "Ngô Thị E", total: "9.300.000 ₫", status: "Đã giao", date: "18/10/2025" },
  ];

  // Bảng: Sản phẩm bán chạy
  const topProducts = [
    { id: "LP001", name: "Dell XPS 13", sold: 35, revenue: "52.500.000 ₫" },
    { id: "LP002", name: "HP Spectre x360", sold: 28, revenue: "41.200.000 ₫" },
    { id: "LP003", name: "Asus ROG Zephyrus G14", sold: 22, revenue: "38.600.000 ₫" },
    { id: "LP004", name: "Lenovo ThinkPad X1", sold: 19, revenue: "33.400.000 ₫" },
    { id: "LP005", name: "MSI GF63 Thin", sold: 17, revenue: "27.900.000 ₫" },
  ];

  // ===============================
  // 🔹 RENDER GIAO DIỆN
  // ===============================
  return (
    <div className="admin-page">
      <h2>📊 Trang chủ</h2>

      {/* --- Cards thống kê --- */}
      <div className="dashboard-stats">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={i}>
              <div className="icon-wrap">
                <Icon className="icon" />
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Biểu đồ chi tiết --- */}
      <div className="charts-grid">
        <div className="chart-box">
          <h3>Doanh thu 7 ngày gần nhất</h3>
          <Line data={revenueData} />
        </div>
        <div className="chart-box">
          <h3>Doanh thu theo thương hiệu</h3>
          <Bar data={brandData} />
        </div>
        <div className="chart-box">
          <h3>Tỷ lệ đơn hàng theo trạng thái</h3>
          <Pie data={orderStatusData} />
        </div>
      </div>

      {/* --- Bảng dữ liệu nhanh --- */}
      <div className="tables-section">
        <div className="table-box">
          <h3>🧾 Đơn hàng gần nhất</h3>
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
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.total}</td>
                  <td>{o.status}</td>
                  <td>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h3>🔥 Sản phẩm bán chạy</h3>
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
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.sold}</td>
                  <td>{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
