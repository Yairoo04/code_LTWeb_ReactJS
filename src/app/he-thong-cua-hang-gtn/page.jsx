"use client";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Showroom from "../../pages/showroom_system/showroom.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <Showroom />
      </main>
      <Footer />
    </div>
  );
}
