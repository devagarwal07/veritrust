'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { CreditScore } from '@/utils/scoring';
import { CREDIT_SCORE_RANGES } from '@/utils/constants';

interface CreditResultCardProps {
  result: CreditScore;
  showDetails?: boolean;
}

export default function CreditResultCard({
  result,
  showDetails = true,
}: CreditResultCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    if (score >= 550) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 750) return 'from-green-500 to-emerald-600';
    if (score >= 700) return 'from-blue-500 to-cyan-600';
    if (score >= 650) return 'from-yellow-500 to-amber-600';
    if (score >= 550) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-600';
  };

  const getRiskIcon = () => {
    switch (result.riskLevel) {
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getImpactIcon = (impact: 'positive' | 'neutral' | 'negative') => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-slate-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect rounded-2xl p-8 text-center"
      >
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Your Credit Score
          </p>
          <div
            className={`text-6xl font-bold bg-gradient-to-r ${getScoreGradient(
              result.score
            )} bg-clip-text text-transparent`}
          >
            {result.score}
          </div>
          <p className={`text-xl font-semibold mt-2 ${getScoreColor(result.score)}`}>
            {result.grade}
          </p>
        </div>

        {/* Score Range Indicator */}
        <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getScoreGradient(
              result.score
            )} transition-all duration-1000`}
            style={{
              width: `${((result.score - 300) / 550) * 100}%`,
            }}
          />
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-center space-x-2">
          {getRiskIcon()}
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Risk Level:{' '}
            <span className="font-medium capitalize">{result.riskLevel}</span>
          </span>
        </div>
      </motion.div>

      {showDetails && (
        <>
          {/* Credit Factors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Credit Factors
            </h3>
            <div className="space-y-4">
              {result.factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getImpactIcon(factor.impact)}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {factor.name}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {factor.score.toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className={`absolute top-0 left-0 h-full ${
                        factor.impact === 'positive'
                          ? 'bg-green-500'
                          : factor.impact === 'neutral'
                          ? 'bg-slate-400'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Recommendations
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>{recommendation}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Score Range Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Score Ranges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(CREDIT_SCORE_RANGES).map((range) => (
                <div
                  key={range.label}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {range.label}
                  </span>
                  <span className={`text-xs font-semibold ${range.color}`}>
                    {range.min}-{range.max}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

