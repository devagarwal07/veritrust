import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are not set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface UserVerification {
  id: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'verified' | 'rejected';
  document_type: string;
  document_url?: string;
  selfie_url?: string;
  face_match_score?: number;
  fraud_flags?: string[];
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditReport {
  id: string;
  user_id: string;
  credit_score: number;
  grade: string;
  risk_level: 'low' | 'medium' | 'high';
  factors: any;
  recommendations: string[];
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface FraudAlert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: any;
  resolved: boolean;
  created_at: string;
}

// Supabase Helper Functions

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
}

/**
 * Create or update user verification record
 */
export async function upsertVerification(
  verification: Partial<UserVerification>
): Promise<{ data: UserVerification | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('verifications')
      .upsert(verification)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get user verification status
 */
export async function getUserVerification(
  userId: string
): Promise<{ data: UserVerification | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Save credit report
 */
export async function saveCreditReport(
  report: Partial<CreditReport>
): Promise<{ data: CreditReport | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('credit_reports')
      .insert(report)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get latest credit report for user
 */
export async function getUserCreditReport(
  userId: string
): Promise<{ data: CreditReport | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('credit_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Create fraud alert
 */
export async function createFraudAlert(
  alert: Partial<FraudAlert>
): Promise<{ data: FraudAlert | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('fraud_alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get fraud alerts for user
 */
export async function getUserFraudAlerts(
  userId: string
): Promise<{ data: FraudAlert[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('fraud_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics() {
  try {
    const [verificationsResult, creditsResult, alertsResult] = await Promise.all([
      supabase
        .from('verifications')
        .select('status, created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('credit_reports')
        .select('credit_score, grade, created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('fraud_alerts')
        .select('severity, alert_type, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    return {
      verifications: verificationsResult.data || [],
      credits: creditsResult.data || [],
      alerts: alertsResult.data || [],
      error: null,
    };
  } catch (error) {
    return {
      verifications: [],
      credits: [],
      alerts: [],
      error: error as Error,
    };
  }
}

