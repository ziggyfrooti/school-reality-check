'use client';

import { useComparison } from '@/lib/context/ComparisonContext';
import Link from 'next/link';

export default function ComparisonBadge() {
  const { comparisonSchools } = useComparison();

  if (comparisonSchools.length === 0) {
    return null;
  }

  return (
    <Link
      href="/compare"
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-3 transition-all transform hover:scale-105"
    >
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="font-semibold">
          Comparing {comparisonSchools.length} {comparisonSchools.length === 1 ? 'School' : 'Schools'}
        </span>
      </div>
      <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
        {comparisonSchools.length}
      </div>
    </Link>
  );
}
