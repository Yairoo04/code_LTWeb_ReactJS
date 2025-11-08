import React from 'react';
import Link from 'next/link';
import styles from './NotFound.module.scss';

// Small inline SVG gear to avoid external assets
const Gear = ({ size = 64, color = '#d1d5db', className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10.325 2.317a1 1 0 01.907-.067l1.21.5a1 1 0 00.93-.11l.99-.66a1 1 0 011.403.316l1 1.732a1 1 0 00.79.5l1.3.13a1 1 0 01.91 1.09l-.13 1.3a1 1 0 00.5.79l1.732 1a1 1 0 01.316 1.403l-.66.99a1 1 0 00-.11.93l.5 1.21a1 1 0 01-.067.907l-.72 1.248a1 1 0 01-.86.5l-1.3-.03a1 1 0 00-.84.41l-.79 1.03a1 1 0 01-1.49.09l-.92-.91a1 1 0 00-.88-.26l-1.28.24a1 1 0 01-.92-.38l-.83-1.08a1 1 0 00-.79-.39l-1.3.03a1 1 0 01-.86-.5l-.72-1.248a1 1 0 01-.067-.907l.5-1.21a1 1 0 00-.11-.93l-.66-.99a1 1 0 01.316-1.403l1.732-1a1 1 0 00.5-.79l-.13-1.3a1 1 0 01.91-1.09l1.3-.13a1 1 0 00.79-.5l1-1.732a1 1 0 01.403-.403zM12 9a3 3 0 100 6 3 3 0 000-6z"
      fill={color}
    />
  </svg>
);

const NotFound = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <span className={styles.pill} aria-label="Error">ERROR</span>
        <h1 className={styles.big404} aria-label="404">404</h1>
        <div className={styles.subtitle}>PAGE NOT FOUND</div>

        <div className={styles.gearsRow}>
          <Gear size={44} color="#e5e7eb" className={styles.gear} />
          <Gear size={56} color="#f59e0b" className={`${styles.gear} ${styles.gearFast}`} />
          <Gear size={40} color="#e5e7eb" className={`${styles.gear} ${styles.gearSlow}`} />
        </div>

        <Link href="/" className={styles.homeLink}>Go back Home</Link>
        <div className={styles.note}>The page you’re looking for doesn’t exist or has been moved.</div>
      </div>
    </div>
  );
};

export default NotFound;
