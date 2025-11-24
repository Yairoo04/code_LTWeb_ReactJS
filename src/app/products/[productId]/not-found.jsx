import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <h1 style={{ fontSize: 32, color: "#e30019" }}>Sản phẩm không tồn tại hoặc đã bị ẩn</h1>
      <p style={{ margin: "20px 0" }}>
        Sản phẩm bạn tìm kiếm không tồn tại, đã bị xóa hoặc đã bị ẩn khỏi hệ thống.<br />
        Vui lòng kiểm tra lại.
      </p>
      <Link href="/" style={{ color: "#fff", background: "#e30019", padding: "10px 24px", borderRadius: 6, textDecoration: "none" }}>
        Quay lại trang chủ
      </Link>
    </div>
  );
}
