import React from "react";
import styles from "./MegaMenu.module.scss";

const MegaMenuColumn = ({ title, items }) => (
    <div className={styles["megamenu-column"]}>
        <h4>{title}</h4>
        {items.map((item, index) => (
            <a key={index} href={item.href}>
                {item.text}
            </a>
        ))}
    </div>
);

const CommonMegaMenuContent = () => (
    <>
        <MegaMenuColumn
            title="PC RTX 50 SERIES"
            items={[
                { href: "#", text: "PC RTX 5090" },
                { href: "#", text: "PC RTX 5080" },
                { href: "#", text: "PC RTX 5070Ti" },
                { href: "#", text: "PC RTX 5070" },
                { href: "#", text: "PC RTX 5060Ti" },
                { href: "#", text: "PC RTX 5060 (HOT)" },
            ]}
        />
        <MegaMenuColumn
            title="PC HOT CHIẾN HỎ"
            items={[
                { href: "#", text: "I5 - 5060 - chỉ từ 18tr" },
                { href: "#", text: "I5 - 4060 - 17TR" },
                { href: "#", text: "I5 - 3060 - 15TR" },
                { href: "#", text: "I3 - 3050 - 11TR" },
                { href: "#", text: "I3 - RX6500XT - 10TR" },
            ]}
        />
        <MegaMenuColumn
            title="PC khuyến mãi KHỦNG"
            items={[
                { href: "#", text: "BUILD PC TẶNG MÀN 240HZ" },
                { href: "#", text: "GVN x MSI - Tặng màn hình OLED" },
                { href: "#", text: "GVN x CORSAIR - Tặng tản nhiệt 5TR" },
                { href: "#", text: "GVN x ASUS - MAX SETTING" },
            ]}
        />
        <MegaMenuColumn
            title="PC theo cấu hình VGA"
            items={[
                { href: "#", text: "PC RTX 3050" },
                { href: "#", text: "PC RX6500XT" },
                { href: "#", text: "PC RTX 3060 (12GB)" },
                { href: "#", text: "PC RTX 4060" },
                { href: "#", text: "PC RTX 4070 Super" },
            ]}
        />
        <MegaMenuColumn
            title="A.I PC - GVN"
            items={[
                { href: "#", text: "PC GVN x ASUS - PBA" },
                { href: "#", text: "PC GVN x MSI" },
            ]}
        />
        <MegaMenuColumn
            title="PC theo CPU Intel"
            items={[
                { href: "#", text: "PC Core I3" },
                { href: "#", text: "PC Core I5" },
                { href: "#", text: "PC Core I7" },
                { href: "#", text: "PC Core I9" },
            ]}
        />
        <MegaMenuColumn
            title="PC theo CPU AMD"
            items={[
                { href: "#", text: "PC Ryzen 3" },
                { href: "#", text: "PC Ryzen 5" },
                { href: "#", text: "PC Ryzen 7" },
                { href: "#", text: "PC Ryzen 9" },
            ]}
        />
    </>
);

const MegaMenu = () => {
  const menuItems = [
    {
      icon: "bx bx-desktop",
      title: "PC Gaming",
      className: "megamenu-nav-1",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Laptop Gaming",
      className: "megamenu-nav-2",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Laptop Văn Phòng",
      className: "megamenu-nav-3",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Main, CPU, VGA",
      className: "megamenu-nav-4",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Case, Nguồn, Tản",
      className: "megamenu-nav-5",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Ổ cứng, RAM",
      className: "megamenu-nav-6",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Loa, Webcam",
      className: "megamenu-nav-7",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Màn hình",
      className: "megamenu-nav-8",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Bàn phím",
      className: "megamenu-nav-9",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Chuột GTN",
      className: "megamenu-nav-10",
      content: <CommonMegaMenuContent />,
    },
    {
      icon: "bx bx-desktop",
      title: "Tai nghe",
      className: "megamenu-nav-11",
      content: <CommonMegaMenuContent />,
    },
  ];

  return (
    <>
      <div className="megamenu-nav">
        <ul className="megamenu-nav-main">
          {menuItems.map((item, index) => (
            <li key={index} className={item.className}>
              <i className={item.icon}></i>
              <span>{item.title}</span>
              <i className="bx bx-chevron-right"></i>
              <div className={`megamenu-content megamenu-content-${index + 1}`}>
                {item.content}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-banner">
        <div className="small-banner">
          <img src="./images/right-small-banner1.gif" alt="Banner 1" />
        </div>
        <div className="small-banner">
          <img src="./images/right-small-banner1.gif" alt="Banner 2" />
        </div>
      </div>
    </>
  );
};

export default MegaMenu;