import { renderHttpErrorPage } from "./http-error-page";

const HTTP_ERROR_PATHS = {
  "/401": 401,
  "/403": 403,
  "/500": 500,
  "/503": 503,
} as const;

export function httpStatusFallbackResponse(request: Request): Response | null {
  const pathname = new URL(request.url).pathname.replace(/\/$/, "") || "/";
  const status = HTTP_ERROR_PATHS[pathname as keyof typeof HTTP_ERROR_PATHS];
  if (!status) return null;

  return new Response(renderHttpErrorPage(status), {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, follow",
      "cache-control": "no-store",
    },
  });
}
