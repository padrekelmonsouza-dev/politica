import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { httpStatusFallbackResponse } from "./lib/http-status-fallback";

const GOOGLE_SITE_VERIFICATION_PATH = "/google6e3cc8fc1fe21502.html";
const GOOGLE_SITE_VERIFICATION_BODY =
  "google-site-verification: google6e3cc8fc1fe21502.html\n";

const googleVerificationMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  if (url.hostname.toLowerCase() === "www.padrekelmon.com.br") {
    url.hostname = "padrekelmon.com.br";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  const statusFallback = httpStatusFallbackResponse(request);
  if (statusFallback) return statusFallback;

  const pathname = url.pathname.replace(/\/$/, "") || "/";
  if (pathname === GOOGLE_SITE_VERIFICATION_PATH) {
    return new Response(GOOGLE_SITE_VERIFICATION_BODY, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache, no-store, must-revalidate",
      },
    });
  }
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [googleVerificationMiddleware, errorMiddleware, csrfMiddleware],
}));
