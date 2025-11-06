import styles from './tra-cuu-bao-hanh.module.scss';
import Link from "next/link";
import { useState } from "react";
import React from 'react';
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faArrowDownWideShort, faSortDown } from "@fortawesome/free-solid-svg-icons";
import common from '@/styles/common.module.scss';
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';

const TraCuuBaoHanh = () => {
  const [activeTab, setActiveTab] = useState("content-a");

  return (
    <>
      <div className={common.breadcrumbWrap}>
        <ContainerFluid>
          <div className={common.breadcrumbList}>
            <ol className={common.breadcrumbArrow}>
              <FontAwesomeIcon icon={faHouse} className={common.icon} />
              <li><a href="/"> Trang chủ</a></li>
              <li><strong>Tất cả sản phẩm</strong></li>
            </ol>
          </div>
        </ContainerFluid>
      </div>
      <div className={common.showroomSystemContainer}>
        <MenuListShowroom active="/tra-cuu-bao-hanh" />

        <div className={styles.content}>
          <div className={styles.warrantyContent}>
            <h1 className={styles.warrantyLookupTitle}>Tra cứu bảo hành</h1>

            {/* Tabs chọn */}
            <div className={styles.tabSelector}>
              <div
                className={`${styles.tabOption} ${activeTab === "content-a" ? styles.active : ""}`}
                onClick={() => setActiveTab("content-a")}
              >
                Tra cứu phiếu bảo hành
              </div>
              <div
                className={`${styles.tabOption} ${activeTab === "content-b" ? styles.active : ""}`}
                onClick={() => setActiveTab("content-b")}
              >
                Tra cứu IMEI
              </div>
            </div>

            {/* Nội dung theo tab */}
            <div className={styles.tabContentArea}>
              {activeTab === "content-a" && (
                <div className={`${styles.tabPanel} ${styles.active}`}>
                  <p>
                    Quý khách vui lòng nhập cả 2 trường thông tin (bắt buộc) để tra
                    cứu trạng thái của phiếu bảo hành.
                  </p>
                  <div className={styles.inputGroup}>
                    <input placeholder="Số điện thoại" type="text" />
                    <input placeholder="Mã phiếu bảo hành" type="text" />
                    <button className={styles.searchButton}>Tra cứu</button>
                  </div>
                </div>
              )}

              {activeTab === "content-b" && (
                <div className={`${styles.tabPanel} ${styles.active}`}>
                  <input
                    placeholder="Mã IMEI/ Serial Number"
                    type="text"
                    name="imei"
                    required
                  />
                  <br />
                  <br />

                  {/* Google reCAPTCHA */}
                  <div
                    className="g-recaptcha"
                    data-sitekey="6Ld9H8QrAAAAAHtMEXKaJjQ5f7zriolvQd207VMq"
                  ></div>
                  <br />
                  <button type="submit" className={styles.searchButton}>Tra cứu</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TraCuuBaoHanh;