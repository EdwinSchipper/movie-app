import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/env'
import { getSafeRedirectPath } from '@/lib/redirect'

export async function GET(request: NextRequest) {
  const urlParams = new URL(request.url).searchParams
  const verificationCode = urlParams.get('code')
  const destinationPath = getSafeRedirectPath(urlParams.get('next'))

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const origin = getSiteUrl(forwardedHost, forwardedProto)

  if (verificationCode) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(verificationCode)

    if (!error) {
      return NextResponse.redirect(`${origin}${destinationPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
