"use client";
import styles from "./LoadingSpinner.module.scss";

export default function LoadingSpinner({ message = "Loading...", size = 60, minHeight = 300, fullscreen = false }) {
  const wrapperClass = fullscreen ? styles.fullscreen : styles.wrapper;
  return (
    <div className={wrapperClass} style={{ minHeight: fullscreen ? undefined : minHeight }}>
      <div className={styles.spinner} style={{ width: size, height: size }} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
