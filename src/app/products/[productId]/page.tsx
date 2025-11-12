// app/products/[productId]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import styles from './ProductDetail.module.scss';
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import RecentView from '@/pages/main_Page/RecentViewProducts/RecentView';
import SectionCollection from '@/pages/main_Page/sectionCollection/SectionCollection';
import SpecsTable from './SpecsTable'; // Import the new client component
import ProductImageGallery from './ProductImageGallery'; // New component

// Function to fetch product data including specs
async function fetchProduct(productId: string) {
  const res = await fetch(`http://localhost:4000/api/products?productId=${productId}&details=true`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  const json = await res.json();
  const { data } = json;
  if (!data || !data.product) {
    notFound();
  }
  return data;
}

// Parse ImageUrl thành array
function parseImages(imageUrl: string): string[] {
  if (!imageUrl) return [];
  try {
    // Thử parse JSON array
    const parsed = JSON.parse(imageUrl);
    return Array.isArray(parsed) ? parsed : [imageUrl];
  } catch {
    // Nếu không phải JSON, tách bằng dấu phẩy
    return imageUrl.split(',').filter(Boolean);
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  const data = await fetchProduct(resolvedParams.productId);
  const product = data.product;
  const specs = data.specs || []; // Default to empty array if no specs
  const images = parseImages(product.ImageUrl); // Parse images from ImageUrl

  return (
    <>
      <Header />

      <main className={styles.productDetailPage}>
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
        {/* Breadcrumb - Placeholder */}

        {/* Product Header Section */}
        <section className={styles.productHeader}>
          <ProductImageGallery images={images} productName={product.Name} />
          <div className={styles.productInfo}>
            <h1>{product.Name}</h1>
            <div className={styles.price}>
              {product.DiscountPrice ? (
                <>
                  <span>{product.DiscountPrice.toLocaleString()}đ</span>
                  <del>{product.Price.toLocaleString()}đ</del>
                </>
              ) : (
                <span>{product.Price.toLocaleString()}đ</span>
              )}
            </div>
            <div className={styles.actions}>
              <button>MUA NGAY</button>
              <button>TRẢ GÓP</button>
            </div>
            <div className={styles.promotions}>
              <h3>Ưu đãi khi mua kèm PC</h3>
              <ul>
                <li>⭐Ưu đãi lên đến 54% khi mua kèm PC xem ngay tại đây.</li>
                <li>Hỗ trợ trả góp MPOS (Thẻ tín dụng), HDSAISON.</li>
                {/* Add more from API if available */}
              </ul>
            </div>
            <div className={styles.showrooms}>
              <h3>Showroom</h3>
              <ul>
                <li>78-80 Hoàng Hoa Thám, Phường 12, Q.Tân Bình, TP.HCM</li>
                {/* List more */}
              </ul>
            </div>
          </div>
        </section>

        {/* Specifications Section */}
        <section className={styles.specs}>
          <h2>Thông số kỹ thuật</h2>
          {specs.length > 0 ? (
            <SpecsTable specs={specs} /> // Use the client component here
          ) : (
            <p>{product.Description}</p>
          )}
        </section>

        {/* Description Section */}
        <section className={styles.description}>
          <h2>Mô tả sản phẩm</h2>
          <p>{product.Description}</p>
        </section>

        {/* Related Products - Placeholder, fetch similar by CategoryId */}
        {/* Related Products */}
        <section className={styles.related}>
          {/* Xác định type dựa trên sản phẩm hiện tại */}
          {product.Description.startsWith('PC') && (
            <SectionCollection
              type="pc"
              title="Sản phẩm tương tự"
              excludeProductId={resolvedParams.productId}
            />
          )}

          {product.Description.startsWith('Laptop') && (
            <SectionCollection
              type="laptop"
              title="Sản phẩm tương tự"
              excludeProductId={resolvedParams.productId}
            />
          )}

          {product.Description.startsWith('Chuột') && (
            <SectionCollection
              type="mouse"
              title="Sản phẩm tương tự"
              excludeProductId={resolvedParams.productId}
            />
          )}

          {product.Description.startsWith('Bàn phím') && (
            <SectionCollection
              type="keyboard"
              title="Sản phẩm tương tự"
              excludeProductId={resolvedParams.productId}
            />
          )}

          {product.Description.startsWith('Màn') && (
            <SectionCollection
              type="monitor"
              title="Sản phẩm tương tự"
              excludeProductId={resolvedParams.productId}
            />
          )}
          {/* Thêm điều kiện cho các loại khác nếu cần, ví dụ mouse, keyboard, monitor */}
        </section>
        {/* Reviews Section */}
        <section className={styles.reviews}>
          <h2>Đánh giá & Nhận xét</h2>
          <p>0 đánh giá</p>
          {/* Add review form and list if API available */}
        </section>

        {/* Viewed Products - Optional */}

      </main>
      <RecentView />
      <Footer />
    </>
  );
}