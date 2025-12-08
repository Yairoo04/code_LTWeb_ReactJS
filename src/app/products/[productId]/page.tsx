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
import ProductActions from './ProductActions';

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

type ProductType = 'pc' | 'laptop' | 'mouse' | 'keyboard' | 'monitor';

type ProductForType = {
  Name?: string;
  Description?: string | null;
  CategoryId?: number | null;  
};

const CATEGORY_TYPE_BY_ID: Record<number, ProductType> = {
  // 1: 'pc',
  // 2: 'laptop',
  // 3: 'mouse',
  // 4: 'keyboard',
  // 5: 'monitor',
};

function classifyProductType(product: ProductForType): ProductType | null {
  const name = (product.Name ?? '').toLowerCase();
  const desc = (product.Description ?? '').toLowerCase();

  if (product.CategoryId != null) {
    const t = CATEGORY_TYPE_BY_ID[product.CategoryId];
    if (t) return t;
  }

  if (name.includes('pc') || desc.includes('pc') || name.includes('desktop') || desc.includes('desktop')) {
    return 'pc';
  }

  if (name.includes('laptop') || desc.includes('laptop') || name.includes('notebook') || desc.includes('notebook')) {
    return 'laptop';
  }

  if (
    name.includes('chuột') || desc.includes('chuột') ||
    name.includes('chuot') || desc.includes('chuot') ||
    name.includes('mouse') || desc.includes('mouse')
  ) {
    return 'mouse';
  }

  if (
    name.includes('bàn phím') || desc.includes('bàn phím') ||
    name.includes('ban phim') || desc.includes('ban phim') ||
    name.includes('keyboard') || desc.includes('keyboard')
  ) {
    return 'keyboard';
  }

  if (
    name.includes('màn hình') || desc.includes('màn hình') ||
    name.includes('man hinh') || desc.includes('man hinh') ||
    name.includes('monitor') || desc.includes('monitor')
  ) {
    return 'monitor';
  }

  return null;
}

function getCollectionBreadcrumb(type: ProductType | null): { href: string; label: string } | null {
  switch (type) {
    case 'pc':
      return { href: '/collections/pc', label: 'PC' };
    case 'laptop':
      return { href: '/collections/laptop', label: 'Laptop' };
    case 'mouse':
      return { href: '/collections/chuot-may-tinh', label: 'Chuột' };
    case 'keyboard':
      return { href: '/collections/ban-phim-may-tinh', label: 'Bàn phím' };
    case 'monitor':
      return { href: '/collections/man-hinh', label: 'Màn hình' };
    default:
      return null;
  }
}

function getRelatedTitle(type: ProductType | null): string {
  switch (type) {
    case 'pc':
      return 'PC Gaming tương tự';
    case 'laptop':
      return 'Laptop tương tự';
    case 'mouse':
      return 'Chuột gaming hot';
    case 'keyboard':
      return 'Bàn phím cơ hot';
    case 'monitor':
      return 'Màn hình cao cấp';
    default:
      return 'Sản phẩm liên quan';
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

  const productType = classifyProductType(product);
  const collection = getCollectionBreadcrumb(productType);
  const relatedTitle = getRelatedTitle(productType);

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
                <li>
                  {collection ? (
                    <a href={collection.href}>{collection.label}</a>
                  ) : (
                    <a href="/products">Sản phẩm</a>
                  )}
                </li>
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

            <ProductActions product={product} />

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

        {/* Thông số kỹ thuật */}
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
          {productType && (
            <SectionCollection
              type={productType}
              title={relatedTitle}
              excludeProductId={productId}
            />
          )}
        </section>

        <ProductReviews productId={productId} />
      </main>

      <RecentView />
      <Footer />
    </>
  );
}
