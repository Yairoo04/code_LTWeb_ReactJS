import React from "react";
import "./MegaMenu.module.scss"; // Updated to reference the optimized CSS

const MegaMenuColumn = ({ title, items }) => (
    <div className="megamenu-column">
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
            title="PC theo CPU Intel"
            items={[
                { href: "#", text: "PC Ultra 7" },
                { href: "#", text: "PC Ultra 9" },
            ]}
        />
        <MegaMenuColumn
            title="PC theo CPU AMD"
            items={[
                { href: "#", text: "PC AMD R3" },
                { href: "#", text: "PC AMD R5" },
                { href: "#", text: "PC AMD R7" },
                { href: "#", text: "PC AMD R9" },
            ]}
        />
        <MegaMenuColumn
            title="PC Văn phòng"
            items={[
                { href: "#", text: "Homework Athlon - Giá chỉ 3.990k" },
                { href: "#", text: "Homework R3 - Giá chỉ 5,690k" },
                { href: "#", text: "Homework R5 - Giá chỉ 5,690k" },
                { href: "#", text: "Homework I5 - Giá chỉ 5,690k" },
            ]}
        />
        <MegaMenuColumn
            title="Phần mềm bản quyền"
            items={[
                { href: "#", text: "Window bản quyền - Chỉ từ 2.990k" },
                { href: "#", text: "Office 365 bản quyền - Chỉ từ 990k" },
            ]}
        />
    </>
);

const MegaMenu = () => {
    const menuItems = [
        {
            icon: "bx bx-laptop",
            title: "Laptop",
            className: "megamenu-nav-1",
            content: (
                <>
                    <MegaMenuColumn
                        title="Thương hiệu"
                        items={[
                            { href: "#", text: "Apple (Macbook)" },
                            { href: "#", text: "Acer" },
                            { href: "#", text: "ASUS" },
                            { href: "#", text: "Dell" },
                            { href: "#", text: "HP" },
                            { href: "#", text: "Lenovo" },
                            { href: "#", text: "MSI" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="Nhu cầu"
                        items={[
                            { href: "#", text: "Laptop Gaming" },
                            { href: "#", text: "Laptop AI" },
                            { href: "#", text: "Laptop Đồ họa" },
                            { href: "#", text: "Laptop Sinh viên" },
                            { href: "#", text: "Laptop Văn phòng" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="Cấu hình"
                        items={[
                            { href: "#", text: "Laptop i5" },
                            { href: "#", text: "Laptop i7" },
                            { href: "#", text: "Laptop i9" },
                            { href: "#", text: "Laptop Ryzen 5" },
                            { href: "#", text: "Laptop Ryzen 7" },
                        ]}
                    />
                </>
            ),
        },
        {
            icon: "bx bx-laptop",
            title: "Laptop Gaming",
            className: "megamenu-nav-2",
            content: (
                <>
                    <MegaMenuColumn
                        title="Thương hiệu"
                        items={[
                            { href: "#", text: "ACER / PREDATOR" },
                            { href: "#", text: "ASUS / ROG" },
                            { href: "#", text: "MSI" },
                            { href: "#", text: "LENOVO" },
                            { href: "#", text: "DELL" },
                            { href: "#", text: "GIGABYTE / AORUS" },
                            { href: "#", text: "HP" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="Giá bán"
                        items={[
                            { href: "#", text: "Dưới 20 triệu" },
                            { href: "#", text: "Từ 20 đến 25 triệu" },
                            { href: "#", text: "Từ 25 đến 30 triệu" },
                            { href: "#", text: "Trên 30 triệu" },
                            { href: "#", text: "Gaming RTX 50 Series" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="ACER | PREDATOR"
                        items={[
                            { href: "#", text: "Nitro Series" },
                            { href: "#", text: "Aspire Series" },
                            { href: "#", text: "Predator Series" },
                            { href: "#", text: "ACER RTX 50 Series" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="ASUS | ROG Gaming"
                        items={[
                            { href: "#", text: "ROG Series" },
                            { href: "#", text: "TUF Series" },
                            { href: "#", text: "Zephyrus Series" },
                            { href: "#", text: "ASUS RTX 50 Series" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="MSI Gaming"
                        items={[
                            { href: "#", text: "Titan GT Series" },
                            { href: "#", text: "Stealth GS Series" },
                            { href: "#", text: "Raider GE Series" },
                            { href: "#", text: "Vector GP Series" },
                            { href: "#", text: "Crosshair / Pulse GL Series" },
                            { href: "#", text: "Sword / Katana GF66 Series" },
                            { href: "#", text: "Cyborg / Thin GF Series" },
                            { href: "#", text: "MSI RTX 50 Series" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="LENOVO Gaming"
                        items={[
                            { href: "#", text: "Legion Gaming" },
                            { href: "#", text: "LOQ Series" },
                            { href: "#", text: "RTX 50 Series" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="Dell Gaming"
                        items={[
                            { href: "#", text: "Dell Gaming G Series" },
                            { href: "#", text: "Alienware Series" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="HP Gaming"
                        items={[
                            { href: "#", text: "HP Victus" },
                            { href: "#", text: "HP Omen" },
                            { href: "#", text: "HP RTX 50 Series" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="Cấu hình"
                        items={[
                            { href: "#", text: "RTX 50 Series" },
                            { href: "#", text: "CPU Core Ultra" },
                            { href: "#", text: "CPU AMD" },
                        ]}
                    />
                    <MegaMenuColumn
                        title="Linh - Phụ kiện Laptop"
                        items={[
                            { href: "#", text: "Ram laptop" },
                            { href: "#", text: "SSD laptop" },
                            { href: "#", text: "Ổ cứng di động" },
                        ]}
                    />
                </>
            ),
        },
        {
            icon: "bx bx-desktop",
            title: "PC GTN",
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
                            <div className={`megamenu-content-${index + 1}`}>
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