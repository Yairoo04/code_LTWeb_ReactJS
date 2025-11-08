
// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Lấy cookie "isLoggedIn" (true/false)
//   const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";

//   // 1️⃣ Nếu chưa đăng nhập mà truy cập bất kỳ trang admin nào (trừ /admin/login)
//   if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !isLoggedIn) {
//     const loginUrl = req.nextUrl.clone();
//     loginUrl.pathname = "/admin/login";
//     return NextResponse.redirect(loginUrl);
//   }

//   // 2️⃣ Nếu đã đăng nhập mà vẫn vào /admin/login → chuyển về dashboard
//   if (pathname === "/admin/login" && isLoggedIn) {
//     const dashboardUrl = req.nextUrl.clone();
//     dashboardUrl.pathname = "/admin/dashboard";
//     return NextResponse.redirect(dashboardUrl);
//   }

//   // 3️⃣ Nếu người dùng truy cập /admin → tự động chuyển tới dashboard hoặc login
//   if (pathname === "/admin") {
//     const redirectUrl = req.nextUrl.clone();
//     redirectUrl.pathname = isLoggedIn ? "/admin/dashboard" : "/admin/login";
//     return NextResponse.redirect(redirectUrl);
//   }

//   // Cho phép các request hợp lệ đi tiếp
//   return NextResponse.next();
// }

// // Áp dụng middleware cho mọi route trong /admin
// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";

  // ⚙️ Bỏ qua middleware cho route API
  if (pathname.startsWith("/admin/api") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }


  // Nếu truy cập /admin/login mà đã đăng nhập → về dashboard
  if (pathname === "/admin/login" && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // Nếu truy cập /admin (root) → điều hướng phù hợp
  if (pathname === "/admin") {
    const url = req.nextUrl.clone();
    url.pathname = isLoggedIn ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(url);
  }

  // Nếu chưa login mà truy cập bất kỳ trang /admin/*
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Middleware áp dụng cho mọi route trong /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
