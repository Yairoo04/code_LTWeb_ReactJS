"use client";
import "../admin.scss";

export default function StatisticsPage() {
  const stats = {
    today: 5000000,
    week: 35000000,
    month: 120000000,
  };

  return (
    <div className="admin-page">
      <h2>Thống kê doanh thu</h2>
      <div className="stats-box">
        <div className="stat-card">
          <h3>Hôm nay</h3>
<p>{stats.today.toLocaleString("vi-VN")}₫</p>
        </div>
        <div className="stat-card">
          <h3>Tuần này</h3>
<p>{stats.week.toLocaleString("vi-VN")}₫</p>
        </div>
        <div className="stat-card">
          <h3>Tháng này</h3>
<p>{stats.month.toLocaleString("vi-VN")}₫</p>
        </div>
      </div>
    </div>
  );
}
