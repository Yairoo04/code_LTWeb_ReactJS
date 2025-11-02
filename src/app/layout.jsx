// app/layout.tsx
import "../styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { RecentViewProvider } from '../pages/main_Page/RecentViewProducts/RecentViewContext';

config.autoAddCss = false;

export const metadata = {
  title: "GTN - Technology Retail",
  description: "GTN Technology Retail - Laptops, PCs, and Accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="mdl-js">
        <RecentViewProvider>
          {children}
        </RecentViewProvider>
      </body>
    </html>
  );
}