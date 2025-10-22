import "../styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false; // Ngăn FontAwesome tự thêm CSS 2 lần

export const metadata = {
  title: "GTN - Technology Retail",
  description: "GTN Technology Retail - Laptops, PCs, and Accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="mdl-js">{children}</body>
    </html>
  );
}
