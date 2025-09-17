import ProductSlider from './ProductSlider';
import { products } from '../lib/data';
import ContainerFluid from './container-fluid.jsx';

export default function RecentView() {
  return (
    <ContainerFluid>
      <section className="recent-view">
        <h2>Sản phẩm đã xem</h2>
        <ProductSlider products={products} />
      </section>
    </ContainerFluid>
  );
}