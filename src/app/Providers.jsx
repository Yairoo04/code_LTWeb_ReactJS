"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { RecentViewProvider } from "../pages/main_Page/RecentViewProducts/RecentViewContext";

export default function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <RecentViewProvider>{children}</RecentViewProvider>
    </GoogleOAuthProvider>
  );
}
