// src/app/(components)/FlashSale/index.tsx
import { api } from '@/lib/api';
import ProductSlider from '../Product/ProductSlider'; // không cần .tsx ở import
import ContainerFluid from '../container-fluid.jsx';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  created_at: string;
};

type FlashSaleProps = {
  className?: string;
  h2Title?: string;
  showImg_Sale?: boolean;
  showTitle?: boolean;
  showReadMore?: boolean;
  showDotActive?: boolean;
  limit?: number; // số sản phẩm hiển thị
};

async function getFlashProducts(limit = 12): Promise<Product[]> {
  const json = await api<{ success: boolean; data: Product[] }>('/api/products');
  const products = json.data ?? [];
  // demo: lấy mới nhất, còn logic “flash sale” tùy bạn filter theo field riêng
  return products
    .toSorted((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, limit);
}

export default async function FlashSale({
  className = 'flash-sale',
  h2Title = 'Flash Sale',
  showImg_Sale = true,
  showTitle = true,
  showReadMore = true,
  showDotActive = true,
  limit = 12,
}: FlashSaleProps) {
  const products = await getFlashProducts(limit);

  return (
    <ContainerFluid>
      <section className={className}>
        <div className="flash-sale-header">
          <div className="countdown">
            <span id="hours">00</span>:<span id="minutes">00</span>:<span id="seconds">00</span>
          </div>
          <h2>{h2Title}</h2>
        </div>

        <div className="flash-sale-content">
          {showImg_Sale && (
            <div className="flash-sale-2-content-img">
              {/* ảnh tĩnh của FRONTEND phải nằm ở: frontend/public/image/flash-sale/gtn-gamming-gear.png */}
              <img
                src="/images/flash-sale/gtn-gamming-gear.png"
                alt="Gear Arena Week"
                loading="lazy"
              />
            </div>
          )}

          {showTitle && (
            <div className="flash-sale-title">
              <span className="sale-title">Flash sale</span>
            </div>
          )}

          <ProductSlider products={products} showDotActive={showDotActive} />

          {showReadMore && (
            <div className="more-promotion">
              <a href="#">Xem thêm khuyến mãi</a>
            </div>
          )}
        </div>
      </section>
    </ContainerFluid>
  );
}
