"use client";

import styles from './he-thong-cua-hang-gtn.module.scss';
import common from '@/styles/common.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faArrowDownWideShort, faSortDown } from "@fortawesome/free-solid-svg-icons";
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';
import ContainerFluid from '../../pages/main_Page/ContainerFluid/container-fluid';
import React from 'react';

const Showroom = () => {
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
                <MenuListShowroom active="/he-thong-cua-hang-gtn" />

                <div className={styles.content}>
                    <div className={styles.pageHeading}>
                        <h1>Hệ thống cửa hàng GTN</h1>
                    </div>

                    <div className={styles.pageWrapper}>


                        <div className={styles.gioMuaCua}>
                            <p style={{ color: 'red' }}>➜</p>
                            <p>Giờ mở cửa:</p>
                            <p style={{ fontWeight: 'bolder' }}>08:00 - 21:00</p>
                        </div>

                        <div className={styles.call}>
                            <a href="tel:19005301">
                                <div className={styles.showroomHotlineTextHeader}>
                                    <span>📞 GỌI NGAY: 1900.5301</span>
                                </div>
                            </a>
                        </div>

                        <h3 className={styles.sectionTitle}>CỬA HÀNG TẠI TP.HỒ CHÍ MINH</h3>
                        <div className={styles.storeGrid}>
                            <div className={styles.storeCard}>
                                <h4>📍 TÂN BÌNH - HOÀNG HOA THÁM</h4>
                                <p>
                                    <b>Địa chỉ:</b> 7B-80-82 Hoàng Hoa Thám, Phường Bảy Hiền, TP.HCM
                                </p>
                                <p>
                                    <b>Giờ làm việc:</b> 8:00 - 21:00
                                </p>
                                <a href="https://maps.google.com/?q=7B-80-82+Hoàng+Hoa+Thám,+Phường+Bảy+Hiền,+TP.HCM" className={styles.btnDirection}>
                                    <span className={styles.stDirectionText}>📌 Chỉ đường</span>
                                </a>
                            </div>

                            <div className={styles.storeCard}>
                                <h4>📍 TP THỦ ĐỨC - KHA VẠN CÂN</h4>
                                <p>
                                    <b>Địa chỉ:</b> 905 Phường Linh Tây, TP.HCM
                                </p>
                                <p>
                                    <b>Giờ làm việc:</b> 8:00 - 21:00
                                </p>
                                <a href="https://maps.google.com/?q=905+Phường+Linh+Tây,+TP.HCM" className={styles.btnDirection}>
                                    <span className={styles.stDirectionText}>📌 Chỉ đường</span>
                                </a>
                            </div>

                            <div className={styles.storeCard}>
                                <h4>📍 QUẬN 5 - TRẦN HƯNG ĐẠO</h4>
                                <p>
                                    <b>Địa chỉ:</b> 1081-1083 Trần Hưng Đạo, Phường An Đông, TP.HCM
                                </p>
                                <p>
                                    <b>Giờ làm việc:</b> 8:00 - 21:00
                                </p>
                                <a href="https://maps.google.com/?q=1081-1083+Trần+Hưng+Đạo,+Phường+An+Đông,+TP.HCM" className={styles.btnDirection}>
                                    <span className={styles.stDirectionText}>📌 Chỉ đường</span>
                                </a>
                            </div>

                            <div className={styles.storeCard}>
                                <h4>📍 BÌNH THẠNH - NGUYỄN CỬU VÂN</h4>
                                <p>
                                    <b>Địa chỉ:</b> 63 Nguyễn Cửu Vân, Phường Gia Định, TP.HCM
                                </p>
                                <p>
                                    <b>Giờ làm việc:</b> 8:00 - 21:00
                                </p>
                                <a href="https://maps.google.com/?q=63+Nguyễn+Cửu+Vân,+Phường+Gia+Định,+TP.HCM" className={styles.btnDirection}>
                                    <span className={styles.stDirectionText}>📌 Chỉ đường</span>
                                </a>
                            </div>
                        </div>

                        {/* Hà Nội stores */}
                        <h3 className={styles.sectionTitle}>CỬA HÀNG TẠI HÀ NỘI</h3>
                        <div className={styles.storeGrid}>
                            <div className={styles.storeCard}>
                                <h4>📍 ĐỐNG ĐA - THÁI HÀ</h4>
                                <p>
                                    <b>Địa chỉ:</b> 162-164 Thái Hà, Phường Đống Đa, Hà Nội
                                </p>
                                <p>
                                    <b>Giờ làm việc:</b> 8:00 - 21:00
                                </p>
                                <a href="https://maps.google.com/?q=162-164+Thái+Hà,+Phường+Đống+Đa,+Hà+Nội" className={styles.btnDirection}>
                                    <span className={styles.stDirectionText}>📌 Chỉ đường</span>
                                </a>
                            </div>
                        </div>

                        {/* Liên hệ */}
                        <div className={styles.contact}>
                            <div className={styles.contactHeading}>
                                <p>📞 Liên hệ với chúng tôi</p>
                            </div>
                            <div className={styles.contactPhone}>
                                <a href="tel:19005301">
                                    <div className={styles.showroomHotlineTextFooter}>
                                        <span>HOTLINE: 1900.5301</span>
                                    </div>
                                </a>
                            </div>
                            <div className={styles.emailWebsite}>
                                <div className={styles.contactEmail}>
                                    Email: <a href="mailto:cskh@gtn.com">cskh@gtn.com</a> | Website:{' '}
                                    <a href="https://gtn.com" target="_blank" rel="noreferrer">
                                        www.gtn.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Showroom;