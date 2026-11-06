const INTERNAL_ORIGIN = 'http://localhost'

export function getSafeRedirectPath(
  redirectTarget: string | null | undefined,
  fallbackPath = '/'
): string {
  if (!redirectTarget || !redirectTarget.startsWith('/')) {
    return fallbackPath
  }

  try {
    const resolvedUrl = new URL(redirectTarget, INTERNAL_ORIGIN)

    if (resolvedUrl.origin !== INTERNAL_ORIGIN) {
      return fallbackPath
    }

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`
  } catch {
    return fallbackPath
  }
}

