// Global type definitions for the application

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
  createdAt: Date;
}

export interface Verification {
  id: string;
  userId: string;
  status: 'pending' | 'in_progress' | 'verified' | 'rejected';
  documentType: string;
  documentUrl?: string;
  selfieUrl?: string;
  faceMatchScore?: number;
  fraudFlags?: string[];
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditReport {
  id: string;
  userId: string;
  creditScore: number;
  grade: string;
  riskLevel: 'low' | 'medium' | 'high';
  factors: CreditFactor[];
  recommendations: string[];
  blockchainHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditFactor {
  name: string;
  score: number;
  impact: 'positive' | 'neutral' | 'negative';
  weight: number;
}

export interface FraudAlert {
  id: string;
  userId: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: any;
  resolved: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  verifications: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  credits: {
    total: number;
    averageScore: number;
    distribution: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
      veryPoor: number;
    };
  };
  alerts: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface BlockchainTransaction {
  transactionHash: string;
  blockNumber?: number;
  from: string;
  to: string;
  timestamp: number;
}

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
}

