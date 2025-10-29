import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getUserVerification,
  getUserCreditReport,
  getUserFraudAlerts,
} from '@/lib/supabaseClient';

/**
 * GET /api/user/[userId]
 * Get user's complete profile data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication
    const { userId: authenticatedUserId } = await auth();
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = params;

    // Ensure users can only access their own data
    if (authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all user data in parallel
    const [verification, creditReport, fraudAlerts] = await Promise.all([
      getUserVerification(userId),
      getUserCreditReport(userId),
      getUserFraudAlerts(userId),
    ]);

    // Check for errors
    if (verification.error || creditReport.error || fraudAlerts.error) {
      throw new Error('Failed to fetch user data');
    }

    const userData = {
      userId,
      verification: verification.data,
      creditReport: creditReport.data,
      fraudAlerts: fraudAlerts.data || [],
      stats: {
        isVerified: verification.data?.status === 'verified',
        hasCredit: !!creditReport.data,
        alertCount: fraudAlerts.data?.length || 0,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('User data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

