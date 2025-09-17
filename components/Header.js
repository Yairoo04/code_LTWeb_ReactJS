import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPhone, faStore, faTruck, faShoppingCart, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import ContainerFluid from './container-fluid';

export default function Header() {
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
    <header className="main-header">
      <div className="list-banner">
        <ContainerFluid>
          <div className="top-banner">
            <img src="/image/top-banner.gif" alt="Top Banner" className="img-banner" />
          </div>
        </ContainerFluid>
      </div>

      <div className="main-header--top">
        <ContainerFluid>
          <div className="menu">
            <Link href="/">
              <img src="/image/logo.jpg" alt="GTN Logo" className="img-logo" />
            </Link>
            <div className="category">
              <FontAwesomeIcon icon={faBars} /> Danh mục
            </div>
            <div className="search-box">
              <input type="text" className="search" placeholder="Tìm kiếm sản phẩm..." />
              <button className="button-search">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div className="hotline">
              <FontAwesomeIcon icon={faPhone} />
              <div className="hotline-text">
                <span>Hotline</span>
                <span>1900.1000</span>
              </div>
            </div>
            <div className="showroom-system">
              <FontAwesomeIcon icon={faStore} />
              <div className="showroom-system-text">
                <span>Hệ thống</span>
                <span>Showroom</span>
              </div>
            </div>
            <div className="track-oder">
              <FontAwesomeIcon icon={faTruck} />
              <div className="track-oder-text">
                <span>Tra cứu</span>
                <span>đơn hàng</span>
              </div>
            </div>
            <div className="user-cart">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="quantity">0</span>
              <div className="user-cart-text">
                <span>Giỏ</span>
                <span>hàng</span>
              </div>
            </div>
            <div className="login">
              <FontAwesomeIcon icon={faUser} />
              <div className="login-text">
                <span>Đăng</span>
                <span>nhập</span>
              </div>
            </div>
          </div>
        </ContainerFluid>
      </div>

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
    </header>
  );
}