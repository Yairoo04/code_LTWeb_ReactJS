"use client";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import PaymentPage from "../../pages/thanh-toan/thanh-toan.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <PaymentPage />
      </main>
      <Footer />
    </div>
  );
}
