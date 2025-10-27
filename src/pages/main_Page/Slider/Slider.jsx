"use client";
import { useState, useEffect } from 'react';
// import './Slider.module.scss';
import '../../../styles/globals.scss';
import MegaMenu from '../MegaMenu/MegaMenu';

export default function Slider() {
  const images = [
    '/images/slider-img/slider-banner-1.webp',
    '/images/slider-img/slider-banner-2.webp',
    '/images/slider-img/slider-banner-3.webp',
  ];
  const [index, setIndex] = useState(0);

  const changeSlide = (i) => {
    setIndex(i);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="container" style={{ backgroundImage: `url(${images[index]})` }}>
      <button className="prev" onClick={() => setIndex((index - 1 + images.length) % images.length)}>
        ❮
      </button>
      <button className="next" onClick={() => setIndex((index + 1) % images.length)}>
        ❯
      </button>
      <div className="container-dots">
        {images.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => changeSlide(i)}
          ></div>
        ))}
      </div>
          <MegaMenu />
    </div>
  );
}