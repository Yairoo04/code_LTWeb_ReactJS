"use client";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Slider from "../components/Slider.jsx";
import SubBanner from "../components/SubBanner.jsx";
import RecentView from "../components/RecentView.jsx";
import FlashSale from "../components/FlashSale.jsx";
import MidBanner from "../components/MidBanner.jsx";
import SectionCollection from "../components/SectionCollection.jsx";

export default function Home() {
  return (
    <div>
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
