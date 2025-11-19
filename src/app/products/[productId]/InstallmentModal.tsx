"use client";

import { useState } from "react";
import styles from "./InstallmentModal.module.scss";
import Image from "next/image";

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    ProductId: number;
    Name: string;
    Price: number;
    DiscountPrice?: number;
    ImageUrl: string;
  };
}

/*
  FIX QUAN TRỌNG:
  - Backend của bạn trả ImageUrl dạng JSON string:
    "[\"/images/products/p1.webp\", \"/images/products/p2.jpg\"]"
  - Hoặc đôi khi là chuỗi CSV: "/a.jpg,/b.jpg"
  - Hàm dưới đây parse thông minh 100% -> không crash Next.js Image.
*/
function getValidImageSrc(input: string): string {
  if (!input) return "/images/placeholder.jpg";

  let firstImage = "";

  // TH1: ImageUrl là JSON array dạng chuỗi
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed) && parsed.length > 0) {
      firstImage = parsed[0];
    }
  } catch {
    // TH2: ImageUrl là list kiểu CSV hoặc chuỗi đơn
    firstImage = input.split(",")[0]?.trim();
  }

  // fallback nếu empty
  if (!firstImage) return "/images/placeholder.jpg";

  // Chuẩn hoá URL để Next.js <Image> không lỗi
  if (firstImage.startsWith("/")) return firstImage;
  if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) return firstImage;
  if (firstImage.startsWith("//")) return "https:" + firstImage;

  // Nếu weird string -> ép thành local path
  return "/" + firstImage.replace(/^\.+/, "");
}

export default function InstallmentModal({
  isOpen,
  onClose,
  product
}: InstallmentModalProps) {
  if (!isOpen) return null;

  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(false);

  const finalPrice = product.DiscountPrice || product.Price;

  const monthlyPayment = Math.round(finalPrice / months);
  const interestRate = months > 6 ? 1.5 : 0;
  const totalWithInterest = Math.round(finalPrice * (1 + (interestRate * months) / 100));
  const monthlyWithInterest = Math.round(totalWithInterest / months);

  // FIX: ảnh 100% hợp lệ
  const imageSrc = getValidImageSrc(product.ImageUrl);

  const handleProceed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Vui lòng đăng nhập để làm trả góp!");
        onClose();
        return;
      }

      const res = await fetch("/api/installment/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.ProductId,
          months,
          totalAmount: finalPrice,
          monthlyPayment: interestRate > 0 ? monthlyWithInterest : monthlyPayment,
          type: months <= 6 ? "credit-card-zero-percent" : "hd-saison",
        }),
      });

      const json = await res.json();

      if (res.ok) {
        alert("Đã gửi hồ sơ trả góp thành công! Nhân viên sẽ liên hệ bạn trong 2–4 giờ.");
        onClose();
      } else {
        throw new Error(json.message || "Gửi hồ sơ trả góp thất bại!");
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <div className={styles.modalHeader}>
          <h2>Trả góp 0% hoặc qua HD Saison</h2>

          <div className={styles.productMini}>
            <Image
              src={imageSrc}
              alt={product.Name}
              width={90}
              height={90}
              className={styles.thumb}
              unoptimized={imageSrc.startsWith("http")}
            />
            <div>
              <strong>{product.Name}</strong>
              <p className={styles.price}>{finalPrice.toLocaleString()}đ</p>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.option}>
            <h3>Chọn kỳ hạn trả góp</h3>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className={styles.select}
            >
              <option value={3}>3 tháng (0% lãi suất)</option>
              <option value={6}>6 tháng (0% lãi suất)</option>
              <option value={9}>9 tháng (1.5%/tháng)</option>
              <option value={12}>12 tháng (qua HD Saison)</option>
            </select>
          </div>

          <div className={styles.calculation}>
            <div className={styles.row}>
              <span>Giá trị đơn hàng:</span>
              <strong>{finalPrice.toLocaleString()}đ</strong>
            </div>

            {interestRate > 0 && (
              <>
                <div className={styles.row}>
                  <span>Lãi suất/tháng:</span>
                  <strong>{interestRate}%</strong>
                </div>
                <div className={styles.row}>
                  <span>Tổng tiền phải trả:</span>
                  <strong>{totalWithInterest.toLocaleString()}đ</strong>
                </div>
              </>
            )}

            <div className={styles.rowHighlight}>
              <span>Trả mỗi tháng:</span>
              <strong>
                {(interestRate > 0 ? monthlyWithInterest : monthlyPayment).toLocaleString()}đ
              </strong>
            </div>
          </div>

          <div className={styles.banks}>
            <p>Hỗ trợ qua các đối tác:</p>
            <div className={styles.bankList}>
              <Image src="/images/banks/momo_banking.png" width={70} height={40} alt="HD Saison" />
              <Image src="/images/banks/zalo_pay_banking.png" width={70} height={40} alt="FE Credit" />
              {/* <Image src="/images/banks/momo_banking.png" width={65} height={45} alt="mPOS" /> */}
              {/* <Image src="/images/banks/zalo_pay_banking.png" width={85} height={45} alt="Home Credit" /> */}
            </div>
          </div>

          <button className={styles.proceedBtn} onClick={handleProceed} disabled={loading}>
            {loading ? "Đang gửi hồ sơ..." : "TIẾN HÀNH TRẢ GÓP"}
          </button>

          <p className={styles.note}>Nhân viên sẽ liên hệ bạn trong 2–4 giờ làm việc</p>
        </div>
      </div>
    </div>
  );
}
