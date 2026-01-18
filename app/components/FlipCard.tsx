'use client';

import { useState } from 'react';
import Link from 'next/link';

interface District {
  leaid: string;
  name: string;
  location: string | null;
  perPupilExpenditure: number | null;
  pctFromLocalTax: number | null;
  localRevenue: number | null;
  stateRevenue: number | null;
  federalRevenue: number | null;
  totalRevenue: number | null;
  schoolCount: number;
}

interface FlipCardProps {
  district: District;
  color: 'blue' | 'green';
}

export default function FlipCard({ district, color }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-green-50';
  const isOlentangy = district.leaid === '3904676';

  return (
    <div className="relative h-[650px]" style={{ perspective: '1000px' }}>
      <div
        className={`relative w-full h-full transition-transform duration-700 cursor-pointer`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT OF CARD */}
        <div
          className="absolute w-full h-full bg-white rounded-lg border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="p-8 h-full flex flex-col">
            {/* Flip Hint at Top */}
            <div className="text-right text-xs text-slate-400 mb-4">
              💡 Click to see how we calculated this
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {district.name}
              </h2>
              <p className="text-slate-600">{district.location || 'Central Ohio'}</p>
            </div>

            <div className={`${bgColor} rounded-lg p-6 mb-6 flex-1`}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-600 uppercase font-medium mb-1">Per Student</div>
                  <div className="text-3xl font-bold text-slate-900">
                    ${district.perPupilExpenditure?.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">annual spending</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 uppercase font-medium mb-1">From Local Tax</div>
                  <div className="text-3xl font-bold text-slate-900">
                    {district.pctFromLocalTax?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">property taxes</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-xs text-slate-600 uppercase font-medium mb-3">Revenue Sources</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Local (Property Tax)</span>
                    <span className="font-semibold text-slate-900">
                      ${(district.localRevenue! / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">State</span>
                    <span className="font-semibold text-slate-900">
                      ${(district.stateRevenue! / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Federal</span>
                    <span className="font-semibold text-slate-900">
                      ${(district.federalRevenue! / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Estimated Property Tax Rate</div>
                <div className="text-lg font-bold text-slate-900">
                  {isOlentangy ? '~53.7 mills' : '~60-65 mills'}
                </div>
                <div className="text-xs text-slate-500">
                  {isOlentangy ? 'Delaware County (lower taxes)' : 'Franklin County (higher taxes)'}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Total Schools</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {district.schoolCount}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Total Budget</div>
                  <div className="text-lg font-bold text-slate-900">
                    ${(district.totalRevenue! / 1000000).toFixed(0)}M
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/districts/${district.leaid}`}
              className="block w-full bg-slate-900 text-white text-center py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View All Schools →
            </Link>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div
          className="absolute w-full h-full bg-slate-900 text-white rounded-lg border-2 border-slate-700 shadow-md"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="p-8 h-full overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">How We Calculated This</h3>
              <p className="text-slate-300 text-sm">All data from official government sources</p>
            </div>

            {/* Per-Pupil Spending Explanation */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <div className="text-lg font-semibold mb-3 text-blue-400">
                💰 Per-Student Spending: ${district.perPupilExpenditure?.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300 space-y-2">
                <p><span className="font-semibold text-white">What this means:</span> The district spends this amount per student per year on education.</p>
                <p><span className="font-semibold text-white">Calculation:</span> Total Expenditure ÷ Total Students</p>
                <p><span className="font-semibold text-white">Source:</span> NCES F-33 School District Finance Survey FY 2021-22</p>
              </div>
            </div>

            {/* Revenue Sources Explanation */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <div className="text-lg font-semibold mb-3 text-green-400">
                📊 Revenue Sources (Total: ${(district.totalRevenue! / 1000000).toFixed(0)}M)
              </div>
              <div className="text-sm text-slate-300 space-y-3">
                <div>
                  <div className="font-semibold text-white">Local Property Tax: ${(district.localRevenue! / 1000000).toFixed(1)}M ({district.pctFromLocalTax?.toFixed(1)}%)</div>
                  <p className="text-xs">Money from YOUR property taxes in the district</p>
                </div>
                <div>
                  <div className="font-semibold text-white">State Funding: ${(district.stateRevenue! / 1000000).toFixed(1)}M</div>
                  <p className="text-xs">Money from Ohio state government</p>
                </div>
                <div>
                  <div className="font-semibold text-white">Federal Funding: ${(district.federalRevenue! / 1000000).toFixed(1)}M</div>
                  <p className="text-xs">Money from US federal programs</p>
                </div>
                <p className="text-xs italic pt-2">Source: NCES F-33 Survey FY 2021-22</p>
              </div>
            </div>

            {/* Property Tax Rate Explanation */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <div className="text-lg font-semibold mb-3 text-yellow-400">
                🏡 Property Tax Rate: {isOlentangy ? '~53.7 mills' : '~60-65 mills'}
              </div>
              <div className="text-sm text-slate-300 space-y-2">
                <p><span className="font-semibold text-white">What this means:</span> For every $1,000 of assessed home value, you pay ${isOlentangy ? '53.70' : '60-65'} in taxes.</p>
                <p><span className="font-semibold text-white">Example for $600k home:</span></p>
                <div className="bg-slate-800 p-3 rounded text-xs space-y-1 font-mono">
                  <div>Market Value: $600,000</div>
                  <div>Assessed Value (35%): $210,000</div>
                  <div>Tax Rate: {isOlentangy ? '1.48%' : '1.64%'}</div>
                  <div className="font-bold text-yellow-300">Annual Tax: ~${isOlentangy ? '6,200' : '7,100'}</div>
                </div>
                <p className="text-xs italic pt-2">Source: {isOlentangy ? 'Delaware' : 'Franklin'} County Auditor (2024 estimates)</p>
              </div>
            </div>

            {/* Click to flip back */}
            <div className="text-center">
              <button className="text-sm text-slate-400 hover:text-white transition-colors">
                Click to flip back 🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
