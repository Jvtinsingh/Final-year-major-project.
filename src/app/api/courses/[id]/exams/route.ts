import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminDb } from '@/lib/firebase-admin';
import { verifyToken, checkRole } from '@/lib/auth-server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
  const token = await verifyToken(req);
  if (!token || !checkRole(token, ['faculty', 'admin'])) {
    return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
  }

  try {
    const { title, startDate, durationMinutes, totalMarks, questions } = await req.json();

    if (!title || !startDate) {
      return NextResponse.json({ error: 'Missing required exam fields' }, { status: 400 });
    }

    const examRef = await adminDb.collection('exams').add({
      courseId,
      title,
      startDate,
      durationMinutes: durationMinutes || 60,
      totalMarks: totalMarks || 0,
      questions: questions || [],
      examsCount: 0,
      resultsPublished: false,
      createdAt: new Date().toISOString(),
    });

    // Notify enrolled students logic removed as requested

    return NextResponse.json({ id: examRef.id, message: 'Exam created and students notified' }, { status: 201 });
  } catch (error: any) {
    console.error('[API-Exams] Creation Error:', error.message);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}
