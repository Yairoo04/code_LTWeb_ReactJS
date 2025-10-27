import Link from 'next/link';
import React, { useState } from 'react';
import ContainerFluid from './ContainerFluid/container-fluid.jsx';
import { products, categories } from '../../lib/data.js';

export default function SectionCollection() {
  const itemsPerPage = 4;
  const totalSlides = Math.ceil(products.length / itemsPerPage);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      <ContainerFluid>
        <section className="section-collection" id="home-collection-1">
          <div className="section-heading">
            <div className="box-left">
              <div className="box-header">
                <h2 className="hTitle">PC bán chạy</h2>
              </div>
              <div className="box-subheader">
                <h3 className="shTitle">Trả góp 0%</h3>
              </div>
            </div>
            <div className="box-right">
              <div className="box-cate">
                <ul className="cate-list">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link href={category.href} title={category.title}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="box-link">
                <Link href="#" className="button-more">
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
          <div className="section-content">
            <div className="product-slider">
              <button className="product-slider-prev" onClick={handlePrev}>
                &#10094;
              </button>
              <div
                className="product-list"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.5s ease-in-out',
                }}
              >
                {products.map((product, index) => (
                  <div className="product-card" key={index}>
                    <img src={product.image} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p className="old-price">{product.oldPrice}</p>
                    <p className="new-price">{product.newPrice}</p>
                    <p className="status">{product.status}</p>
                  </div>
                ))}
              </div>
              <button className="product-slider-next" onClick={handleNext}>
                &#10095;
              </button>
              <div className="flash-sale-content-dots">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <span
                    key={index}
                    className={`flash-sale-content-dot ${index === currentSlide ? 'active' : ''
                      }`}
                    onClick={() => handleDotClick(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ContainerFluid>

      <ContainerFluid>
        <section className="section-collection">
          <h2>Bộ sưu tập</h2>
          <div className="collection-grid">
            <Link href="/laptops">
              <img src="/images/collection/sub-banner-1.png" alt="Laptops" />
              <p>Laptops</p>
            </Link>
            <Link href="/gaming">
              <img src="/images/collection/gaming.jpg" alt="Gaming" />
              <p>Gaming</p>
            </Link>
            <Link href="/accessories">
              <img src="/images/collection/accessories.jpg" alt="Accessories" />
              <p>Accessories</p>
            </Link>
          </div>
        </section>
      </ContainerFluid>
    </div>
  );
}