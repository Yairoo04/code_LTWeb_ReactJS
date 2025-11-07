"use client";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ShippingPolicy from "../../pages/chinh-sach-giao-hang/chinh-sach-giao-hang.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <ShippingPolicy />
      </main>
      <Footer />
    </div>
  );
}
