import "../styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Providers from "./Providers";
import ChatBox from "@/components/ChatBox/ChatBox"; // ✅ thêm dòng này

config.autoAddCss = false;

export const metadata = {
  title: "GTN - Technology Retail",
  description: "GTN Technology Retail - Laptops, PCs, and Accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="mdl-js">
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
        
        {/* ✅ Gắn ChatBox ở cuối body để nổi trên mọi trang */}
        <ChatBox />
      </body>
    </html>
  );
}
