"use client";
import { useState, useEffect } from "react";
import "../admin.scss";
import styles from "./statistics.module.scss";
import AdminPageTitle from "@/components/AdminPageTitle";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function StatisticsPage() {
  const [view, setView] = useState('day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [view]);

  async function fetchStats() {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/statistics?view=${view}`);
      const result = await res.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const maxRevenue = data.length > 0 ? Math.max(...data.map(d => d.revenue)) : 1;

  function barWidth(revenue) {
    const pct = (revenue / maxRevenue) * 100;
    return Math.max(4, pct);
  }

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingSpinner message="Đang tải dữ liệu thống kê..." />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className={styles.statsHeader}>
        <div className={styles.headerContent}>
          <AdminPageTitle>Thống kê doanh thu</AdminPageTitle>
          <p>Xem doanh thu theo ngày, tuần hoặc tháng</p>
        </div>
        <div className={styles.viewTabs}>
          <button 
            className={view === 'day' ? styles.active : ''} 
            onClick={() => setView('day')}
          >
            Theo ngày
          </button>
          <button 
            className={view === 'week' ? styles.active : ''} 
            onClick={() => setView('week')}
          >
            Theo tuần
          </button>
          <button 
            className={view === 'month' ? styles.active : ''} 
            onClick={() => setView('month')}
          >
            Theo tháng
          </button>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3>
            {view === 'day' && 'Doanh thu 10 ngày gần nhất'}
            {view === 'week' && 'Doanh thu theo tuần của tháng'}
            {view === 'month' && 'Doanh thu 12 tháng gần nhất'}
          </h3>
        </div>
        
        <div className={styles.chartBody}>
          {data.length === 0 ? (
            <div className={styles.noData}>Chưa có dữ liệu</div>
          ) : (
            <div className={styles.barChart}>
              {data.map((item, index) => (
                <div key={index} className={styles.barItem}>
                  <div className={styles.barLabel}>
                    {view === 'day' ? formatDate(item.period) : item.period}
                  </div>
                  <div className={styles.barWrapper}>
                    <div 
                      className={`${styles.bar} ${barWidth(item.revenue) < 12 ? styles.barSmall : ''}`}
                      style={{ width: `${barWidth(item.revenue)}%` }}
                      title={`${item.period}: ${formatMoney(item.revenue)}`}
                    />
                  </div>
                  <div className={styles.barValueRight}>{formatMoney(item.revenue)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
