import Link from 'next/link';
import ContainerFluid from './container-fluid.jsx';

export default function MidBanner() {
  return (
    <ContainerFluid>
      <div className="mid-banner">
        <Link href="/promotions">
          <img src="/image/mid-banner/promo.jpg" alt="Promotion Banner" />
        </Link>
      </div>
    </ContainerFluid>
  );
}