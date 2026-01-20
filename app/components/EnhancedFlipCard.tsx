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
  overallRating?: number | null;
  achievementScore?: number | null;
  graduationRate4yr?: number | null;
  mathProficiency?: number | null;
  readingProficiency?: number | null;
}

interface FlipCardProps {
  district: District;
  color: 'blue' | 'green';
}

export default function EnhancedFlipCard({ district, color }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-green-50';
  const isOlentangy = district.leaid === '3904676';

  // Render stars
  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="relative h-[750px]" style={{ perspective: '1000px' }}>
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

            {/* NEW: Ohio Report Card Rating */}
            {district.overallRating && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-slate-600 uppercase font-medium mb-2">
                    Ohio Report Card 2024
                  </div>
                  <div className="text-4xl mb-2">
                    {renderStars(district.overallRating)}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-3">
                    {district.overallRating}-Star Overall Rating
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {district.achievementScore && (
                      <div>
                        <div className="text-slate-600">Achievement</div>
                        <div className="font-bold text-lg text-slate-900">{district.achievementScore}%</div>
                      </div>
                    )}
                    {district.graduationRate4yr && (
                      <div>
                        <div className="text-slate-600">Graduation</div>
                        <div className="font-bold text-lg text-slate-900">{district.graduationRate4yr}%</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* NEW: Test Scores */}
            {(district.mathProficiency || district.readingProficiency) && (
              <div className="mb-6">
                <div className="text-xs text-slate-600 uppercase font-medium mb-3">
                  Student Proficiency (2024)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {district.mathProficiency && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Math</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {district.mathProficiency}%
                      </div>
                      <div className="text-xs text-slate-500 mt-1">proficient</div>
                    </div>
                  )}
                  {district.readingProficiency && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Reading</div>
                      <div className="text-3xl font-bold text-green-600">
                        {district.readingProficiency}%
                      </div>
                      <div className="text-xs text-slate-500 mt-1">proficient</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`${bgColor} rounded-lg p-6 mb-6 flex-1`}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-600 uppercase font-medium mb-1">Per Student</div>
                  <div className="text-3xl font-bold text-slate-900">
                    ${district.perPupilExpenditure?.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">annual spending <span className="text-xs text-slate-400">(FY 2021-22)</span></div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 uppercase font-medium mb-1">Property Tax</div>
                  <div className="text-3xl font-bold text-slate-900">
                    {district.pctFromLocalTax?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">of funding</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Est. Annual Tax ($600k home)</div>
                <div className="text-2xl font-bold text-slate-900">
                  ~${isOlentangy ? '4,440' : '5,904'}
                </div>
                <div className="text-xs text-slate-500">
                  {isOlentangy ? 'Delaware County (1.48%)' : 'Franklin County (1.64%)'}
                </div>
              </div>
            </div>

            <Link
              href={`/districts/${district.leaid}`}
              className="block w-full bg-slate-900 text-white text-center py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View All {district.schoolCount} Schools →
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

            {/* Ohio Report Card Explanation */}
            {district.overallRating && (
              <div className="mb-6 pb-6 border-b border-slate-700">
                <div className="text-lg font-semibold mb-3 text-yellow-400">
                  ⭐ Ohio Report Card: {district.overallRating}-Star Rating
                </div>
                <div className="text-sm text-slate-300 space-y-2">
                  <p><span className="font-semibold text-white">What this means:</span> The Ohio Department of Education rates all schools on a 1-5 star scale based on student achievement, progress, and college readiness.</p>
                  <p><span className="font-semibold text-white">Achievement Score:</span> {district.achievementScore}% (measuring test performance vs state standards)</p>
                  <p><span className="font-semibold text-white">Graduation Rate:</span> {district.graduationRate4yr}% of students graduate within 4 years</p>
                  <p><span className="font-semibold text-white">Source:</span> Ohio School Report Cards 2023-24 school year</p>
                </div>
              </div>
            )}

            {/* Test Scores Explanation */}
            {(district.mathProficiency || district.readingProficiency) && (
              <div className="mb-6 pb-6 border-b border-slate-700">
                <div className="text-lg font-semibold mb-3 text-blue-400">
                  📊 Proficiency Rates
                </div>
                <div className="text-sm text-slate-300 space-y-2">
                  <p><span className="font-semibold text-white">What this means:</span> Percentage of students who score "proficient" or higher on Ohio State Tests.</p>
                  {district.mathProficiency && (
                    <p><span className="font-semibold text-white">Math:</span> {district.mathProficiency}% proficient (Ohio avg: ~65%)</p>
                  )}
                  {district.readingProficiency && (
                    <p><span className="font-semibold text-white">Reading:</span> {district.readingProficiency}% proficient (Ohio avg: ~72%)</p>
                  )}
                  <p className="text-xs italic pt-2">Source: Ohio Department of Education 2024</p>
                </div>
              </div>
            )}

            {/* Per-Pupil Spending Explanation */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <div className="text-lg font-semibold mb-3 text-green-400">
                💰 Per-Student Spending: ${district.perPupilExpenditure?.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300 space-y-2">
                <p><span className="font-semibold text-white">What this means:</span> The district spends this amount per student per year on education (teachers, books, facilities, etc.).</p>
                <p><span className="font-semibold text-white">Calculation:</span> Total Expenditure ÷ Total Students</p>
                <p><span className="font-semibold text-white">Source:</span> NCES F-33 School District Finance Survey FY 2021-22</p>
              </div>
            </div>

            {/* Property Tax Explanation */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <div className="text-lg font-semibold mb-3 text-purple-400">
                🏡 Property Tax: ~${isOlentangy ? '4,440' : '5,904'}/year
              </div>
              <div className="text-sm text-slate-300 space-y-2">
                <p><span className="font-semibold text-white">For a $600k home:</span></p>
                <div className="bg-slate-800 p-3 rounded text-xs space-y-1 font-mono">
                  <div>Market Value: $600,000</div>
                  <div>Assessed Value (35%): $210,000</div>
                  <div>County Rate: {isOlentangy ? '1.48%' : '1.64%'}</div>
                  <div className="font-bold text-purple-300">Annual Tax: ${isOlentangy ? '4,440' : '5,904'}</div>
                </div>
                <p className="text-xs italic pt-2">Source: {isOlentangy ? 'Delaware' : 'Franklin'} County Auditor 2024</p>
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
