'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, FileCheck, AlertCircle } from 'lucide-react';
import { UPLOAD_LIMITS } from '@/utils/constants';

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  label?: string;
  description?: string;
  preview?: boolean;
}

export default function UploadBox({
  onFileSelect,
  acceptedTypes = UPLOAD_LIMITS.ACCEPTED_IMAGE_TYPES,
  maxSize = UPLOAD_LIMITS.MAX_FILE_SIZE,
  label = 'Upload File',
  description = 'Drag and drop or click to select',
  preview = true,
}: UploadBoxProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return `File size exceeds ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(selectedFile);
    onFileSelect(selectedFile);

    // Generate preview for images
    if (preview && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
            : error
            ? 'border-red-300 bg-red-50 dark:bg-red-950/20'
            : file
            ? 'border-green-300 bg-green-50 dark:bg-green-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-primary-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          id={`file-upload-${label}`}
        />

        {!file ? (
          <label
            htmlFor={`file-upload-${label}`}
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
          >
            <Upload
              className={`w-12 h-12 mb-3 ${
                isDragging
                  ? 'text-primary-500'
                  : error
                  ? 'text-red-500'
                  : 'text-slate-400'
              }`}
            />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {description}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Max size: {maxSize / (1024 * 1024)}MB
            </p>
          </label>
        ) : (
          <div className="p-6">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileCheck className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

