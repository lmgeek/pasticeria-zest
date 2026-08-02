export function getAppBaseUrl(request) {
  const configured = process.env.NEXT_PUBLIC_URL?.trim()

  if (configured && !/^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?\//.test(configured)) {
    return configured.replace(/\/+$/, '')
  }

  return new URL(request.url).origin
}
