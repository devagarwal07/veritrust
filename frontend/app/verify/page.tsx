'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import UploadBox from '@/components/UploadBox';
import Loader from '@/components/Loader';
import Webcam from './webcam';
import { verifyFaceMatch, verifyDocument } from '@/lib/api';
import { uploadFile, upsertVerification } from '@/lib/supabaseClient';
import { DOCUMENT_TYPES } from '@/utils/constants';

type Step = 'select-document' | 'upload-id' | 'take-selfie' | 'processing' | 'result';

export default function VerifyPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<Step>('select-document');
  const [documentType, setDocumentType] = useState<string>('');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const documentTypes = [
    { value: DOCUMENT_TYPES.PASSPORT, label: 'Passport', icon: '🛂' },
    { value: DOCUMENT_TYPES.DRIVERS_LICENSE, label: 'Driver\'s License', icon: '🪪' },
    { value: DOCUMENT_TYPES.NATIONAL_ID, label: 'National ID', icon: '🆔' },
  ];

  const handleDocumentTypeSelect = (type: string) => {
    setDocumentType(type);
    setStep('upload-id');
  };

  const handleIdUpload = (file: File) => {
    setIdFile(file);
  };

  const handleSelfieCapture = (file: File) => {
    setSelfieFile(file);
    setShowWebcam(false);
  };

  const handleVerification = async () => {
    if (!user || !idFile || !selfieFile) {
      setError('Please complete all steps before verification');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('processing');

    try {
      // Upload files to Supabase
      const [idUpload, selfieUpload] = await Promise.all([
        uploadFile('documents', `${user.id}/id_${Date.now()}.jpg`, idFile),
        uploadFile('documents', `${user.id}/selfie_${Date.now()}.jpg`, selfieFile),
      ]);

      if (idUpload.error || selfieUpload.error) {
        throw new Error('Failed to upload files');
      }

      // Verify document
      const documentResult = await verifyDocument(idFile, documentType);

      if (!documentResult.success || !documentResult.data) {
        throw new Error(documentResult.error || 'Document verification failed');
      }

      // Verify face match
      const faceResult = await verifyFaceMatch(selfieFile, idFile);

      if (!faceResult.success || !faceResult.data) {
        throw new Error(faceResult.error || 'Face verification failed');
      }

      // Store verification in database
      const verification = await upsertVerification({
        user_id: user.id,
        status: faceResult.data.isMatch ? 'verified' : 'rejected',
        document_type: documentType,
        document_url: idUpload.url,
        selfie_url: selfieUpload.url,
        face_match_score: faceResult.data.similarity,
        fraud_flags: faceResult.data.fraudFlags || [],
        verified_at: faceResult.data.isMatch ? new Date().toISOString() : undefined,
      });

      if (verification.error) {
        throw new Error('Failed to save verification');
      }

      // Update Clerk metadata
      if (faceResult.data.isMatch) {
        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            kycVerified: true,
          },
        });
      }

      setVerificationResult({
        success: faceResult.data.isMatch,
        similarity: faceResult.data.similarity,
        confidence: faceResult.data.confidence,
        fraudFlags: faceResult.data.fraudFlags,
        documentData: documentResult.data.extractedData,
      });

      setStep('result');
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Verification failed. Please try again.');
      setStep('upload-id');
    } finally {
      setLoading(false);
    }
  };

  if (showWebcam) {
    return (
      <Webcam
        onCapture={handleSelfieCapture}
        onClose={() => setShowWebcam(false)}
      />
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Identity Verification
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Verify your identity with AI-powered KYC
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {['Document', 'Upload ID', 'Selfie', 'Verify'].map((label, index) => {
              const currentStepIndex = ['select-document', 'upload-id', 'take-selfie', 'processing'].indexOf(step);
              const isActive = index <= currentStepIndex;
              const isComplete = index < currentStepIndex;

              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isComplete ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className="text-xs mt-2 text-slate-600 dark:text-slate-400">
                      {label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        isComplete
                          ? 'bg-green-500'
                          : isActive
                          ? 'bg-primary-600'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          {/* Step 1: Select Document Type */}
          {step === 'select-document' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Select Document Type
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {documentTypes.map((doc) => (
                  <button
                    key={doc.value}
                    onClick={() => handleDocumentTypeSelect(doc.value)}
                    className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all card-hover"
                  >
                    <div className="text-4xl mb-3">{doc.icon}</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {doc.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Upload ID */}
          {step === 'upload-id' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Upload Your {documentTypes.find((d) => d.value === documentType)?.label}
              </h2>
              <UploadBox
                onFileSelect={handleIdUpload}
                label="Document Photo"
                description="Upload a clear photo of your document"
              />
              {idFile && (
                <button
                  onClick={() => setStep('take-selfie')}
                  className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Next: Take Selfie</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Step 3: Take Selfie */}
          {step === 'take-selfie' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Take a Selfie
              </h2>
              
              {!selfieFile ? (
                <div>
                  <div className="mb-6">
                    <button
                      onClick={() => setShowWebcam(true)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-12 rounded-xl font-semibold flex flex-col items-center justify-center space-y-3 transition-colors"
                    >
                      <Camera className="w-12 h-12" />
                      <span>Open Camera</span>
                    </button>
                  </div>
                  <div className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Or upload a selfie
                  </div>
                  <UploadBox
                    onFileSelect={setSelfieFile}
                    label=""
                    description="Upload a clear selfie"
                  />
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <img
                      src={URL.createObjectURL(selfieFile)}
                      alt="Selfie"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelfieFile(null)}
                      className="flex-1 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Retake
                    </button>
                    <button
                      onClick={handleVerification}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                    >
                      <span>Verify Identity</span>
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <Loader size="lg" text="Verifying your identity..." />
            </div>
          )}

          {/* Step 5: Result */}
          {step === 'result' && verificationResult && (
            <div>
              <div className="text-center mb-8">
                {verificationResult.success ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Verification Successful!
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                      Your identity has been verified
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Verification Failed
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                      Please try again
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">
                    Face Match Score
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {verificationResult.similarity.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Confidence</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {verificationResult.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>

              {verificationResult.success && (
                <button
                  onClick={() => router.push('/credit')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Continue to Credit Evaluation</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {!verificationResult.success && (
                <button
                  onClick={() => {
                    setStep('select-document');
                    setIdFile(null);
                    setSelfieFile(null);
                    setVerificationResult(null);
                  }}
                  className="w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

