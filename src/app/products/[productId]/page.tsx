// app/products/[productId]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './ProductDetail.module.scss';
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import ContainerFluid from '@/pages/main_Page/ContainerFluid/container-fluid';
import RecentView from '@/pages/main_Page/RecentViewProducts/RecentView';
import SectionCollection from '@/pages/main_Page/sectionCollection/SectionCollection';

// Assume you have a function to fetch product data
async function fetchProduct(productId: string) {
  const res = await fetch(`http://localhost:4000/api/products/${productId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  const { data } = await res.json();
  if (!data) {
    notFound();
  }
  return data;
}

// For specs, since API doesn't have detailed specs, we'll parse from description if possible
// For now, assume description is text. For PCs, you might need to add a specs field to API.
// Example specs for demonstration; in real, fetch or parse.
const getSpecs = (product: any) => {
  // Placeholder: If category is PC (assume CategoryId 2 for laptops/PCs), mock specs
  if (product.ProductId === 2) {
    return [
      { component: 'Bo mạch chủ', detail: 'Bo mạch chủ ASUS ROG Strix X870E-H Gaming Hatsune Miku Edition', warranty: '36 Tháng' },
      { component: 'CPU', detail: 'Bộ vi xử lý AMD Ryzen 9 9950X3D - 4.3GHz Boost 5.7GHz - 16 nhân 32 luồng', warranty: '36 Tháng' },
      { component: 'RAM', detail: 'RAM Corsair Dominator Titanium White 96GB (2x48GB) RGB 6600 DDR5', warranty: '36 Tháng' },
      { component: 'VGA', detail: 'VGA ASUS ROG Strix GeForce RTX 5090 16GB GDDR7 Hatsune Miku Edition', warranty: '36 Tháng' },
      { component: 'SSD', detail: 'Ổ cứng SSD Samsung 990 PRO NVMe M.2 1TB Gen5', warranty: '60 Tháng' },
      { component: 'HDD', detail: 'Tùy chọn nâng cấp', warranty: '24 Tháng' },
      { component: 'PSU', detail: 'Nguồn ASUS ROG THOR 1200 P 1200W Platinum II Hatsune Miku Edition', warranty: '120 Tháng' },
      { component: 'CASE', detail: 'Vỏ máy tính ASUS ROG Strix Helios II Hatsune Miku Edition', warranty: '12 Tháng' },
      { component: 'Tản nhiệt', detail: 'Tản nhiệt AIO ASUS ROG Ryujin IV SLC 360 ARGB Hatsune Miku Edition', warranty: '72 Tháng' },
    ];
  }
  return [];
};

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.productId);
  const specs = getSpecs(product);

  return (
    <>
      <Header />

      <main className={styles.productDetailPage}>
        <div className={styles.breadcrumbWrap}>
          <ContainerFluid>
            <div className={styles.breadcrumbList}>
              <ol className={styles.breadcrumbArrow}>
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
          <div className={styles.productImages}>
            <Image
              src={product.ImageUrl}
              alt={product.Name}
              width={600}
              height={600}
              className={styles.mainImage}
            />
            {/* Add thumbnail carousel if multiple images */}
          </div>
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
            <table>
              <thead>
                <tr>
                  <th>Linh kiện</th>
                  <th>Chi tiết</th>
                  <th>Bảo hành</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, index) => (
                  <tr key={index}>
                    <td>{spec.component}</td>
                    <td>{spec.detail}</td>
                    <td>{spec.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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