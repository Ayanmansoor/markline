'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Client Error:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-20 bg-secondary">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="text-sm text-gray-600">
          We encountered a temporary issue while loading this page. Please try again or return to the home page.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-xs"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-gray-100 text-gray-800 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors border border-gray-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
