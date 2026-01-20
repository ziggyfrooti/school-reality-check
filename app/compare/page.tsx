'use client';

import { useComparison } from '@/lib/context/ComparisonContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EnrollmentData {
  totalStudents: number | null;
  studentTeacherRatio: number | null;
  pctFrl: number | null;
  pctWhite: number | null;
  pctBlack: number | null;
  pctHispanic: number | null;
  pctAsian: number | null;
  pctOther: number | null;
}

interface DistrictData {
  perPupilExpenditure: number | null;
}

interface SchoolData {
  enrollment: EnrollmentData | null;
  district: DistrictData | null;
}

export default function ComparePage() {
  const { comparisonSchools, removeFromComparison, clearComparison } = useComparison();
  const [mounted, setMounted] = useState(false);
  const [schoolData, setSchoolData] = useState<Record<string, SchoolData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch detailed data for all comparison schools
  useEffect(() => {
    if (comparisonSchools.length === 0) {
      setLoading(false);
      return;
    }

    const fetchSchoolData = async () => {
      setLoading(true);
      const data: Record<string, SchoolData> = {};

      for (const school of comparisonSchools) {
        try {
          const response = await fetch(`/api/schools/${school.ncessch}`);
          if (response.ok) {
            const schoolDetails = await response.json();
            data[school.ncessch] = schoolDetails;
          }
        } catch (error) {
          console.error(`Failed to fetch data for ${school.ncessch}:`, error);
          data[school.ncessch] = { enrollment: null, district: null };
        }
      }

      setSchoolData(data);
      setLoading(false);
    };

    fetchSchoolData();
  }, [comparisonSchools]);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  if (comparisonSchools.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-6xl mb-6">📋</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            No Schools Selected for Comparison
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Browse schools in Olentangy or Dublin districts and click <strong>"+ Add to Compare"</strong> on the schools you're interested in.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/districts/3904676"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Browse Olentangy Schools
            </Link>
            <Link
              href="/districts/3904702"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Browse Dublin Schools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Determine if schools are from same or different districts
  const districts = [...new Set(comparisonSchools.map(s => s.districtName))];
  const mixedDistricts = districts.length > 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              School Comparison
            </h1>
            <p className="text-slate-600">
              Comparing {comparisonSchools.length} {comparisonSchools.length === 1 ? 'school' : 'schools'}
              {mixedDistricts && ' from different districts'}
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Clear all schools from comparison?')) {
                clearComparison();
              }
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Add More Schools Tip */}
        {comparisonSchools.length < 4 && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
            <p className="text-sm text-blue-800">
              💡 You can add up to {4 - comparisonSchools.length} more {comparisonSchools.length === 3 ? 'school' : 'schools'}.
              <Link href="/districts/3904676" className="underline ml-2 font-medium">Browse Olentangy</Link> or
              <Link href="/districts/3904702" className="underline ml-2 font-medium">Browse Dublin</Link>
            </p>
          </div>
        )}

        {/* Understanding the Metrics */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mt-4">
          <h3 className="font-semibold text-slate-900 mb-3">📊 Understanding the Metrics</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <span className="font-medium text-slate-900">Free/Reduced Lunch %:</span> Percentage of students whose families qualify for subsidized meals based on income.
              <strong className="text-slate-900"> Lower % = more affluent area.</strong> For example, 1-5% means almost all families are high-income, while 40%+ indicates many lower-income families.
            </div>
            <div>
              <span className="font-medium text-slate-900">Student:Teacher Ratio:</span> Number of students per teacher.
              <strong className="text-slate-900"> Lower ratio = smaller class sizes</strong> and typically more individualized attention for each student.
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid gap-6 mb-12 ${
        comparisonSchools.length === 2 ? 'md:grid-cols-2' :
        comparisonSchools.length === 3 ? 'md:grid-cols-3' :
        comparisonSchools.length === 4 ? 'md:grid-cols-4' : ''
      }`}>
        {comparisonSchools.map((school) => {
          const isOlentangy = school.leaid === '3904676';
          const data = schoolData[school.ncessch];
          const enrollment = data?.enrollment;
          const district = data?.district;

          // Estimate property tax based on city
          let taxEstimate = '~$4,200-4,400';
          let taxNote = 'Delaware County (Olentangy)';

          if (isOlentangy) {
            if (school.city === 'Powell') {
              taxEstimate = '~$6,200-6,500';
              taxNote = 'Delaware County • Powell';
            } else if (school.city === 'Lewis Center') {
              taxEstimate = '~$5,900-6,200';
              taxNote = 'Delaware County • Lewis Center';
            } else if (school.city === 'Galena') {
              taxEstimate = '~$5,700-5,900';
              taxNote = 'LOWEST in Olentangy • Rural';
            }
          } else {
            // Dublin
            if (school.zip === '43016') {
              taxEstimate = '~$7,100-7,500';
              taxNote = 'HIGHEST in Dublin • Washington Twp';
            } else if (school.zip === '43081') {
              taxEstimate = '~$6,500-6,900';
              taxNote = 'LOWEST in Dublin • Delaware portion';
            } else {
              taxEstimate = '~$6,900-7,300';
              taxNote = 'Franklin County (Dublin)';
            }
          }

          return (
            <div key={school.ncessch} className="bg-white rounded-lg border-2 border-blue-500 shadow-lg p-6 relative">
              {/* Remove Button */}
              <button
                onClick={() => removeFromComparison(school.ncessch)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                title="Remove from comparison"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* School Name */}
              <h2 className="text-xl font-bold text-slate-900 mb-1 pr-8">
                {school.name}
              </h2>

              {/* District Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  isOlentangy
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {school.districtName}
                </span>
              </div>

              {/* Address */}
              <div className="text-sm text-slate-600 mb-6">
                📍 {school.address}<br/>
                {school.city}, {school.state} {school.zip}
              </div>

              {/* Grades */}
              {school.gradesLow && school.gradesHigh && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">Grades</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {school.gradesLow} - {school.gradesHigh}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{school.schoolType}</div>
                </div>
              )}

              {/* School Size & Class Size */}
              {loading ? (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 animate-pulse">
                  <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-blue-200 rounded w-1/2"></div>
                </div>
              ) : enrollment && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {enrollment.totalStudents && (
                      <div>
                        <div className="text-xs text-blue-900 uppercase font-medium mb-1">
                          Total Students
                        </div>
                        <div className="text-2xl font-bold text-blue-950">
                          {enrollment.totalStudents.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {enrollment.studentTeacherRatio && (
                      <div>
                        <div className="text-xs text-blue-900 uppercase font-medium mb-1">
                          Student:Teacher
                        </div>
                        <div className="text-2xl font-bold text-blue-950">
                          {enrollment.studentTeacherRatio.toFixed(1)}:1
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Diversity */}
              {!loading && enrollment && (enrollment.pctWhite || enrollment.pctBlack || enrollment.pctHispanic || enrollment.pctAsian) && (
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <div className="text-xs text-purple-900 uppercase font-medium mb-2">
                    Student Diversity
                  </div>
                  <div className="space-y-1 text-sm">
                    {enrollment.pctWhite !== null && (
                      <div className="flex justify-between">
                        <span className="text-purple-800">White</span>
                        <span className="font-semibold text-purple-950">{enrollment.pctWhite.toFixed(1)}%</span>
                      </div>
                    )}
                    {enrollment.pctAsian !== null && (
                      <div className="flex justify-between">
                        <span className="text-purple-800">Asian</span>
                        <span className="font-semibold text-purple-950">{enrollment.pctAsian.toFixed(1)}%</span>
                      </div>
                    )}
                    {enrollment.pctHispanic !== null && (
                      <div className="flex justify-between">
                        <span className="text-purple-800">Hispanic</span>
                        <span className="font-semibold text-purple-950">{enrollment.pctHispanic.toFixed(1)}%</span>
                      </div>
                    )}
                    {enrollment.pctBlack !== null && (
                      <div className="flex justify-between">
                        <span className="text-purple-800">Black</span>
                        <span className="font-semibold text-purple-950">{enrollment.pctBlack.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Economic Demographics */}
              {!loading && enrollment && enrollment.pctFrl !== null && enrollment.pctFrl !== undefined && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="text-xs text-green-900 uppercase font-medium mb-1">
                    Free/Reduced Lunch
                  </div>
                  <div className="text-2xl font-bold text-green-950">
                    {enrollment.pctFrl.toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    {enrollment.pctFrl < 10
                      ? 'Very affluent area - mostly high-income families'
                      : enrollment.pctFrl < 25
                      ? 'Mixed-income community'
                      : 'Higher proportion of lower-income families'}
                  </div>
                </div>
              )}

              {/* Per-Pupil Spending */}
              {!loading && district?.perPupilExpenditure && (
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <div className="text-xs text-indigo-900 uppercase font-medium mb-1">
                    Per-Pupil Spending
                  </div>
                  <div className="text-2xl font-bold text-indigo-950">
                    ${district.perPupilExpenditure.toLocaleString()}
                  </div>
                  <div className="text-xs text-indigo-700 mt-1">
                    District average (2023-24)
                  </div>
                </div>
              )}

              {/* Property Tax - THE KEY INFO FOR HUSBAND */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                <div className="text-xs text-amber-900 font-semibold uppercase mb-2">
                  💰 Est. Property Tax ($600k Home)
                </div>
                <div className="text-3xl font-bold text-amber-950 mb-2">
                  {taxEstimate}<span className="text-lg text-slate-600">/year</span>
                </div>
                <div className="text-xs text-amber-700">
                  {taxNote}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Bottom Line - Wife & Husband Summary */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center">💡 The Bottom Line</h2>

        {comparisonSchools.length >= 2 && (
          <div className="space-y-6">
            {/* Quality Comparison */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-blue-300">For the Wife (Quality):</h3>
              <p className="text-slate-200 mb-2">
                All schools shown are from {districts.length === 1 ? districts[0] : 'different 5-star rated districts'}.
              </p>
              {mixedDistricts ? (
                <p className="text-slate-200">
                  ⭐⭐⭐⭐⭐ Both Olentangy and Dublin are excellent 5-star districts with similar academic quality.
                  Your choice depends on location and cost preferences.
                </p>
              ) : (
                <p className="text-slate-200">
                  ⭐⭐⭐⭐⭐ All schools are in the same 5-star district, so quality is consistent.
                  Focus on location and property tax differences.
                </p>
              )}
            </div>

            {/* Cost Comparison */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-green-300">For the Husband (Cost):</h3>
              <div className="space-y-3">
                {comparisonSchools.map((school, index) => {
                  const isOlentangy = school.leaid === '3904676';
                  let annualTax = 4400; // default

                  if (isOlentangy) {
                    if (school.city === 'Powell') annualTax = 6350;
                    else if (school.city === 'Lewis Center') annualTax = 6050;
                    else if (school.city === 'Galena') annualTax = 5800;
                  } else {
                    if (school.zip === '43016') annualTax = 7300;
                    else if (school.zip === '43081') annualTax = 6700;
                    else annualTax = 7100;
                  }

                  return (
                    <div key={school.ncessch} className="flex justify-between items-center">
                      <span className="text-slate-300">{index + 1}. {school.name.substring(0, 30)}...</span>
                      <span className="font-bold text-white">${annualTax.toLocaleString()}/year</span>
                    </div>
                  );
                })}
              </div>

              {comparisonSchools.length >= 2 && (() => {
                const taxes = comparisonSchools.map(school => {
                  const isOlentangy = school.leaid === '3904676';
                  if (isOlentangy) {
                    if (school.city === 'Powell') return 6350;
                    if (school.city === 'Lewis Center') return 6050;
                    if (school.city === 'Galena') return 5800;
                    return 4400;
                  } else {
                    if (school.zip === '43016') return 7300;
                    if (school.zip === '43081') return 6700;
                    return 7100;
                  }
                });
                const minTax = Math.min(...taxes);
                const maxTax = Math.max(...taxes);
                const savingsPerYear = maxTax - minTax;
                const savingsOver18Years = savingsPerYear * 18;

                return savingsPerYear > 0 ? (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-yellow-300 font-semibold text-lg">
                      💰 Savings if you choose the lowest-tax option:
                    </p>
                    <p className="text-white text-2xl font-bold mt-2">
                      ${savingsPerYear.toLocaleString()}/year = ${savingsOver18Years.toLocaleString()} over 18 years!
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Single School */}
        {comparisonSchools.length === 1 && (
          <div className="text-center text-slate-300">
            <p>Add at least one more school to see the comparison and potential savings!</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Link
          href="/districts/3904676"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Add More from Olentangy
        </Link>
        <Link
          href="/districts/3904702"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Add More from Dublin
        </Link>
      </div>
    </div>
  );
}
