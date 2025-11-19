"use client";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import PayOrder from "../../pages/gio-hang/Payment/Payment.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <PayOrder />
      </main>
      <Footer />
    </div>
  );
}
