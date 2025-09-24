"use client";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Slider from "../pages/main_Page/Slider.jsx";
import SubBanner from "../pages/main_Page/SubBanner.jsx";
import RecentView from "../pages/main_Page/RecentView.jsx";
import FlashSale from "../pages/main_Page/FlashSale.jsx";
import MidBanner from "../pages/main_Page/MidBanner.jsx";
import SectionCollection from "../pages/main_Page/SectionCollection.jsx";
import SubHeader from "../pages/main_Page/SubHeader.jsx";
import { publicRoutes } from '../routes/routes.js';


export default function Home() {
  return (
    <div>
      <Header>
      </Header>
      <SubHeader />
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
