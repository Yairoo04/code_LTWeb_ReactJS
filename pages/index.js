import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Slider from '../components/Slider';
import SubBanner from '../components/SubBanner';
import RecentView from '../components/RecentView';
import FlashSale from '../components/FlashSale';
import MidBanner from '../components/MidBanner';
import SectionCollection from '../components/SectionCollection';

export default function Home() {
  return (
    <div>
      <Head>
        <title>GTN - Technology Retail</title>
        <meta name="description" content="GTN Technology Retail - Laptops, PCs, and Accessories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Slider />
        <SubBanner />
        <RecentView />
        <FlashSale />
        <MidBanner />
        <SectionCollection />
      </main>
      <Footer />
    </div>
  );
}