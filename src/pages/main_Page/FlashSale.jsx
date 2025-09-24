import ProductSlider from './Product/ProductSlider.jsx';
import { products } from '../../lib/data.js';
import ContainerFluid from './container-fluid.jsx';

export default function FlashSale({
  className = 'flash-sale',
  h2Title = "Flash Sale",
  showImg_Sale = true,
  showTitle = true,
  showReadMore = true,
  showDotActive = true,
}) {
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
              <img src="image/flash-sale/gtn-gamming-gear.png" alt="Gear Arena Week" />
            </div>
          )}

          {showTitle && (
            <div className="flash-sale-title">
              <span className="sale-title">Flash sale</span>
            </div>
          )}
          <ProductSlider products={products} showDotActive={true} />

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
