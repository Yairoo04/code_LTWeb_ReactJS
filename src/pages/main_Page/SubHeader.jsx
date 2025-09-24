"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ContainerFluid from './container-fluid.jsx';

export default function SubHeader() {
  const router = useRouter();

  useEffect(() => {
    // Auto-active menu based on current path
    const currentPath = router.pathname;
    document.querySelectorAll('#menu-list-showroom li a').forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      link.parentElement.classList.remove('active');
      if (currentPath === linkPath) {
        link.parentElement.classList.add('active');
      }
    });
  }, [router.pathname]);

  return (
      <div className="sub-header">
        <ContainerFluid>
          <ul className="list-submenu" id="menu-list-showroom">
            <li><Link href="/build-pc">Build PC tặng màn 240Hz</Link></li>
            <li><Link href="/news">Tin công nghệ</Link></li>
            <li><Link href="/repair">Dịch vụ sửa chữa</Link></li>
            <li><Link href="/home-service">Dịch vụ kỹ thuật tại nhà</Link></li>
            <li><Link href="/trade-in">Thu cũ đổi mới</Link></li>
            <li><Link href="/warranty">Tra cứu bảo hành</Link></li>
          </ul>
        </ContainerFluid>
      </div>
  );
}