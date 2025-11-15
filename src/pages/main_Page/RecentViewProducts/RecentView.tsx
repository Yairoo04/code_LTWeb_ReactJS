'use client';

import React from 'react';
import RecentViewProductSlider from './RecentViewProductSlider';
import ContainerFluid from '../ContainerFluid/container-fluid';
import styles from './RecentView.module.scss';
import { useRecentView } from './RecentViewContext';

export default function RecentView() {
  const { products, loading } = useRecentView();

  // Ẩn nếu chưa có sản phẩm
  if (loading || products.length === 0) {
    return null;
  }

  return (
    <ContainerFluid>
      <section className={styles.recentView}>
        <RecentViewProductSlider products={products} itemsPerPage={4} />
      </section>
    </ContainerFluid>
  );
}