import Link from 'next/link';
import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import FilterableSchoolList from '@/app/components/FilterableSchoolList';

async function getDistrictData(leaid: string) {
  try {
    const [district] = await db
      .select()
      .from(schema.districts)
      .where(eq(schema.districts.leaid, leaid));

    if (!district) {
      return null;
    }

    // Get schools WITH enrollment data joined
    const schools = await db
      .select({
        school: schema.schools,
        enrollment: schema.schoolEnrollment,
      })
      .from(schema.schools)
      .leftJoin(
        schema.schoolEnrollment,
        eq(schema.schools.ncessch, schema.schoolEnrollment.ncessch)
      )
      .where(eq(schema.schools.leaid, leaid));

    // Get other districts for comparison navigation
    const allDistricts = await db.select().from(schema.districts);
    const otherDistricts = allDistricts.filter(d => d.leaid !== leaid);

    return { district, schools, otherDistricts };
  } catch (error) {
    console.error('Error fetching district data:', error);
    return null;
  }
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ leaid: string }>;
}) {
  const { leaid } = await params;
  const data = await getDistrictData(leaid);

  if (!data) {
    notFound();
  }

  const { district, schools, otherDistricts } = data;
  const isOlentangy = district.leaid === '3904676';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/#comparison"
          className="inline-flex items-center text-slate-600 hover:text-slate-900"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to District Comparison
        </Link>

        {otherDistricts.length > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-slate-500 mr-2">Switch to:</span>
            {otherDistricts.map((otherDistrict) => (
              <Link
                key={otherDistrict.leaid}
                href={`/districts/${otherDistrict.leaid}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {otherDistrict.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* District Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border-2 border-blue-200 p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-16 bg-blue-600 rounded-full"></div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">{district.name}</h1>
            <p className="text-slate-600 mt-1">
              Browse all {schools.length} schools and add up to 3 to compare side-by-side
            </p>
          </div>
        </div>

        {/* District-Wide Ratings */}
        {district.overallRating && (
          <div className="mt-6 pt-6 border-t border-blue-100">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">District Rating</div>
                <div className="text-3xl">
                  {'⭐'.repeat(district.overallRating)}
                </div>
                <div className="text-sm text-slate-600 mt-1">{district.overallRating}-Star Overall</div>
              </div>
              {district.achievementScore && (
                <div>
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">Achievement</div>
                  <div className="text-3xl font-bold text-slate-900">{district.achievementScore}%</div>
                </div>
              )}
              {district.graduationRate4yr && (
                <div>
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">Graduation Rate</div>
                  <div className="text-3xl font-bold text-slate-900">{district.graduationRate4yr}%</div>
                </div>
              )}
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Property Tax</div>
                <div className="text-2xl font-bold text-slate-900">
                  ${isOlentangy ? '4,440' : '5,904'}/yr
                </div>
                <div className="text-xs text-slate-500">for $600k home</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Helpful Tip */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
        <div className="flex gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How to Use This Page:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Use the filters below to find schools by grade level (Elementary, Middle, High)</li>
              <li>2. Click <strong>"+ Add to Compare"</strong> on schools you're interested in (max 3)</li>
              <li>3. Once you've added 2-3 schools, click the blue button in the bottom-right corner</li>
              <li>4. See your schools side-by-side with property tax estimates for each area!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Filterable School List */}
      <FilterableSchoolList
        schools={schools}
        district={{
          name: district.name,
          leaid: district.leaid,
        }}
      />

      {/* Data Note */}
      <div className="mt-12 p-6 bg-slate-100 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-2">About This Data</h3>
        <p className="text-sm text-slate-600">
          School information is sourced from the NCES Common Core of Data (CCD) for school year 2023-24.
          Property tax estimates are based on county auditor data and vary by city/township within the district.
          All schools in this district are rated {district.overallRating}-star by the Ohio Department of Education (2024).
        </p>
      </div>
    </div>
  );
}
