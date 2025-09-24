export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="info">
        <div className="name">{product.name}</div>
        <div className="old-price">{product.oldPrice}</div>
        <div className="new-price">{product.newPrice}</div>
        <div className="status">{product.status}</div>
      </div>
    </div>
  );
}