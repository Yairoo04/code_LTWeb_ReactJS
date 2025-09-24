import ProductSlider from './ProductSlider';
import { recent_Products } from '../../../lib/data';
import ContainerFluid from '../container-fluid.jsx';
import './RecentView.module.scss';

export default function RecentView() {
  return (
    <ContainerFluid>
      <section className="recent-view">
        <h2>Sản phẩm đã xem</h2>
        <ProductSlider products={recent_Products} />
      </section>
    </ContainerFluid>
  );
}