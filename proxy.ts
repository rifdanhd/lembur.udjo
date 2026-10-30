import { NextResponse, type NextRequest } from "next/server";
import { APP_URL, siteForHost } from "./lib/site-domains";

function privateResponse(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

function notFound() {
  return privateResponse(new NextResponse("Halaman tidak ditemukan.", { status: 404 }));
}

export function proxy(request: NextRequest) {
  // Nginx must forward the original Host. Never trust a client-supplied site header.
  const site = siteForHost(request.headers.get("host") || request.nextUrl.host);
  const { pathname } = request.nextUrl;
  const under = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);
  const isApi = under("/api");
  const isAsset = under("/_next") || (!isApi && /\.[^/]+$/.test(pathname));
  const rewrite = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return privateResponse(NextResponse.rewrite(url));
  };
  const redirect = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return privateResponse(NextResponse.redirect(url, 307));
  };

  if (site === "preview") return NextResponse.next();

  if (site === "website") {
    if (under("/admin")) {
      const url = new URL(pathname === "/admin/login" ? "/login" : "/dashboard", APP_URL);
      url.search = request.nextUrl.search;
      return privateResponse(NextResponse.redirect(url, 307));
    }
    if (under("/ticket")) return notFound();
    return NextResponse.next();
  }

  if (pathname === "/robots.txt") {
    return privateResponse(new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }));
  }
  if (isAsset) return NextResponse.next();

  if (site === "ticket") {
    // No CRM/Payload endpoints are exposed on the visitor hostname.
    if (pathname === "/") return rewrite("/ticket");
    return notFound();
  }

  if (pathname === "/") return redirect("/dashboard");
  if (pathname === "/admin") return redirect("/dashboard");
  if (pathname === "/admin/login") return redirect("/login");
  if (pathname === "/dashboard") return rewrite("/admin");
  if (pathname === "/login") return rewrite("/admin/login");
  // Existing route handlers still enforce the CRM session themselves.
  if (isApi) {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      const origin = request.headers.get("origin");
      if (origin) {
        let sameHost = false;
        try {
          const originUrl = new URL(origin);
          sameHost = ["https:", "http:"].includes(originUrl.protocol)
            && originUrl.host === request.headers.get("host");
        } catch {
          // Invalid or opaque origins cannot submit staff mutations.
        }
        if (!sameHost) {
          return privateResponse(NextResponse.json({ error: "Permintaan tidak diizinkan." }, { status: 403 }));
        }
      }
    }
    return privateResponse(NextResponse.next());
  }
  return notFound();
}
