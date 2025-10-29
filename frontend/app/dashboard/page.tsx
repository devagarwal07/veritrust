'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
} from 'lucide-react';
import Chart, { StatCard } from '@/components/Chart';
import Loader, { CardSkeleton } from '@/components/Loader';
import {
  getAnalytics,
  getUserVerification,
  getUserCreditReport,
  getUserFraudAlerts,
} from '@/lib/supabaseClient';
import { CHART_COLORS } from '@/utils/constants';

export default function DashboardPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<any>(null);
  const [creditReport, setCreditReport] = useState<any>(null);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user-specific data
      const [verificationData, creditData, alertsData, analyticsData] =
        await Promise.all([
          getUserVerification(user.id),
          getUserCreditReport(user.id),
          getUserFraudAlerts(user.id),
          getAnalytics(),
        ]);

      setVerification(verificationData.data);
      setCreditReport(creditData.data);
      setFraudAlerts(alertsData.data || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock analytics data for demo
  const verificationStats = analytics?.verifications || [];
  const creditStats = analytics?.credits || [];
  const alertStats = analytics?.alerts || [];

  const verificationTrend = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 61 },
    { name: 'Thu', value: 58 },
    { name: 'Fri', value: 70 },
    { name: 'Sat', value: 55 },
    { name: 'Sun', value: 48 },
  ];

  const creditDistribution = [
    { name: 'Excellent', value: 25 },
    { name: 'Good', value: 35 },
    { name: 'Fair', value: 20 },
    { name: 'Poor', value: 15 },
    { name: 'Very Poor', value: 5 },
  ];

  const fraudTypeDistribution = [
    { name: 'Document Mismatch', value: 12 },
    { name: 'Face Mismatch', value: 8 },
    { name: 'Synthetic ID', value: 5 },
    { name: 'Duplicate', value: 3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Monitor your verification status and trust analytics
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              title="Verification Status"
              value={
                verification?.status === 'verified'
                  ? 'Verified'
                  : verification?.status === 'pending'
                  ? 'Pending'
                  : 'Not Started'
              }
              icon={<Shield className="w-6 h-6 text-white" />}
              color={
                verification?.status === 'verified'
                  ? 'success'
                  : verification?.status === 'pending'
                  ? 'warning'
                  : 'info'
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              title="Credit Score"
              value={creditReport?.credit_score || 'N/A'}
              change={creditReport ? 5 : undefined}
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              color="primary"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              title="Fraud Alerts"
              value={fraudAlerts.length}
              icon={<AlertTriangle className="w-6 h-6 text-white" />}
              color={fraudAlerts.length > 0 ? 'danger' : 'success'}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatCard
              title="Total Verifications"
              value="1.2K"
              change={12}
              icon={<Users className="w-6 h-6 text-white" />}
              color="info"
            />
          </motion.div>
        </div>

        {/* User Status Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Verification Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary-600" />
              <span>Identity Verification</span>
            </h2>

            {verification ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Status
                  </span>
                  <div className="flex items-center space-x-2">
                    {verification.status === 'verified' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                      {verification.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Document Type
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                    {verification.document_type?.replace('_', ' ')}
                  </span>
                </div>

                {verification.face_match_score && (
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Face Match Score
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {verification.face_match_score.toFixed(1)}%
                    </span>
                  </div>
                )}

                {verification.verified_at && (
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Verified At
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(verification.verified_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No verification data yet
                </p>
                <a
                  href="/verify"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Start Verification
                </a>
              </div>
            )}
          </motion.div>

          {/* Credit Report */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <span>Credit Profile</span>
            </h2>

            {creditReport ? (
              <div className="space-y-4">
                <div className="text-center py-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/20 dark:to-accent-950/20 rounded-xl">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                    {creditReport.credit_score}
                  </div>
                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    {creditReport.grade}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Risk Level
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                    {creditReport.risk_level}
                  </span>
                </div>

                {creditReport.blockchain_hash && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Blockchain Verified
                      </span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-500 font-mono break-all">
                      {creditReport.blockchain_hash.slice(0, 20)}...
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Last Updated
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {new Date(creditReport.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No credit score yet
                </p>
                <a
                  href="/credit"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Calculate Score
                </a>
              </div>
            )}
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Verification Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-effect rounded-xl p-6"
          >
            <Chart
              data={verificationTrend}
              type="line"
              dataKey="value"
              xKey="name"
              title="Weekly Verification Trend"
            />
          </motion.div>

          {/* Credit Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-effect rounded-xl p-6"
          >
            <Chart
              data={creditDistribution}
              type="pie"
              dataKey="value"
              title="Credit Score Distribution"
              colors={[
                CHART_COLORS.success,
                CHART_COLORS.primary,
                CHART_COLORS.warning,
                CHART_COLORS.danger,
                '#9ca3af',
              ]}
            />
          </motion.div>
        </div>

        {/* Fraud Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span>Fraud Detection Insights</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Chart
                data={fraudTypeDistribution}
                type="bar"
                dataKey="value"
                xKey="name"
                title="Fraud Types Detected"
                colors={[CHART_COLORS.danger]}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Recent Alerts
              </h3>
              {fraudAlerts.length > 0 ? (
                fraudAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                        {alert.alert_type.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          alert.severity === 'critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            : alert.severity === 'high'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {alert.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No fraud alerts detected
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

