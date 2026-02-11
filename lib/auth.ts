import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'admin-token';
const EXPIRY_DAYS = 7;
const EXPIRY_SEC = EXPIRY_DAYS * 24 * 60 * 60;

export interface JWTPayload {
  userId: string;
  email: string;
}

export function getSecret(): Uint8Array {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment');
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    const userId = payload.userId as string;
    const email = payload.email as string;
    if (!userId || !email) return null;
    return { userId, email };
  } catch {
    return null;
  }
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export const AUTH = {
  cookieName: COOKIE_NAME,
  expirySeconds: EXPIRY_SEC,
  expiryDays: EXPIRY_DAYS,
} as const;
