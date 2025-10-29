import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnalytics } from '@/lib/supabaseClient';

/**
 * GET /api/analytics
 * Get analytics data for dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get analytics data
    const analytics = await getAnalytics();

    if (analytics.error) {
      throw analytics.error;
    }

    // Process and aggregate data
    const verificationStats = {
      total: analytics.verifications.length,
      verified: analytics.verifications.filter((v: any) => v.status === 'verified').length,
      pending: analytics.verifications.filter((v: any) => v.status === 'pending').length,
      rejected: analytics.verifications.filter((v: any) => v.status === 'rejected').length,
    };

    const creditStats = {
      total: analytics.credits.length,
      averageScore: analytics.credits.length > 0
        ? analytics.credits.reduce((sum: number, c: any) => sum + c.credit_score, 0) / analytics.credits.length
        : 0,
      distribution: {
        excellent: analytics.credits.filter((c: any) => c.credit_score >= 750).length,
        good: analytics.credits.filter((c: any) => c.credit_score >= 700 && c.credit_score < 750).length,
        fair: analytics.credits.filter((c: any) => c.credit_score >= 650 && c.credit_score < 700).length,
        poor: analytics.credits.filter((c: any) => c.credit_score >= 550 && c.credit_score < 650).length,
        veryPoor: analytics.credits.filter((c: any) => c.credit_score < 550).length,
      },
    };

    const alertStats = {
      total: analytics.alerts.length,
      critical: analytics.alerts.filter((a: any) => a.severity === 'critical').length,
      high: analytics.alerts.filter((a: any) => a.severity === 'high').length,
      medium: analytics.alerts.filter((a: any) => a.severity === 'medium').length,
      low: analytics.alerts.filter((a: any) => a.severity === 'low').length,
    };

    return NextResponse.json(
      {
        verifications: verificationStats,
        credits: creditStats,
        alerts: alertStats,
        rawData: analytics,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

