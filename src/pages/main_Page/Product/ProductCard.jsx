export default function ProductCard({ product }) {
  if (!product) {
    return (
      <div className="product-card empty">
        <p>No product data</p>
      </div>
    );
  }

  return (
    <div className="product-card">
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name || "Unnamed product"}
      />
      <div className="info">
        <div className="name">{product.name || "Unknown"}</div>
        <div className="old-price">{product.oldPrice || ""}</div>
        <div className="new-price">{product.newPrice || ""}</div>
        <div className="status">{product.status || ""}</div>
      </div>
    </div>
  );
}
