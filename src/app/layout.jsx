import "../styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RecentViewProvider } from '../pages/main/Page/RecentViewProducts/RecentViewContext';

config.autoAddCss = false;

export const metadata = {
  title: "GTN - Technology Retail",
  description: "GTN Technology Retail - Laptops, PCs, and Accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="mdl-js">
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
          <RecentViewProvider>
            {children}
          </RecentViewProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}