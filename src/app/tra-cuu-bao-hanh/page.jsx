"use client";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import WarrantyLookup from "../../pages/tra-cuu-bao-hanh/tra-cuu-bao-hanh.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <WarrantyLookup />
      </main>
      <Footer />
    </div>
  );
}
