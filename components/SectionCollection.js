import Link from 'next/link';

export default function SectionCollection() {
  return (
    <section className="section-collection">
      <h2>Bộ sưu tập</h2>
      <div className="collection-grid">
        <Link href="/laptops">
          <img src="/image/collection/sub-banner-1.png" alt="Laptops" />
          <p>Laptops</p>
        </Link>
        <Link href="/gaming">
          <img src="/image/collection/gaming.jpg" alt="Gaming" />
          <p>Gaming</p>
        </Link>
        <Link href="/accessories">
          <img src="/image/collection/accessories.jpg" alt="Accessories" />
          <p>Accessories</p>
        </Link>
      </div>
    </section>
  );
}