"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import ContainerFluid from './container-fluid.jsx';
import './main_Page.module.scss';

export default function MenuList() {
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'laptop',
      title: 'Laptop',
      icon: 'bx-laptop',
      columns: [
        {
          title: 'Thương hiệu',
          links: [
            { href: '/laptops/apple', text: 'Apple (Macbook)' },
            { href: '/laptops/acer', text: 'Acer' },
            { href: '/laptops/asus', text: 'ASUS' },
            { href: '/laptops/dell', text: 'Dell' },
            { href: '/laptops/hp', text: 'HP' },
            { href: '/laptops/lenovo', text: 'Lenovo' },
            { href: '/laptops/msi', text: 'MSI' },
          ],
        },
        {
          title: 'Nhu cầu',
          links: [
            { href: '/laptops/gaming', text: 'Laptop Gaming' },
            { href: '/laptops/ai', text: 'Laptop AI' },
            { href: '/laptops/graphic', text: 'Laptop Đồ họa' },
            { href: '/laptops/student', text: 'Laptop Sinh viên' },
            { href: '/laptops/office', text: 'Laptop Văn phòng' },
          ],
        },
        {
          title: 'Cấu hình',
          links: [
            { href: '/laptops/i5', text: 'Laptop i5' },
            { href: '/laptops/i7', text: 'Laptop i7' },
            { href: '/laptops/i9', text: 'Laptop i9' },
            { href: '/laptops/ryzen5', text: 'Laptop Ryzen 5' },
            { href: '/laptops/ryzen7', text: 'Laptop Ryzen 7' },
          ],
        },
      ],
    },
    {
      id: 'laptop-gaming',
      title: 'Laptop Gaming',
      icon: 'bx-laptop',
      columns: [
        {
          title: 'Thương hiệu',
          links: [
            { href: '/gaming-laptops/acer', text: 'ACER / PREDATOR' },
            { href: '/gaming-laptops/asus', text: 'ASUS / ROG' },
            { href: '/gaming-laptops/msi', text: 'MSI' },
            { href: '/gaming-laptops/lenovo', text: 'LENOVO' },
            { href: '/gaming-laptops/dell', text: 'DELL' },
            { href: '/gaming-laptops/gigabyte', text: 'GIGABYTE / AORUS' },
            { href: '/gaming-laptops/hp', text: 'HP' },
          ],
        },
        {
          title: 'Giá bán',
          links: [
            { href: '/gaming-laptops/under-20m', text: 'Dưới 20 triệu' },
            { href: '/gaming-laptops/20-25m', text: 'Từ 20 đến 25 triệu' },
            { href: '/gaming-laptops/25-30m', text: 'Từ 25 đến 30 triệu' },
            { href: '/gaming-laptops/over-30m', text: 'Trên 30 triệu' },
            { href: '/gaming-laptops/rtx50', text: 'Gaming RTX 50 Series' },
          ],
        },
        {
          title: 'ACER | PREDATOR',
          links: [
            { href: '/gaming-laptops/acer/nitro', text: 'Nitro Series' },
            { href: '/gaming-laptops/acer/aspire', text: 'Aspire Series' },
            { href: '/gaming-laptops/acer/predator', text: 'Predator Series' },
            { href: '/gaming-laptops/acer/rtx50', text: 'ACER RTX 50 Series' },
          ],
        },
        {
          title: 'ASUS | ROG Gaming',
          links: [
            { href: '/gaming-laptops/asus/rog', text: 'ROG Series' },
            { href: '/gaming-laptops/asus/tuf', text: 'TUF Series' },
            { href: '/gaming-laptops/asus/zephyrus', text: 'Zephyrus Series' },
            { href: '/gaming-laptops/asus/rtx50', text: 'ASUS RTX 50 Series' },
          ],
        },
        {
          title: 'MSI Gaming',
          links: [
            { href: '/gaming-laptops/msi/titan', text: 'Titan GT Series' },
            { href: '/gaming-laptops/msi/stealth', text: 'Stealth GS Series' },
            { href: '/gaming-laptops/msi/raider', text: 'Raider GE Series' },
            { href: '/gaming-laptops/msi/vector', text: 'Vector GP Series' },
            { href: '/gaming-laptops/msi/crosshair', text: 'Crosshair / Pulse GL Series' },
            { href: '/gaming-laptops/msi/sword', text: 'Sword / Katana GF66 Series' },
            { href: '/gaming-laptops/msi/cyborg', text: 'Cyborg / Thin GF Series' },
            { href: '/gaming-laptops/msi/rtx50', text: 'MSI RTX 50 Series' },
          ],
        },
        {
          title: 'LENOVO Gaming',
          links: [
            { href: '/gaming-laptops/lenovo/legion', text: 'Legion Gaming' },
            { href: '/gaming-laptops/lenovo/loq', text: 'LOQ Series' },
            { href: '/gaming-laptops/lenovo/rtx50', text: 'RTX 50 Series' },
          ],
        },
        {
          title: 'Dell Gaming',
          links: [
            { href: '/gaming-laptops/dell/g-series', text: 'Dell Gaming G Series' },
            { href: '/gaming-laptops/dell/alienware', text: 'Alienware Series' },
          ],
        },
        {
          title: 'HP Gaming',
          links: [
            { href: '/gaming-laptops/hp/victus', text: 'HP Victus' },
            { href: '/gaming-laptops/hp/omen', text: 'HP Omen' },
            { href: '/gaming-laptops/hp/rtx50', text: 'HP RTX 50 Series' },
          ],
        },
        {
          title: 'Cấu hình',
          links: [
            { href: '/gaming-laptops/rtx50', text: 'RTX 50 Series' },
            { href: '/gaming-laptops/cpu-ultra', text: 'CPU Core Ultra' },
            { href: '/gaming-laptops/cpu-amd', text: 'CPU AMD' },
          ],
        },
        {
          title: 'Linh - Phụ kiện Laptop',
          links: [
            { href: '/accessories/ram', text: 'Ram laptop' },
            { href: '/accessories/ssd', text: 'SSD laptop' },
            { href: '/accessories/hdd', text: 'Ổ cứng di động' },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    document.querySelectorAll(".megamenu-nav-main li").forEach((item) => {
      const link = item.querySelector("a");
      if (link) {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        item.classList.toggle("active", pathname === linkPath);
      }
    });
  }, [pathname]);

  return (
    <ContainerFluid>
      <div className="megamenu-nav">
        <ul className="megamenu-nav-main">
          {menuItems.map((item) => (
            <li key={item.id} className={`megamenu-nav-${item.id}`}>
              <i className={`bx ${item.icon}`}></i>
              <Link href={`/${item.id}`}>
                <span>{item.title}</span>
              </Link>
              <i className="bx bx-chevron-right"></i>
              <div className={`megamenu-content-${item.id}`}>
                {item.columns.map((column, index) => (
                  <div key={index} className="megamenu-column">
                    <h4>{column.title}</h4>
                    {column.links.map((link) => (
                      <Link key={link.href} href={link.href}>
                        {link.text}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ContainerFluid>
  );
}