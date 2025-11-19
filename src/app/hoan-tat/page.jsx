"use client";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import CompletePage from "../../pages/gio-hang/Complete/Complete.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <CompletePage />
      </main>
      <Footer />
    </div>
  );
}
