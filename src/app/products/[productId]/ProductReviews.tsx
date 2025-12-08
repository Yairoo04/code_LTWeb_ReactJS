'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import styles from './ProductDetail.module.scss';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

const TOKEN_KEY = 'token';

type Review = {
  id: number;
  productId: number;
  userId: number;
  authorName: string;
  rating: number;
  comment: string | null;
  images?: string[];
  createdAt: string;
  updatedAt?: string | null;
  isEdited: boolean;
};

type Summary = {
  totalReviews: number;
  averageRating: number;
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
};

type Props = {
  productId: string;
};

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

function buildReviewImageUrl(img: string) {
  if (!img) return '';

  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  const base = (API_BASE || '').replace(/\/+$/, '');

  if (img.startsWith('/')) {
    return `${base}${img}`;
  }

  return `${base}/${img}`;
}

export default function ProductReviews({ productId }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [commentInput, setCommentInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  async function loadReviews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/products/${productId}/reviews`,
        { cache: 'no-store' },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không tải được đánh giá');
      }
      setSummary(json.data.summary);
      setReviews(json.data.reviews);
    } catch (e: any) {
      setError(e?.message ?? 'Lỗi tải đánh giá');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > MAX_IMAGES) {
      setError(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE) {
        setError('Mỗi ảnh tối đa 2MB.');
        continue;
      }
      if (!ALLOWED_MIME.includes(file.type)) {
        setError('Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.');
        continue;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    if (validFiles.length === 0) {
      return;
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
  }

  function removeImage(index: number) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setError('Bạn cần đăng nhập để đánh giá sản phẩm.');
      return;
    }
    if (!ratingInput) {
      setError('Vui lòng chọn số sao.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('rating', ratingInput.toString());
      if (commentInput.trim()) {
        formData.append('comment', commentInput.trim());
      }
      selectedImages.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch(
        `${API_BASE}/api/products/${productId}/reviews`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không gửi được đánh giá');
      }
      setSummary(json.data.summary);
      setReviews(json.data.reviews);
      setCommentInput('');
      setRatingInput(0);
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (e: any) {
      const rawMessage = e?.message ?? 'Lỗi gửi đánh giá';

      // Map thông báo từ backend sang thông điệp thân thiện cho user
      if (rawMessage === 'User has not purchased this product or order is not completed.') {
        setError(
          'Bạn cần mua sản phẩm này và hoàn tất đơn hàng (đã nhận hàng) thì mới có thể đánh giá.'
        );
      } else {
        setError(rawMessage);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function renderStars(value: number) {
    return (
      <div className={styles.reviewStars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <FontAwesomeIcon
            key={s}
            icon={s <= value ? faStarSolid : faStarRegular}
          />
        ))}
      </div>
    );
  }

  const total = summary?.totalReviews ?? 0;
  const avg = summary?.averageRating ?? 0;
  const avgDisplay = avg.toFixed(1);

  function percent(count: number) {
    if (!total) return 0;
    return Math.round((count * 100) / total);
  }

  return (
    <section className={styles.reviews}>
      <div className={styles.reviewsSummary}>
        <h2>Đánh giá từ khách hàng</h2>
        <div className={styles.reviewsSummaryMain}>
          <span className={styles.reviewsAverage}>{avgDisplay}</span>
          <div>
            <div className={styles.reviewsStars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <FontAwesomeIcon
                  key={s}
                  icon={s <= Math.round(avg) ? faStarSolid : faStarRegular}
                />
              ))}
            </div>
            <div className={styles.reviewsCount}>{total} đánh giá</div>
          </div>
        </div>

        {[5, 4, 3, 2, 1].map((s) => {
          const count =
            s === 5
              ? summary?.star5 ?? 0
              : s === 4
                ? summary?.star4 ?? 0
                : s === 3
                  ? summary?.star3 ?? 0
                  : s === 2
                    ? summary?.star2 ?? 0
                    : summary?.star1 ?? 0;
          return (
            <div key={s} className={styles.reviewsStarRow}>
              <span>{s} sao</span>
              <div className={styles.reviewsBar}>
                <div
                  className={styles.reviewsBarInner}
                  style={{ width: `${percent(count)}%` }}
                />
              </div>
              <span>{count}</span>
            </div>
          );
        })}
      </div>

      <div>
        <div className={styles.reviewsForm}>
          <h3>Viết đánh giá</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.reviewsFormStars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRatingInput(s)}
                  aria-label={`${s} sao`}
                >
                  <FontAwesomeIcon
                    icon={s <= ratingInput ? faStarSolid : faStarRegular}
                  />
                </button>
              ))}
            </div>
            <textarea
              className={styles.reviewsTextarea}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <div className={styles.reviewsImageUpload}>
              <label htmlFor="imageUpload">Thêm ảnh (tối đa 5 ảnh)</label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <div className={styles.imagePreviews}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={styles.imagePreviewItem}>
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {error && (
              <div className={styles.reviewAlert}>
                <div className={styles.reviewAlertText}>
                  {error}
                </div>

                {/* Nếu là lỗi chưa mua hàng ⇒ hiện nút Tiếp tục mua hàng */}
                {error.includes('mua sản phẩm này và hoàn tất đơn hàng') && (
                  <Link href="/collections/all" className={styles.reviewAlertButton}>
                    Tiếp tục mua hàng
                  </Link>
                )}
              </div>
            )}
            <button
              type="submit"
              className={styles.reviewsSubmit}
              disabled={submitting}
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </form>
        </div>

        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map((r) => (
              <article key={r.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewAuthor}>
                    {r.authorName}
                  </div>
                  <div className={styles.reviewDate}>
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    {r.isEdited ? ' (Đã chỉnh sửa)' : ''}
                  </div>
                </div>
                {renderStars(r.rating)}
                {r.comment && (
                  <div className={styles.reviewComment}>{r.comment}</div>
                )}
                {r.images && r.images.length > 0 && (
                  <div className={styles.reviewImages}>
                    {r.images.map((img, index) => (
                      <img
                        key={index}
                        src={buildReviewImageUrl(img)}
                        alt={`Review image ${index + 1}`}
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
