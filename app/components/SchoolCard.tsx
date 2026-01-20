'use client';

import { useComparison } from '@/lib/context/ComparisonContext';

interface SchoolCardProps {
  school: {
    ncessch: string;
    name: string;
    leaid: string;
    schoolType: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    gradesLow: string | null;
    gradesHigh: string | null;
  };
  district: {
    name: string;
    leaid: string;
  };
  enrollment?: {
    totalStudents: number | null;
    pctWhite: number | null;
    pctBlack: number | null;
    pctHispanic: number | null;
    pctAsian: number | null;
    pctOther: number | null;
    studentTeacherRatio: number | null;
    pctFrl: number | null;
  } | null;
}

export default function SchoolCard({ school, district, enrollment }: SchoolCardProps) {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const inComparison = isInComparison(school.ncessch);

  const handleToggleComparison = () => {
    if (inComparison) {
      removeFromComparison(school.ncessch);
    } else {
      addToComparison({
        ncessch: school.ncessch,
        name: school.name,
        leaid: school.leaid,
        districtName: district.name,
        schoolType: school.schoolType,
        address: school.address,
        city: school.city,
        state: school.state,
        zip: school.zip,
        gradesLow: school.gradesLow,
        gradesHigh: school.gradesHigh,
      });
    }
  };

  const isOlentangy = district.leaid === '3904676';

  return (
    <div className={`bg-white rounded-lg border-2 ${inComparison ? 'border-blue-500 shadow-lg' : 'border-slate-200'} p-6 hover:border-blue-400 transition-all relative`}>
      {/* Add to Compare Button - Top Right */}
      <button
        onClick={handleToggleComparison}
        className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-medium transition-all ${
          inComparison
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 border border-slate-300'
        }`}
      >
        {inComparison ? (
          <>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              In Comparison
            </span>
          </>
        ) : (
          '+ Add to Compare'
        )}
      </button>

      <h4 className="text-lg font-semibold text-slate-900 mb-1 pr-36">
        {school.name}
      </h4>

      {/* School Address */}
      <div className="text-sm text-slate-600 mb-4">
        📍 {school.address}, {school.city}, OH {school.zip}
      </div>

      {/* Key Stats */}
      {enrollment && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-600 text-xs font-medium uppercase">Students</div>
              <div className="text-2xl font-bold text-slate-900">
                {enrollment.totalStudents?.toLocaleString()}
              </div>
            </div>
            {enrollment.studentTeacherRatio && (
              <div>
                <div className="text-slate-600 text-xs font-medium uppercase">Student:Teacher</div>
                <div className="text-2xl font-bold text-slate-900">
                  {enrollment.studentTeacherRatio.toFixed(1)}:1
                </div>
              </div>
            )}
            {enrollment.pctFrl !== null && (
              <div>
                <div className="text-slate-600 text-xs font-medium uppercase">Free/Reduced Lunch</div>
                <div className="text-lg font-semibold text-slate-900">
                  {enrollment.pctFrl.toFixed(1)}%
                </div>
              </div>
            )}
            <div>
              <div className="text-slate-600 text-xs font-medium uppercase">Diversity</div>
              <div className="text-lg font-semibold text-slate-900">
                {((enrollment.pctBlack || 0) + (enrollment.pctHispanic || 0) + (enrollment.pctOther || 0)).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Tax Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="text-xs text-amber-900 font-semibold uppercase mb-2">
          💰 Property Tax for $600k Home Near This School
        </div>

        <div className="text-sm text-amber-950">
          {isOlentangy ? (
            school.city === 'Powell' ? (
              <>
                <div className="font-bold text-2xl mb-1">~$6,200-6,500<span className="text-base text-slate-600">/year</span></div>
                <div className="text-xs text-amber-700">Delaware County • Powell city services</div>
              </>
            ) : school.city === 'Lewis Center' ? (
              <>
                <div className="font-bold text-2xl mb-1">~$5,900-6,200<span className="text-base text-slate-600">/year</span></div>
                <div className="text-xs text-amber-700">Delaware County • Unincorporated (lower taxes)</div>
              </>
            ) : school.city === 'Galena' ? (
              <>
                <div className="font-bold text-2xl mb-1 text-green-700">~$5,700-5,900<span className="text-base text-slate-600">/year</span></div>
                <div className="text-xs text-green-700 font-semibold">LOWEST in Olentangy • Rural area</div>
              </>
            ) : (
              <>
                <div className="font-bold text-2xl mb-1">~$4,200-4,400<span className="text-base text-slate-600">/year</span></div>
                <div className="text-xs text-amber-700">Delaware County (Olentangy Schools)</div>
              </>
            )
          ) : (
            school.zip === '43016' ? (
              <>
                <div className="font-bold text-2xl mb-1 text-red-700">~$7,100-7,500<span className="text-base text-slate-600">/year</span></div>
                <div className="text-xs text-red-700 font-semibold">HIGHEST in Dublin • Extensive services</div>
              </>
            ) : school.zip === '43081' ? (
              <>
                <div className="font-bold text-2xl mb-1 text-green-700">~$6,500-6,900<span className="text-base text-slate-600">/year</span></div>
                <div className="text-xs text-green-700 font-semibold">LOWEST in Dublin • Delaware County portion</div>
              </>
            ) : (
              <>
                <div className="font-bold text-2xl mb-1">~$6,900-7,300<span className="text-base text-slate-600">/year</span></div>
                <div className="text-xs text-amber-700">Franklin County (Dublin Schools)</div>
              </>
            )
          )}
        </div>
      </div>

      {/* Grades */}
      {school.gradesLow && school.gradesHigh && (
        <div className="mt-4 text-sm">
          <span className="text-slate-500">Grades:</span>{' '}
          <span className="text-slate-900 font-medium">
            {school.gradesLow} - {school.gradesHigh}
          </span>
        </div>
      )}
    </div>
  );
}
