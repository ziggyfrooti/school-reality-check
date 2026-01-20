'use client';

import { useState } from 'react';
import SchoolCard from './SchoolCard';

interface School {
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
}

interface Enrollment {
  totalStudents: number | null;
  pctWhite: number | null;
  pctBlack: number | null;
  pctHispanic: number | null;
  pctAsian: number | null;
  pctOther: number | null;
  studentTeacherRatio: number | null;
  pctFrl: number | null;
}

interface FilterableSchoolListProps {
  schools: Array<{
    school: School;
    enrollment: Enrollment | null;
  }>;
  district: {
    name: string;
    leaid: string;
  };
}

type FilterType = 'All' | 'Elementary' | 'Middle' | 'High';

export default function FilterableSchoolList({ schools, district }: FilterableSchoolListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Group schools by type
  const schoolsByType = schools.reduce((acc, row) => {
    const type = row.school.schoolType || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(row);
    return acc;
  }, {} as Record<string, typeof schools>);

  // Filter schools based on active filter
  const filteredSchools = activeFilter === 'All'
    ? schools
    : schools.filter(row => row.school.schoolType === activeFilter);

  const counts = {
    All: schools.length,
    Elementary: schoolsByType['Elementary']?.length || 0,
    Middle: schoolsByType['Middle']?.length || 0,
    High: schoolsByType['High']?.length || 0,
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        {(['All', 'Elementary', 'Middle', 'High'] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeFilter === filter
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {filter}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
              activeFilter === filter
                ? 'bg-white/20'
                : 'bg-slate-100'
            }`}>
              {counts[filter]}
            </span>
          </button>
        ))}
      </div>

      {/* School Count */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          {activeFilter === 'All' ? 'All Schools' : `${activeFilter} Schools`}
          <span className="text-slate-500 ml-3">({filteredSchools.length})</span>
        </h3>
        {activeFilter !== 'All' && (
          <p className="text-slate-600 mt-1">
            Showing {activeFilter.toLowerCase()} schools in {district.name}
          </p>
        )}
      </div>

      {/* Schools Grid */}
      <div className="grid gap-6">
        {filteredSchools.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">
              No {activeFilter.toLowerCase()} schools found in this district.
            </p>
          </div>
        ) : (
          filteredSchools.map((row) => (
            <SchoolCard
              key={row.school.ncessch}
              school={row.school}
              district={district}
              enrollment={row.enrollment}
            />
          ))
        )}
      </div>
    </div>
  );
}
