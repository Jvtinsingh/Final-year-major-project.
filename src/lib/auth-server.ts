import { adminAuth } from './firebase-admin';

export interface DecodedToken {
  uid: string;
  email?: string;
  role?: string;
  displayName?: string;
  [key: string]: any;
}

export async function verifyToken(req: Request): Promise<DecodedToken | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken as DecodedToken;
  } catch (error: any) {
    console.error('[Auth-Server] Token Verification Error:', error.message);
    return null;
  }
}

export function checkRole(token: DecodedToken, roles: string[]): boolean {
  if (!token || !token.role) return false;
  return roles.includes(token.role);
}
