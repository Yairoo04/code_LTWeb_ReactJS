"use client";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
// import Showroom from "../../pages/showroom_system/showroom.jsx";
import Order from "../../pages/gio-hang/OderInfo/OrderInfo.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <Order />
      </main>
      <Footer />
    </div>
  );
}
