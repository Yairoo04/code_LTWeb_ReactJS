import ProductSlider from './ProductSlider';
import { products } from '../lib/data';
import ContainerFluid from './container-fluid';

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