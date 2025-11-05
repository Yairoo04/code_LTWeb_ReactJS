'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Product as BackendProduct } from '@/lib/product';
import styles from './SearchBox.module.scss';
import { useRouter } from 'next/navigation';

type FrontendProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string | null;
  stock: number;
  image_url: string;
  created_at: string;
};

const API_URL = 'http://localhost:4000/api/products/search'; // Sử dụng URL đầy đủ của backend và route đúng

const mapToFrontendProduct = (product: BackendProduct): FrontendProduct => ({
  id: product.ProductId,
  name: product.Name,
  description: product.Description,
  price: product.Price,
  category: (product as any).CategoryName || null, // Sử dụng CategoryName từ response
  stock: product.Stock,
  image_url: product.ImageUrl,
  created_at: product.CreatedAt,
});

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchProducts(query.trim());
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProducts = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: searchTerm,
          page: 1,
          pageSize: 6, // Chỉ lấy 6 cho gợi ý, giả sử backend hỗ trợ; nếu không, loại bỏ và slice results
        },
      });

      if (response.data.success) {
        const mapped = response.data.data.map(mapToFrontendProduct);
        setResults(mapped);
        setShowDropdown(true);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const handleSelectProduct = (product: FrontendProduct) => {
    setQuery(product.name);
    setShowDropdown(false);
    router.push(`/san-pham/${product.id}`);
  };

  return (
    <div className={styles['search-box']} ref={searchRef}>
      <div className={styles['search-input-wrapper']}>
        <input
          type="text"
          className={styles['search-input']}
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        {query && (
          <button className={styles['clear-btn']} onClick={handleClear} aria-label="Xóa tìm kiếm">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        <button
          className={styles['search-btn']}
          onClick={() => query && router.push(`/search?q=${encodeURIComponent(query)}`)}
          aria-label="Tìm kiếm"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {showDropdown && (
        <div className={styles['search-dropdown']}>
          {loading ? (
            // SKELETON: 6 dòng (sử dụng pure CSS thay vì thư viện)
            <div className={styles['results-list']}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles['skeleton-item']}>
                  <div className={styles['skeleton-image']} />
                  <div className={styles['skeleton-text']}>
                    <div className={`${styles['skeleton-line']} ${styles.short}`} />
                    <div className={`${styles['skeleton-line']} ${styles.long}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <ul className={styles['results-list']}>
              {results.map((product) => (
                <li
                  key={product.id}
                  className={styles['result-item']}
                  onClick={() => handleSelectProduct(product)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={product.image_url || '/images/placeholder.jpg'}
                    alt={product.name}
                    className={styles['result-image']}
                    loading="lazy"
                  />
                  <div className={styles['result-info']}>
                    <p className={styles['result-name']}>{product.name}</p>
                    <p className={styles['result-price']}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className={styles['no-results']}>Không tìm thấy sản phẩm</div>
          ) : null}
        </div>
      )}
    </div>
  );
}