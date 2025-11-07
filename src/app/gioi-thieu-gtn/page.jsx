"use client";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
// import Showroom from "../../pages/showroom_system/showroom.jsx";
import AboutPage from "../../pages/gioi-thieu-GTN/gioi-thieu-GTN.jsx";

export default function ShowroomPage() {
  return (
    <div>
      <Header />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </div>
  );
}
