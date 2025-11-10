"use client";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
// import Showroom from "../../pages/showroom_system/showroom.jsx";
import TermsOfService from "../../pages/dieu-khoan/dieu-khoan-dich-vu.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <TermsOfService />
      </main>
      <Footer />
    </div>
  );
}
