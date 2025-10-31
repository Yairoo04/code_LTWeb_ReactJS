// import "../styles/globals.scss";
// import { config } from "@fortawesome/fontawesome-svg-core";
// import "@fortawesome/fontawesome-svg-core/styles.css";

// config.autoAddCss = false;

// export const metadata = {
//   title: "GTN - Technology Retail",
//   description: "GTN Technology Retail - Laptops, PCs, and Accessories",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="mdl-js">{children}</body>
//     </html>
//   );
// }
import "../styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

