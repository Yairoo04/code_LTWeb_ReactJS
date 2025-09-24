"use client";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
// import Showroom from "../../pages/showroom_system/showroom.jsx";
import Showroom from "../../pages/he-thong-cua-hang-gtn/he-thong-cua-hang-gtn.jsx";

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
