import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminDb } from '@/lib/firebase-admin';
import { verifyToken, checkRole } from '@/lib/auth-server';

export async function GET(req: Request) {
  const token = await verifyToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snap = await adminDb.collection('subjects').get();
    const subjects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(subjects);
  } catch (error: any) {
    console.error('[API-Courses] Fetch Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = await verifyToken(req);
  if (!token || !checkRole(token, ['faculty', 'admin'])) {
    return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
  }

  try {
    const { name, code, credits, description } = await req.json();

    if (!name || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await adminDb.collection('subjects').add({
      name,
      code,
      credits: credits || 0,
      description: description || '',
      facultyId: token.uid,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Subject created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('[API-Courses] Creation Error:', error.message);
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}
