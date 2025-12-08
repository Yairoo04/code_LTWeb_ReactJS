// app/products/[productId]/page.tsx
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import styles from './ProductDetail.module.scss';

import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import RecentView from '@/pages/main_Page/RecentViewProducts/RecentView';
import SectionCollection from '@/pages/main_Page/sectionCollection/SectionCollection';
import ProductReviews from './ProductReviews';

import SpecsTable from './SpecsTable';
import ProductImageGallery from './ProductImageGallery';
import ProductActions from './ProductActions'; // ← Import component client mới tạo

async function fetchProduct(productId: string) {
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-backend.com' 
    : 'http://localhost:4000';

  const res = await fetch(`${apiUrl}/api/products?productId=${productId}&details=true`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    notFound();
  }
  const json = await res.json();
  if (!json.data?.product) notFound();
  return json.data;
}

function parseImages(imageUrl?: string): string[] {
  if (!imageUrl) return ['/images/placeholder.jpg'];
  try {
    const parsed = JSON.parse(imageUrl);
    return Array.isArray(parsed) ? parsed : [imageUrl];
  } catch {
    return imageUrl.split(',').map(s => s.trim()).filter(Boolean);
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const data = await fetchProduct(productId);
  const product = data.product;
  const specs = data.specs || [];
  const images = parseImages(product.ImageUrl);

  return (
    <>
      <Header />

      <main className={styles.productDetailPage}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbWrap}>
          <ContainerFluid>
            <div className={styles.breadcrumbList}>
              <ol className={styles.breadcrumbArrow}>
                <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/products">Sản phẩm</a></li>
                <li>{product.Name}</li>
              </ol>
            </div>
          </ContainerFluid>
        </div>

        {/* Product Header */}
        <section className={styles.productHeader}>
          <ProductImageGallery images={images} productName={product.Name} />

          <div className={styles.productInfo}>
            <h1>{product.Name}</h1>

            <div className={styles.price}>
              {product.DiscountPrice ? (
                <>
                  <span className={styles.discountPrice}>
                    {Number(product.DiscountPrice).toLocaleString()}đ
                  </span>
                  <del>{Number(product.Price).toLocaleString()}đ</del>
                </>
              ) : (
                <span className={styles.mainPrice}>
                  {Number(product.Price).toLocaleString()}đ
                </span>
              )}
            </div>

            {/* Nút hành động + Modal trả góp (đã tách riêng thành Client Component) */}
            <ProductActions product={product} />

            {/* Ưu đãi */}
            <div className={styles.promotions}>
              <h3>Ưu đãi đặc biệt</h3>
              <ul>
                <li>⭐ Giảm thêm tới 2.000.000đ khi mua kèm PC</li>
                <li>🎁 Tặng balo + chuột không dây trị giá 1.500.000đ</li>
                <li>💳 Trả góp 0% lãi suất qua thẻ tín dụng & HD Saison</li>
              </ul>
            </div>

            <div className={styles.showrooms}>
              <h3>Hệ thống showroom</h3>
              <ul>
                <li>78-80 Hoàng Hoa Thám, Tân Bình, TP.HCM</li>
                <li>280 An Dương Vương, Q.5, TP.HCM</li>
                <li>180 Nguyễn Thị Minh Khai, Q.3, TP.HCM</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Các phần còn lại giữ nguyên 100% */}
        <section className={styles.specs}>
          <h2>Thông số kỹ thuật</h2>
          {specs.length > 0 ? (
            <SpecsTable specs={specs} />
          ) : (
            <p>{product.Description || 'Đang cập nhật thông số chi tiết...'}</p>
          )}
        </section>

        <section className={styles.description}>
          <h2>Mô tả sản phẩm</h2>
          <div dangerouslySetInnerHTML={{ __html: product.Description || '' }} />
        </section>

        <section className={styles.related}>
          {product.Name.includes('PC') || product.Description?.includes('PC') ? (
            <SectionCollection type="pc" title="PC Gaming tương tự" excludeProductId={productId} />
          ) : product.Name.includes('Laptop') || product.Description?.includes('Laptop') ? (
            <SectionCollection type="laptop" title="Laptop tương tự" excludeProductId={productId} />
          ) : product.Name.includes('Chuột') ? (
            <SectionCollection type="mouse" title="Chuột gaming hot" excludeProductId={productId} />
          ) : product.Name.includes('Bàn phím') ? (
            <SectionCollection type="keyboard" title="Bàn phím cơ hot" excludeProductId={productId} />
          ) : product.Name.includes('Màn hình') ? (
            <SectionCollection type="monitor" title="Màn hình cao cấp" excludeProductId={productId} />
          ) : null}
        </section>

        <ProductReviews productId={productId} />
      </main>

      <RecentView />
      <Footer />
    </>
  );
}