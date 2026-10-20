import 'server-only';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Verifies the ID token that Google's sign-in button gives the browser.
// Checks Google's signature (public keys are fetched and cached by jose),
// the issuer, that it was issued for OUR client ID, and that it hasn't expired.

// Overridable only so automated tests can use a local key server.
const JWKS_URL = process.env.GOOGLE_JWKS_URL ?? 'https://www.googleapis.com/oauth2/v3/certs';
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export type GoogleProfile = { sub: string; email: string; emailVerified: boolean; name: string; picture: string };

export const googleClientId = () => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const audience = googleClientId();
  if (!audience) throw new Error('Google sign-in is not configured');
  jwks ??= createRemoteJWKSet(new URL(JWKS_URL));

  const { payload } = await jwtVerify(idToken, jwks, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience,
    algorithms: ['RS256'],
  });

  return {
    sub: String(payload.sub ?? ''),
    email: String(payload.email ?? '').toLowerCase(),
    emailVerified: payload.email_verified === true || payload.email_verified === 'true',
    name: String(payload.name ?? payload.given_name ?? ''),
    picture: String(payload.picture ?? ''),
  };
}
