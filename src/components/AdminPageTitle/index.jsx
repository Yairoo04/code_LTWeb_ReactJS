import React from "react";
import styles from "./AdminPageTitle.module.scss";

export default function AdminPageTitle({ children }) {
  return (
    <div className={styles.titleWrapper}>
      <h1 className={styles.title}>{children}</h1>
    </div>
  );
}
