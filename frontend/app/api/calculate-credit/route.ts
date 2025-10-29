import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { calculateCreditScore, assessFraudRisk } from '@/utils/scoring';

/**
 * POST /api/calculate-credit
 * Calculate credit score from provided data
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const creditData = await request.json();

    // Validate required fields
    const requiredFields = [
      'paymentHistory',
      'creditUtilization',
      'creditAge',
      'creditMix',
      'newCreditInquiries',
    ];

    for (const field of requiredFields) {
      if (creditData[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Calculate credit score
    const score = calculateCreditScore(creditData);

    // Assess fraud risk
    const fraudRisk = assessFraudRisk(creditData);

    const result = {
      score: score.score,
      grade: score.grade,
      factors: score.factors,
      recommendations: score.recommendations,
      riskLevel: score.riskLevel,
      fraudRisk: {
        score: fraudRisk.riskScore,
        flags: fraudRisk.flags,
        isSuspicious: fraudRisk.isSuspicious,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Credit calculation error:', error);
    return NextResponse.json(
      { error: 'Credit calculation failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

