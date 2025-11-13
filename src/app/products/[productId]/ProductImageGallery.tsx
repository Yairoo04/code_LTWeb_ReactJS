// app/products/[productId]/ProductImageGallery.tsx (Hoàn chỉnh: Không thay đổi lớn)
'use client';

import { useState } from 'react';
import styles from './ProductDetail.module.scss';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.productImages}>
        <img
          src="/images/products/keychron_k2.jpg"
          alt={productName}
          className={styles.mainImage}
        />
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className={styles.productImages}>
      {/* Ảnh chính */}
      <div className={styles.mainImageContainer}>
        <img
          src={currentImage}
          alt={`${productName} - Ảnh ${currentIndex + 1}`}
          className={styles.mainImage}
        />
        
        {/* Nút prev/next nếu có nhiều ảnh */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.imageNav} ${styles.imagePrev}`}
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <button
              className={`${styles.imageNav} ${styles.imageNext}`}
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              aria-label="Ảnh tiếp"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          {images.map((img, index) => (
            <button
              key={index}
              className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicator dots */}
      {images.length > 1 && (
        <div className={styles.dotsContainer}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Xem ảnh ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}