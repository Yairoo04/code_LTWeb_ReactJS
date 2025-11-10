"use client";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import WarrantyPolicy from "../../pages/chinh-sach-bao-hanh/chinh-sach-bao-hanh.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <WarrantyPolicy />
      </main>
      <Footer />
    </div>
  );
}
