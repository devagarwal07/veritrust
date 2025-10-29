'use client';

import { useRef, useState, useCallback } from 'react';
import ReactWebcam from 'react-webcam';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebcamProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function Webcam({ onCapture, onClose }: WebcamProps) {
  const webcamRef = useRef<ReactWebcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirm = async () => {
    if (capturedImage) {
      // Convert base64 to File
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `selfie_${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      onCapture(file);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="w-full max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Instructions */}
          <div className="p-6 bg-primary-600 text-white">
            <h2 className="text-2xl font-bold mb-2">Take Your Selfie</h2>
            <p className="text-sm text-primary-100">
              Position your face in the center and make sure it's well-lit
            </p>
          </div>

          {/* Camera View */}
          <div className="relative aspect-video bg-slate-900">
            {!capturedImage ? (
              <>
                <ReactWebcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                  mirrored={facingMode === 'user'}
                />

                {/* Face Guide Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-80 border-4 border-white/50 rounded-full" />
                </div>
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Controls */}
          <div className="p-6 space-y-4">
            {!capturedImage ? (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={toggleCamera}
                  className="p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                  title="Switch Camera"
                >
                  <RotateCcw className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </button>

                <button
                  onClick={capture}
                  className="p-6 bg-primary-600 hover:bg-primary-700 rounded-full transition-all hover:scale-105 shadow-lg"
                  title="Capture Photo"
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>

                <div className="w-16" /> {/* Spacer for symmetry */}
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={retake}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={confirm}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <Check className="w-5 h-5" />
                  <span>Use Photo</span>
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tips for best results:
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Face the camera directly</li>
                <li>• Remove glasses and hats</li>
                <li>• Ensure good lighting</li>
                <li>• Keep a neutral expression</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

