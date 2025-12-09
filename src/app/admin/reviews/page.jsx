"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./reviews.module.scss";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [replyModal, setReplyModal] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  // Tìm kiếm realtime khi gõ
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReviews();
    }, 350);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/reviews?search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setReviews(data.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  function openReplyModal(reviewId) {
    setReplyModal(reviewId);
    setReplyContent("");
  }

  function closeReplyModal() {
    setReplyModal(null);
    setReplyContent("");
  }

  async function sendReply() {
    if (!replyContent.trim()) {
      alert("Vui lòng nhập nội dung trả lời!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/reviews`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: replyModal,
          action: "reply",
          replyContent
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
        closeReplyModal();
      } else {
        alert(data.error || "Gửi trả lời thất bại!");
      }
    } catch {
      alert("Không thể gửi trả lời!");
    }
  }

  async function handleToggleActive(reviewId) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/reviews`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action: "toggleActive" })
      });
      const data = await res.json();
      if (data.success) fetchReviews();
      else alert(data.error || "Thao tác thất bại");
    } catch {
      alert("Không thể cập nhật trạng thái!");
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/reviews?reviewId=${reviewId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) fetchReviews();
      else alert(data.error || "Xóa thất bại");
    } catch {
      alert("Không thể xóa đánh giá!");
    }
  }

  return (
    <div className={styles.reviewsPage}>
      <h2>Đánh giá sản phẩm</h2>

      {/* ===== TOOLBAR ===== */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên, sản phẩm, nội dung..."
        />
        <button className={styles.btn} onClick={fetchReviews}>
          Tìm kiếm
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Sao</th>
                <th>Nội dung</th>
                <th>Ngày đánh giá</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map(r => (
                <tr key={r.ReviewId}>
                  <td>{r.FullName || r.Username || "Ẩn danh"}</td>

                  <td>
                    <Link
                      href={`/products/${r.ProductId}`}
                      target="_blank"
                      className={styles.productLink}
                      style={{ textDecoration: "none" }}
                    >
                      {r.ProductName || `#${r.ProductId}`}
                    </Link>
                  </td>

                  <td>{r.Rating}</td>

                  <td>
                    {r.Comment}
                    {r.ReplyContent && (
                      <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>
                        <strong>Phản hồi:</strong> {r.ReplyContent}
                      </div>
                    )}
                  </td>

                  <td>
                    {new Date(r.CreatedAt).toLocaleString("vi-VN")}
                  </td>

                  <td>
                    {r.IsActive ? (
                      <span className={styles.badgeActive}>Hiện</span>
                    ) : (
                      <span className={styles.badgeBlocked}>Ẩn</span>
                    )}
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.iconBtn}
                        data-tooltip="Trả lời"
                        onClick={() => openReplyModal(r.ReviewId)}
                      >
                        💬
                      </button>

                      <button
                        className={styles.iconBtn}
                        data-tooltip={r.IsActive ? "Ẩn" : "Hiện"}
                        onClick={() => handleToggleActive(r.ReviewId)}
                      >
                        {r.IsActive ? "🙈" : "🐵"}
                      </button>

                      <button
                        className={styles.iconBtnDanger}
                        data-tooltip="Xóa"
                        onClick={() => handleDeleteReview(r.ReviewId)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {reviews.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                    Không có đánh giá nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {replyModal && (
        <div className={styles.modalOverlay} onClick={closeReplyModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Trả lời đánh giá</h3>
              <button className={styles.closeBtn} onClick={closeReplyModal}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Nhập nội dung trả lời..."
              />
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnGhost} onClick={closeReplyModal}>
                Hủy
              </button>
              <button className={styles.btn} onClick={sendReply}>
                Gửi trả lời
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
