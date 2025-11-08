"use client";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Slider from "../pages/main_Page/Slider/Slider.jsx";
import SubBanner from "../pages/main_Page/SubBanner.jsx";
import RecentView from "../pages/main_Page/RecentViewProducts/RecentView.tsx";
import FlashSale from "../pages/main_Page/FlashSale/FlashSale.tsx";
import MidBanner from "../pages/main_Page/MidBanner.jsx";
import SectionCollection from "../pages/main_Page/sectionCollection/SectionCollection.tsx";
import SubHeader from "../pages/main_Page/SubHeader.jsx";
// import MenuList from "../pages/main_Page/MenuList.jsx";
// import { publicRoutes } from '../routes/routes.js';

export default function Home() {
  return (
    <div>
      <Header>
      </Header>
      <SubHeader />
      <main>
        <Slider />
        {/* <MenuList /> */}
        <SubBanner />
        <RecentView/>
        {/* <!-- Nhóm fsl 2 --> */}
        <FlashSale className="flash-sale-1" h2Title="⚡ FLASH SALE 10H MỖI NGÀY" showImg_Sale={false} showDotActive={false} />
        {/* <!-- Nhóm fsl 2 --> */}
        <FlashSale className="flash-sale-2" h2Title="⚡ GEAR ARENA WEEK" showTitle={false} showReadMore={false}/>
        <MidBanner />
        <SectionCollection />
      </main>
      <Footer />
    </div>
  );
}