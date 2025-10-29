'use client';

import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({ size = 'md', text, fullScreen = false }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && (
        <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton Loader Component
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer bg-slate-200 dark:bg-slate-800 rounded ${className}`}
    />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="glass-effect rounded-xl p-6 space-y-4">
      <SkeletonLoader className="h-6 w-1/3" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-2/3" />
      <SkeletonLoader className="h-32 w-full" />
    </div>
  );
}

