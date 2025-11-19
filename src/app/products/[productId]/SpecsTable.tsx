// app/products/[productId]/SpecsTable.tsx
'use client';

import { useState } from 'react';
import styles from './ProductDetail.module.scss'; // Reuse the same styles or create new if needed

type Spec = {
  SpecName: string;
  SpecValue: string;
  Warranty: string;
};

export default function SpecsTable({ specs }: { specs: Spec[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.specsContainer}>
      <div
        className={styles.tableWrapper}
        style={{
          maxHeight: expanded ? 'none' : '200px', // Adjust height to show initial rows, e.g., 200px for ~2-3 rows
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <table>
          <thead>
            <tr>
              <th>Linh kiện</th>
              <th>Chi tiết</th>
              <th>Bảo hành</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, index) => (
              <tr key={index}>
                <td>{spec.SpecName}</td>
                <td>{spec.SpecValue}</td>
                <td>{spec.Warranty}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!expanded && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px', // Gradient height
              background: 'linear-gradient(to bottom, transparent, white)', // Fade to white or match background
            }}
          />
        )}
      </div>
      {!expanded && (
        <button
          className={styles.readMoreButton}
          onClick={() => setExpanded(true)}
        >
          Đọc tiếp bài viết
          <svg
            width="12"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: '8px', verticalAlign: 'middle' }}
          >
            <path
              d="M6.5 2.5L4 5.5L1.5 2.5"
              stroke="#1982F9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {expanded && (
        <button
          className={styles.readMoreButton}
          onClick={() => setExpanded(false)}
        >
          Thu gọn bài viết
          <svg
            width="12"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: '8px', verticalAlign: 'middle' }}
          >
            <path
              d="M1.5 5.5L4 2.5L6.5 5.5"
              stroke="#1982F9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}