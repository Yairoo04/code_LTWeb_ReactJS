"use client";

import { useState, useRef } from "react";
import ProductCard from "./ProductCard.jsx";

export default function ProductSlider({ products = [], showDotActive }) {
  const [productIndex, setProductIndex] = useState(0);
  const visibleProducts = 6;
  const productListRef = useRef(null);

  const updateProductSlide = () => {
    if (!productListRef.current) return;
    const card = productListRef.current.querySelector(".product-card");
    if (!card) return;

    const cardWidth = card.offsetWidth;
    productListRef.current.style.transform = `translateX(-${
      productIndex * cardWidth
    }px)`;
  };

  const handleNext = () => {
    if (productIndex < products.length - visibleProducts) {
      setProductIndex(productIndex + visibleProducts);
    } else {
      setProductIndex(0);
    }
    updateProductSlide();
  };

  const handlePrev = () => {
    if (productIndex > 0) {
      setProductIndex(productIndex - visibleProducts);
    } else {
      setProductIndex(Math.max(products.length - visibleProducts, 0));
    }
    updateProductSlide();
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="product-slider-empty">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="product-slider">
      <button className="product-slider-prev" onClick={handlePrev}>
        ❮
      </button>
      <div className="product-list" ref={productListRef}>
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <button className="product-slider-next" onClick={handleNext}>
        ❯
      </button>

      {showDotActive && (
        <div className="flash-sale-content-dots">
          <span className="flash-sale-content-dot active"></span>
          <span className="flash-sale-content-dot"></span>
          <span className="flash-sale-content-dot"></span>
        </div>
      )}
    </div>
  );
}
