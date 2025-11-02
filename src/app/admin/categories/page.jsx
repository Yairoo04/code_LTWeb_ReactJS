"use client";
import { useState } from "react";
import "../admin.scss";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Điện thoại" },
    { id: 2, name: "Laptop" },
  ]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategory }]);
    setNewCategory("");
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="admin-page">
      <h2>Quản lý danh mục</h2>
      <div className="add-section">
        <input
          type="text"
          value={newCategory}
          placeholder="Tên danh mục mới"
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory}>Thêm</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button onClick={() => deleteCategory(c.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
