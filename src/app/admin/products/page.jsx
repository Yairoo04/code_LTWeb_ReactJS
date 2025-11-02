"use client";
import { useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState([
    { id: 1, name: "Áo thun GTN", price: 150000, category: "Thời trang" },
    { id: 2, name: "Giày thể thao GTN", price: 320000, category: "Giày dép" },
  ]);

  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Quản lý sản phẩm</h1>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>+ Thêm sản phẩm</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên SP</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price.toLocaleString()}đ</td>
              <td>{p.category}</td>
              <td>
                <button>Sửa</button>
                <button>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
