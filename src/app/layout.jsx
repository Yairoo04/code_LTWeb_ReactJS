import "../styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Providers from "./Providers";
import ChatBox from "@/components/ChatBox/ChatBox"; // ✅ thêm dòng này
import { RecentViewProvider } from "@/pages/main_Page/RecentViewProducts/RecentViewContext";

config.autoAddCss = false;

// export const metadata = {
//   title: "GTN - Technology Retail",
//   description: "GTN Technology Retail - Laptops, PCs, and Accessories",
// };

export const metadata = {
  title: "GTN shop",
  description: "GTN Technology Retail - Laptops, PCs, and Accessories",
  icons: {
    icon: "/images/logo_GTN.ico",      // favicon chính
    shortcut: "/images/logo_GTN.ico",  // cho trình duyệt dùng làm shortcut icon
    // apple: "/logoGTN-apple.png",             // nếu sau này có icon riêng cho iOS thì thêm
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="mdl-js">
      <head>
        <link rel="icon" type="image/x-icon" href="/images/logo_GTN.ico" />
        <title>GTN - Technology Retail</title>
        <meta name="description" content="GTN Technology Retail - Laptops, PCs, and Accessories" />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
        {/* ✅ Gắn ChatBox ở cuối body để nổi trên mọi trang */}
        <ChatBox />
      </body>
    </html>
  );
}
