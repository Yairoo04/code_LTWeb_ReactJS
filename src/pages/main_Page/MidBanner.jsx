import Link from 'next/link';
import ContainerFluid from './ContainerFluid/container-fluid';

export default function MidBanner() {
  return (
    <ContainerFluid>
      <div className="mid-banner">
        <Link href="/promotions">
          <img src="/images/mid-banner/mid-banner-1.png" alt="Promotion Banner" />
          <img src="/images/mid-banner/mid-banner-2.png" alt="Promotion Banner" />
        </Link>
      </div>
    </ContainerFluid>
  );
}