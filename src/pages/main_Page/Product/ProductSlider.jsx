"use client";

import { useState, useRef } from 'react';
import ProductCard from './ProductCard.jsx';

export default function ProductSlider({ products, showDotActive }) {
  const [productIndex, setProductIndex] = useState(0);
  const visibleProducts = 6;
  const productListRef = useRef(null);

  const updateProductSlide = () => {
    const cardWidth = productListRef.current.querySelector('.product-card').offsetWidth;
    productListRef.current.style.transform = `translateX(-${productIndex * cardWidth}px)`;
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
      setProductIndex(products.length - visibleProducts);
    }
    updateProductSlide();
  };

  return (
    <div className="product-slider">
      <button className="product-slider-prev" onClick={handlePrev}>❮</button>
      <div className="product-list" ref={productListRef}>
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <button className="product-slider-next" onClick={handleNext}>❯</button>

      {showDotActive && (
        <div class="flash-sale-content-dots">
          <span class="flash-sale-content-dot active"></span>
          <span class="flash-sale-content-dot"></span>
          <span class="flash-sale-content-dot"></span>
        </div>
      )}
    </div>
  );
}