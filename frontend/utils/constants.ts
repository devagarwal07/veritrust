// Application Constants

export const APP_NAME = 'VeriTrust+';
export const APP_DESCRIPTION = 'Decentralized Trust & Credit Verification System';

// Credit Score Ranges
export const CREDIT_SCORE_RANGES = {
  EXCELLENT: { min: 750, max: 850, label: 'Excellent', color: 'text-green-600' },
  GOOD: { min: 700, max: 749, label: 'Good', color: 'text-blue-600' },
  FAIR: { min: 650, max: 699, label: 'Fair', color: 'text-yellow-600' },
  POOR: { min: 550, max: 649, label: 'Poor', color: 'text-orange-600' },
  VERY_POOR: { min: 300, max: 549, label: 'Very Poor', color: 'text-red-600' },
};

// KYC Document Types
export const DOCUMENT_TYPES = {
  PASSPORT: 'passport',
  DRIVERS_LICENSE: 'drivers_license',
  NATIONAL_ID: 'national_id',
  SELFIE: 'selfie',
} as const;

// Verification Statuses
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

// Fraud Detection Flags
export const FRAUD_FLAGS = {
  DOCUMENT_MISMATCH: 'document_mismatch',
  FACE_MISMATCH: 'face_mismatch',
  SYNTHETIC_IDENTITY: 'synthetic_identity',
  DUPLICATE_IDENTITY: 'duplicate_identity',
  TAMPERED_DOCUMENT: 'tampered_document',
} as const;

// Credit Factors
export const CREDIT_FACTORS = [
  { id: 'payment_history', label: 'Payment History', weight: 0.35 },
  { id: 'credit_utilization', label: 'Credit Utilization', weight: 0.30 },
  { id: 'credit_age', label: 'Credit History Length', weight: 0.15 },
  { id: 'credit_mix', label: 'Credit Mix', weight: 0.10 },
  { id: 'new_credit', label: 'New Credit Inquiries', weight: 0.10 },
];

// Blockchain Networks
export const SUPPORTED_CHAINS = {
  POLYGON_MUMBAI: {
    id: 80001,
    name: 'Polygon Mumbai',
    rpc: 'https://rpc-mumbai.maticvigil.com',
    explorer: 'https://mumbai.polygonscan.com',
  },
  POLYGON_MAINNET: {
    id: 137,
    name: 'Polygon Mainnet',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  VERIFY_FACE: '/api/verify-face',
  VERIFY_DOCUMENT: '/api/verify-document',
  CALCULATE_CREDIT: '/api/calculate-credit',
  STORE_BLOCKCHAIN: '/api/store-blockchain',
  GET_USER_DATA: '/api/user',
  GET_ANALYTICS: '/api/analytics',
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

// Dashboard Chart Colors
export const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

