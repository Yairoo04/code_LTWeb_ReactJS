"use client";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
// import Showroom from "../../pages/showroom_system/showroom.jsx";
import Cart from "../../pages/gio-hang/Cart/Cart.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <Cart />
      </main>
      <Footer />
    </div>
  );
}
