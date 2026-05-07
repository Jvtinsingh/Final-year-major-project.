import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { verifyToken, checkRole } from '@/lib/auth-server';
import * as xlsx from 'xlsx';

export async function POST(req: Request) {
  const token = await verifyToken(req);
  if (!token || !checkRole(token, ['admin'])) {
    return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const role = formData.get('role') as string;

    if (!file || !role) {
      return NextResponse.json({ error: 'Missing file or role' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(new Uint8Array(buffer), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const usersCreated: string[] = [];
    const errors: any[] = [];

    for (const record of data) {
      try {
        const { email, password, displayName } = record;
        if (!email) continue;

        const userRecord = await adminAuth.createUser({
          email,
          password: password || 'Default123!',
          displayName: displayName || email.split('@')[0],
        });

        // Set custom claims for role
        await adminAuth.setCustomUserClaims(userRecord.uid, { role });

        // Save to Firestore
        await adminDb.collection('users').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email,
          displayName: displayName || email.split('@')[0],
          role,
          status: 'active',
          joinedDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });

        usersCreated.push(email);
      } catch (error: any) {
        errors.push({ email: record.email, error: error.message });
      }
    }

    return NextResponse.json({
      message: 'Bulk upload completed',
      total: data.length,
      created: usersCreated.length,
      errors,
    });
  } catch (error: any) {
    console.error('[API-Auth] Bulk Upload Error:', error.message);
    return NextResponse.json({ error: 'Failed to process the uploaded file.' }, { status: 500 });
  }
}
