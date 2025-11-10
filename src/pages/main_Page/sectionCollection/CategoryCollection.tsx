// app/(components)/CategoryCollection.tsx
"use client";

import Link from 'next/link';
import React from 'react';
import ContainerFluid from '../ContainerFluid/container-fluid.jsx';
import styles from './SectionCollection.module.scss';

export default function CategoryCollection() {
    return (
        <ContainerFluid>
            <section className={styles['section-collection']}>
                <h2 className={styles['section-collection__catalog']}>Danh mục sản phẩm</h2>
                <div className={styles['collection-grid']}>
                    <div className={styles['item-icon']}>
                        <Link href="/search?q=Laptop">
                            <img src="/images/product-catalog/laptop_catalog.jpg" alt="Laptop" />
                            <p>Laptop</p>
                        </Link>
                    </div>

                    <div className={styles['item-icon']}>
                        <Link href="/search?q=pc">
                            <img src="/images/product-catalog/pc_catalog.jpg" alt="PC" />
                            <p>PC</p>
                        </Link>
                    </div>

                    <div className={styles['item-icon']}>
                        <Link href="/search?q=nàm hình">
                            <img src="/images/product-catalog/man_hinh_catalog.jpg" alt="Màn hình" />
                            <p>Màn hình</p>
                        </Link>
                    </div>

                    <div className={styles['item-icon']}>
                        <Link href="/search?q=bàn phím">
                            <img src="/images/product-catalog/ban_phim_catalog.jpg" alt="Bàn phím" />
                            <p>Bàn phím</p>
                        </Link>
                    </div>

                    <div className={styles['item-icon']}>
                        <Link href="/search?q=chuột">
                            <img src="/images/product-catalog/chuot_catalog.jpg" alt="Chuột" />
                            <p>Chuột</p>
                        </Link>
                    </div>
                </div>
            </section>
        </ContainerFluid>
    );
}