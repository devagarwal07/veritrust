import axios, { AxiosError } from 'axios';
import { CreditData } from '@/utils/scoring';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface FaceVerificationResult {
  isMatch: boolean;
  similarity: number;
  confidence: number;
  fraudFlags?: string[];
}

export interface DocumentVerificationResult {
  isValid: boolean;
  documentType: string;
  extractedData: {
    name?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    expiryDate?: string;
  };
  fraudFlags?: string[];
}

export interface CreditScoreResult {
  score: number;
  grade: string;
  factors: any[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Verify face match between selfie and ID
 */
export async function verifyFaceMatch(
  selfieFile: File,
  idPhotoFile: File
): Promise<ApiResponse<FaceVerificationResult>> {
  try {
    const formData = new FormData();
    formData.append('selfie', selfieFile);
    formData.append('idPhoto', idPhotoFile);

    const response = await apiClient.post('/verify-face', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      data: response.data,
      error: null,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: null,
      error: axiosError.message || 'Face verification failed',
      success: false,
    };
  }
}

/**
 * Verify document authenticity
 */
export async function verifyDocument(
  documentFile: File,
  documentType: string
): Promise<ApiResponse<DocumentVerificationResult>> {
  try {
    const formData = new FormData();
    formData.append('document', documentFile);
    formData.append('documentType', documentType);

    const response = await apiClient.post('/verify-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      data: response.data,
      error: null,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: null,
      error: axiosError.message || 'Document verification failed',
      success: false,
    };
  }
}

/**
 * Calculate credit score
 */
export async function calculateCreditScore(
  creditData: CreditData
): Promise<ApiResponse<CreditScoreResult>> {
  try {
    const response = await apiClient.post('/calculate-credit', creditData);

    return {
      data: response.data,
      error: null,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: null,
      error: axiosError.message || 'Credit score calculation failed',
      success: false,
    };
  }
}

/**
 * Store verification on blockchain
 */
export async function storeOnBlockchain(data: {
  userAddress: string;
  documentHash: string;
  creditScore: number;
  grade: string;
}): Promise<ApiResponse<{ transactionHash: string }>> {
  try {
    const response = await apiClient.post('/store-blockchain', data);

    return {
      data: response.data,
      error: null,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: null,
      error: axiosError.message || 'Blockchain storage failed',
      success: false,
    };
  }
}

/**
 * Get user data
 */
export async function getUserData(userId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.get(`/user/${userId}`);

    return {
      data: response.data,
      error: null,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: null,
      error: axiosError.message || 'Failed to fetch user data',
      success: false,
    };
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.get('/analytics');

    return {
      data: response.data,
      error: null,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: null,
      error: axiosError.message || 'Failed to fetch analytics',
      success: false,
    };
  }
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

