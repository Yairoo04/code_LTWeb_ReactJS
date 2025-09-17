import Link from 'next/link';

export default function SubBanner() {
  return (
    <div className="sub-banner">
      <Link href="/laptops">
        <img src="/image/sub-banner/sub-banner-1.png" alt="Laptop Banner" />
      </Link>
      <Link href="/gaming">
        <img src="/image/sub-banner/sub-banner-2.png" alt="Gaming Banner" />
      </Link>
      <Link href="/accessories">
        <img src="/image/sub-banner/sub-banner-3.png" alt="Accessories Banner" />
      </Link>
      <Link href="/case-pc">
        <img src="/image/sub-banner/sub-banner-4.png" alt="Case-pc Banner" />
      </Link>
    </div>
  );
}