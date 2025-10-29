// AI-powered Credit Scoring Logic

export interface CreditData {
  paymentHistory: number; // 0-100
  creditUtilization: number; // 0-100
  creditAge: number; // months
  creditMix: number; // 0-5 (number of credit types)
  newCreditInquiries: number; // count
  totalDebt?: number;
  income?: number;
  employmentStatus?: 'employed' | 'unemployed' | 'self-employed';
  delinquencies?: number;
}

export interface CreditScore {
  score: number;
  grade: string;
  factors: CreditFactor[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CreditFactor {
  name: string;
  score: number;
  impact: 'positive' | 'neutral' | 'negative';
  weight: number;
}

/**
 * Calculate credit score based on multiple factors
 * Uses a weighted algorithm similar to FICO
 */
export function calculateCreditScore(data: CreditData): CreditScore {
  // Payment History (35%)
  const paymentHistoryScore = data.paymentHistory * 0.35;
  
  // Credit Utilization (30%)
  const utilizationScore = (100 - data.creditUtilization) * 0.30;
  
  // Credit Age (15%) - normalize to 0-100 scale (10 years = 100)
  const ageScore = Math.min((data.creditAge / 120) * 100, 100) * 0.15;
  
  // Credit Mix (10%)
  const mixScore = Math.min((data.creditMix / 5) * 100, 100) * 0.10;
  
  // New Credit Inquiries (10%) - fewer is better
  const inquiriesScore = Math.max(100 - (data.newCreditInquiries * 10), 0) * 0.10;
  
  // Calculate raw score (0-100)
  const rawScore = paymentHistoryScore + utilizationScore + ageScore + mixScore + inquiriesScore;
  
  // Convert to FICO-like scale (300-850)
  const score = Math.round(300 + (rawScore / 100) * 550);
  
  // Determine grade
  const grade = getGrade(score);
  
  // Calculate individual factors
  const factors: CreditFactor[] = [
    {
      name: 'Payment History',
      score: data.paymentHistory,
      impact: data.paymentHistory > 70 ? 'positive' : data.paymentHistory > 50 ? 'neutral' : 'negative',
      weight: 0.35,
    },
    {
      name: 'Credit Utilization',
      score: 100 - data.creditUtilization,
      impact: data.creditUtilization < 30 ? 'positive' : data.creditUtilization < 50 ? 'neutral' : 'negative',
      weight: 0.30,
    },
    {
      name: 'Credit History Length',
      score: Math.min((data.creditAge / 120) * 100, 100),
      impact: data.creditAge > 60 ? 'positive' : data.creditAge > 24 ? 'neutral' : 'negative',
      weight: 0.15,
    },
    {
      name: 'Credit Mix',
      score: (data.creditMix / 5) * 100,
      impact: data.creditMix > 3 ? 'positive' : data.creditMix > 1 ? 'neutral' : 'negative',
      weight: 0.10,
    },
    {
      name: 'New Credit Inquiries',
      score: Math.max(100 - (data.newCreditInquiries * 10), 0),
      impact: data.newCreditInquiries < 2 ? 'positive' : data.newCreditInquiries < 4 ? 'neutral' : 'negative',
      weight: 0.10,
    },
  ];
  
  // Generate recommendations
  const recommendations = generateRecommendations(data, factors);
  
  // Determine risk level
  const riskLevel = getRiskLevel(score);
  
  return {
    score,
    grade,
    factors,
    recommendations,
    riskLevel,
  };
}

function getGrade(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  if (score >= 550) return 'Poor';
  return 'Very Poor';
}

function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 700) return 'low';
  if (score >= 600) return 'medium';
  return 'high';
}

function generateRecommendations(data: CreditData, factors: CreditFactor[]): string[] {
  const recommendations: string[] = [];
  
  // Payment history recommendations
  if (data.paymentHistory < 70) {
    recommendations.push('Set up automatic payments to improve payment history');
    recommendations.push('Contact creditors to negotiate payment plans for past due accounts');
  }
  
  // Credit utilization recommendations
  if (data.creditUtilization > 30) {
    recommendations.push('Reduce credit card balances below 30% of credit limits');
    recommendations.push('Consider requesting a credit limit increase');
  }
  
  // Credit age recommendations
  if (data.creditAge < 24) {
    recommendations.push('Keep older credit accounts open to build credit history');
  }
  
  // Credit mix recommendations
  if (data.creditMix < 2) {
    recommendations.push('Consider diversifying your credit mix with different types of credit');
  }
  
  // New inquiries recommendations
  if (data.newCreditInquiries > 3) {
    recommendations.push('Limit new credit applications for the next 6 months');
  }
  
  // Employment recommendations
  if (data.employmentStatus === 'unemployed') {
    recommendations.push('Stable employment can improve creditworthiness over time');
  }
  
  // Delinquencies recommendations
  if (data.delinquencies && data.delinquencies > 0) {
    recommendations.push('Address any delinquent accounts immediately');
  }
  
  // If already good, provide maintenance tips
  if (recommendations.length === 0) {
    recommendations.push('Continue making on-time payments');
    recommendations.push('Monitor your credit report regularly for errors');
    recommendations.push('Keep credit utilization low');
  }
  
  return recommendations;
}

/**
 * Fraud risk assessment based on credit data patterns
 */
export function assessFraudRisk(data: CreditData): {
  riskScore: number;
  flags: string[];
  isSuspicious: boolean;
} {
  const flags: string[] = [];
  let riskScore = 0;
  
  // Check for suspicious patterns
  if (data.newCreditInquiries > 6) {
    flags.push('Unusually high number of credit inquiries');
    riskScore += 30;
  }
  
  if (data.creditAge < 6) {
    flags.push('Very new credit profile');
    riskScore += 20;
  }
  
  if (data.paymentHistory < 30 && data.creditAge > 12) {
    flags.push('Poor payment history with established credit');
    riskScore += 25;
  }
  
  if (data.creditUtilization > 90) {
    flags.push('Extremely high credit utilization');
    riskScore += 15;
  }
  
  if (data.delinquencies && data.delinquencies > 3) {
    flags.push('Multiple delinquent accounts');
    riskScore += 25;
  }
  
  return {
    riskScore: Math.min(riskScore, 100),
    flags,
    isSuspicious: riskScore > 50,
  };
}

/**
 * Compare two faces for similarity (placeholder for actual ML model)
 */
export function compareFaces(face1Data: string, face2Data: string): {
  similarity: number;
  isMatch: boolean;
  confidence: number;
} {
  // In production, this would call a real face recognition API
  // For now, return mock data
  const similarity = Math.random() * 100;
  const threshold = 85;
  
  return {
    similarity,
    isMatch: similarity > threshold,
    confidence: similarity,
  };
}

