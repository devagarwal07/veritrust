'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Lock,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'AI-Powered KYC',
      description:
        'Advanced facial recognition and document verification using computer vision and machine learning.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Credit Scoring',
      description:
        'Comprehensive credit evaluation using multiple financial factors and behavioral data.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Blockchain Proof',
      description:
        'Immutable verification records stored on-chain for maximum security and transparency.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Fraud Detection',
      description:
        'Real-time fraud alerts and pattern detection to prevent identity theft and synthetic fraud.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    'No traditional credit history required',
    'Instant verification results',
    'Decentralized and tamper-proof',
    'Privacy-first approach',
    'Global accessibility',
    'Lower fraud risk',
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account in seconds',
    },
    {
      number: '02',
      title: 'Verify Identity',
      description: 'Upload ID and take a selfie',
    },
    {
      number: '03',
      title: 'Get Score',
      description: 'Receive instant credit evaluation',
    },
    {
      number: '04',
      title: 'Access Dashboard',
      description: 'Monitor your trust profile',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                Next-Gen Trust & Verification
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-indigo-600 bg-clip-text text-transparent">
                Decentralized Trust
              </span>
              <br />
              <span className="text-slate-900 dark:text-slate-100">
                Verified by AI
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
              Revolutionizing identity verification and credit scoring with blockchain,
              AI-powered fraud detection, and zero-knowledge proofs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={isSignedIn ? '/verify' : '/sign-up'}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <span>{isSignedIn ? 'Start Verification' : 'Get Started Free'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="glass-effect hover:bg-white/80 dark:hover:bg-slate-900/80 px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-xl"
              >
                View Demo Dashboard
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  99.9%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Accuracy Rate
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  &lt;2s
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Verification Time
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  100%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Blockchain Secured
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Why VeriTrust+?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Combining cutting-edge AI, blockchain technology, and advanced fraud
              detection to create the most secure trust system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 card-hover"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Get verified and build trust in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-effect rounded-xl p-6 text-center h-full">
                  <div className="text-5xl font-bold bg-gradient-to-br from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Built for Everyone
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Whether you're new to credit or rebuilding your financial identity,
                VeriTrust+ provides fair, transparent evaluation powered by AI.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-effect rounded-2xl p-8"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Users className="w-12 h-12 text-primary-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Financial Inclusion
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      For the unbanked and underbanked
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Traditional credit systems exclude billions of people worldwide.
                  VeriTrust+ uses alternative data and behavioral signals to provide
                  fair assessments for everyone, regardless of credit history.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-primary-600" />
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Ready to Build Trust?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from secure,
              decentralized identity verification and credit scoring.
            </p>
            <Link
              href={isSignedIn ? '/verify' : '/sign-up'}
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

