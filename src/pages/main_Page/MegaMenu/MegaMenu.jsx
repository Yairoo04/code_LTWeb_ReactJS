// Component MegaMenu (giữ nguyên href với /search, không replace nữa)

import React from "react";
import { megaMenuData } from "../../../lib/data"; // Import từ data.js (thay đường dẫn nếu cần)
import styles from "./MegaMenu.module.scss";

const MegaMenuColumn = ({ subItem }) => (
  <div className={styles["sub-megamenu-item"]}>
    <a className={styles["sub-megamenu-item-name"]} href={subItem.nameHref || "/search?q=laptop"}>
      {subItem.name}
    </a>
    {subItem.filters.map((filter, index) => (
      <a key={index} className={styles["sub-megamenu-item-filter"]} href={filter.href}>
        {filter.text}
      </a>
    ))}
  </div>
);

const MegaMenu = () => {
  return (
    <>
      <div className={styles["megamenu-nav-container"]}>
        <nav className={styles["megamenu-nav"]}>
          <ul className={styles["megamenu-nav-main"]}>
            {megaMenuData.map((item, index) => (
              <li key={index} className={`${styles["megamenu-item"]} ${styles[`mg-${index + 1}`]}`}>
                <a className={styles["megamenu-link"]} href={item.href}>
                  <span
                    className={styles["megamenu-icon"]}
                    data-hover={item.title.toLowerCase().replace(/ /g, "-")}
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  ></span>
                  <span className={styles["megamenu-name"]}>{item.title}</span>
                  <span className={styles["megamenu-ic-right"]}>
                    <svg viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 1.5L4.5 4L1.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
                <div className={`${styles["megamenu-content"]} ${styles["absolute-center"]} ${styles["level0"]} ${styles["xlab_grid_container"]}`}>
                  <div className={`${styles.column} ${styles.xlab_column_5_5}`}>
                    {item.subItems.map((subItem, subIndex) => (
                      <MegaMenuColumn key={subIndex} subItem={subItem} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles["main-banner"]}>
        <div className={styles["small-banner"]}>
          <img src="./images/right-small-banner1.gif" alt="Banner 1" />
        </div>
        <div className={styles["small-banner"]}>
          <img src="./images/right-small-banner1.gif" alt="Banner 2" />
        </div>
      </div>
    </>
  );
};

export default MegaMenu;