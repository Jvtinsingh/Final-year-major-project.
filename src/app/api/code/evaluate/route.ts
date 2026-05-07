import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminDb } from '@/lib/firebase-admin';
import { executeCode } from '@/lib/services/piston';
import { verifyToken, checkRole } from '@/lib/auth-server';

export async function POST(req: Request) {
  const token = await verifyToken(req);
  if (!token || !checkRole(token, ['student', 'faculty', 'admin'])) {
    return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
  }

  try {
    const { questionId, sourceCode, language } = await req.json();

    if (!questionId || !sourceCode || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const questionDoc = await adminDb.collection('questions').doc(questionId).get();
    if (!questionDoc.exists) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const { testCases } = questionDoc.data() || { testCases: [] };
    const results = [];

    for (const testCase of testCases) {
      const executionResult = await executeCode(language, sourceCode, testCase.input);
      const isPassed = executionResult.run.stdout.trim() === testCase.output.trim();
      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: executionResult.run.stdout,
        isPassed,
        errors: executionResult.run.stderr,
      });
    }

    const totalPassed = results.filter((r) => r.isPassed).length;
    const finalStatus = totalPassed === testCases.length ? 'PASS' : 'FAIL';

    return NextResponse.json({
      status: finalStatus,
      results,
      passedCount: totalPassed,
      totalCount: testCases.length,
    });
  } catch (error: any) {
    console.error('[API-Code] Evaluation Error:', error.message);
    return NextResponse.json({ error: 'System error during code evaluation.' }, { status: 500 });
  }
}
