'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Briefcase,
  Calendar,
  CreditCard,
} from 'lucide-react';
import CreditResultCard from '@/components/CreditResultCard';
import Loader from '@/components/Loader';
import { calculateCreditScore, assessFraudRisk } from '@/utils/scoring';
import { saveCreditReport } from '@/lib/supabaseClient';
import { storeVerificationOnChain, connectWallet, generateDocumentHash } from '@/lib/blockchain';
import type { CreditData, CreditScore } from '@/utils/scoring';

export default function CreditPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'processing' | 'result'>('form');
  const [creditData, setCreditData] = useState<CreditData>({
    paymentHistory: 80,
    creditUtilization: 30,
    creditAge: 36,
    creditMix: 3,
    newCreditInquiries: 2,
    totalDebt: 0,
    income: 0,
    employmentStatus: 'employed',
    delinquencies: 0,
  });
  const [result, setResult] = useState<CreditScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [blockchainTx, setBlockchainTx] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreditData, value: any) => {
    setCreditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    if (!user) {
      setError('Please sign in to continue');
      return;
    }

    setError(null);
    setStep('processing');

    try {
      // Calculate credit score
      const score = calculateCreditScore(creditData);
      setResult(score);

      // Assess fraud risk
      const fraudRisk = assessFraudRisk(creditData);

      // Save to database
      const reportData = {
        user_id: user.id,
        credit_score: score.score,
        grade: score.grade,
        risk_level: score.riskLevel,
        factors: score.factors,
        recommendations: score.recommendations,
      };

      const { data: savedReport, error: saveError } = await saveCreditReport(reportData);

      if (saveError) {
        console.error('Failed to save credit report:', saveError);
      }

      // Connect wallet and store on blockchain
      try {
        const { address, error: walletError } = await connectWallet();

        if (!walletError && address) {
          setWalletAddress(address);

          // Generate document hash
          const docHash = generateDocumentHash(JSON.stringify({
            userId: user.id,
            score: score.score,
            timestamp: Date.now(),
          }));

          // Store on blockchain
          const { transactionHash, error: txError } = await storeVerificationOnChain(
            address,
            docHash,
            score.score,
            score.grade
          );

          if (!txError && transactionHash) {
            setBlockchainTx(transactionHash);
            
            // Update credit report with blockchain hash
            if (savedReport) {
              await saveCreditReport({
                ...reportData,
                id: savedReport.id,
                blockchain_hash: transactionHash,
              });
            }
          }
        }
      } catch (blockchainError) {
        console.error('Blockchain storage failed:', blockchainError);
        // Continue even if blockchain storage fails
      }

      // Update Clerk metadata
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          hasCreditScore: true,
          creditScore: score.score,
        },
      });

      setStep('result');
    } catch (err: any) {
      console.error('Credit calculation error:', err);
      setError(err.message || 'Failed to calculate credit score');
      setStep('form');
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Credit Score Evaluation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Get your AI-powered credit score and financial insights
          </p>
        </motion.div>

        {/* Form */}
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Financial Information
              </h2>

              <div className="space-y-6">
                {/* Payment History */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment History ({creditData.paymentHistory}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creditData.paymentHistory}
                    onChange={(e) =>
                      handleInputChange('paymentHistory', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Percentage of on-time payments
                  </p>
                </div>

                {/* Credit Utilization */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Credit Utilization ({creditData.creditUtilization}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creditData.creditUtilization}
                    onChange={(e) =>
                      handleInputChange('creditUtilization', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Percentage of available credit being used
                  </p>
                </div>

                {/* Credit Age */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>Credit History Length</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={creditData.creditAge}
                    onChange={(e) =>
                      handleInputChange('creditAge', parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Months"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    How long you've had credit (in months)
                  </p>
                </div>

                {/* Credit Mix */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Mix (Types of Credit)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={creditData.creditMix}
                    onChange={(e) =>
                      handleInputChange('creditMix', parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0-5"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Number of different credit types (cards, loans, mortgage, etc.)
                  </p>
                </div>

                {/* New Credit Inquiries */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                    Recent Credit Inquiries
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={creditData.newCreditInquiries}
                    onChange={(e) =>
                      handleInputChange('newCreditInquiries', parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Number of inquiries"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Credit applications in the last 6 months
                  </p>
                </div>

                {/* Income */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    <DollarSign className="w-4 h-4" />
                    <span>Annual Income (Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={creditData.income || ''}
                    onChange={(e) =>
                      handleInputChange('income', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="$0"
                  />
                </div>

                {/* Employment Status */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    <Briefcase className="w-4 h-4" />
                    <span>Employment Status</span>
                  </label>
                  <select
                    value={creditData.employmentStatus}
                    onChange={(e) =>
                      handleInputChange(
                        'employmentStatus',
                        e.target.value as 'employed' | 'unemployed' | 'self-employed'
                      )
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>

                {/* Delinquencies */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                    Delinquent Accounts (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={creditData.delinquencies || ''}
                    onChange={(e) =>
                      handleInputChange('delinquencies', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Number of accounts past due
                  </p>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="mt-8 w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all hover:shadow-xl"
              >
                <span>Calculate Credit Score</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div className="glass-effect rounded-2xl p-12">
            <Loader size="lg" text="Calculating your credit score..." />
          </div>
        )}

        {/* Result */}
        {step === 'result' && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <CreditResultCard result={result} />

            {/* Blockchain Proof */}
            {blockchainTx && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Blockchain Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Wallet Address
                    </span>
                    <span className="font-mono text-xs text-slate-900 dark:text-slate-100">
                      {walletAddress}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Transaction Hash
                    </span>
                    <a
                      href={`https://mumbai.polygonscan.com/tx/${blockchainTx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-primary-600 hover:text-primary-700"
                    >
                      {blockchainTx.slice(0, 10)}...{blockchainTx.slice(-8)}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setStep('form');
                  setResult(null);
                  setBlockchainTx(null);
                }}
                className="flex-1 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Recalculate
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

