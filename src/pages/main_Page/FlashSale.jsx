import ProductSlider from './ProductSlider.jsx';
import { products } from '../../lib/data.js';
import ContainerFluid from './container-fluid.jsx';

export default function FlashSale() {
  return (
    <ContainerFluid>
      <section className="flash-sale">
        <h2>Flash Sale</h2>
        <ProductSlider products={products} />
      </section>
    </ContainerFluid>
  );
}