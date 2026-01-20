import Link from 'next/link';
import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

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

    // Group schools by type
    const schoolsByType = schools.reduce((acc, row) => {
      const type = row.school.schoolType || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(row);
      return acc;
    }, {} as Record<string, typeof schools>);

    return { district, schools, schoolsByType, otherDistricts };
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

  const { district, schools, schoolsByType, otherDistricts } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Comparison
        </Link>

        {otherDistricts.length > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-slate-500 mr-2">Compare with:</span>
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
          <h1 className="text-4xl font-bold text-slate-900">{district.name}</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-slate-500 mb-1">Location</div>
            <div className="text-slate-900 font-medium">{district.location || 'N/A'}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Phone</div>
            <div className="text-slate-900 font-medium">{district.phone || 'N/A'}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">NCES ID</div>
            <div className="text-slate-900 font-mono">{district.leaid}</div>
          </div>
        </div>
        {district.website && (
          <a
            href={district.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Visit District Website →
          </a>
        )}

        {/* KEY DISTRICT METRICS */}
        {district.perPupilExpenditure && (
          <div className="mt-6 pt-6 border-t border-blue-100">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Per-Pupil Spending</div>
                <div className="text-2xl font-bold text-slate-900">
                  ${district.perPupilExpenditure.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Property Tax Rate</div>
                <div className="text-2xl font-bold text-slate-900">
                  {district.leaid === '3904676' ? '~53.7' : '~60-65'} mills
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">From Local Taxes</div>
                <div className="text-2xl font-bold text-slate-900">
                  {district.pctFromLocalTax?.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Total Budget</div>
                <div className="text-2xl font-bold text-slate-900">
                  ${(district.totalRevenue! / 1000000).toFixed(0)}M
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schools Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          All Schools ({schools.length})
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(schoolsByType).map(([type, typeSchools]) => (
            <div key={type} className="bg-slate-100 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">{type}</div>
              <div className="text-2xl font-bold text-slate-900">{typeSchools.length}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Schools List by Type */}
      {Object.entries(schoolsByType)
        .sort(([typeA], [typeB]) => {
          const order = ['Elementary', 'Middle', 'High', 'Other'];
          return order.indexOf(typeA) - order.indexOf(typeB);
        })
        .map(([type, typeSchools]) => (
          <div key={type} className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {type} Schools ({typeSchools.length})
            </h3>
            <div className="grid gap-4">
              {typeSchools.map((row) => {
                const school = row.school;
                const enrollment = row.enrollment;
                return (
                  <div
                    key={school.ncessch}
                    className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-400 transition-colors"
                  >
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">
                      {school.name}
                    </h4>

                    {/* School Address - right under name so it's clearly the school's address */}
                    <div className="text-sm text-slate-600 mb-4">
                      📍 {school.address}, {school.city}, OH {school.zip}
                    </div>

                    {/* Key Stats - What Homeowners Care About */}
                    {enrollment && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-slate-600 text-xs font-medium uppercase">Students</div>
                            <div className="text-2xl font-bold text-slate-900">
                              {enrollment.totalStudents?.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 text-xs font-medium uppercase">White</div>
                            <div className="text-lg font-semibold text-slate-900">
                              {enrollment.pctWhite?.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 text-xs font-medium uppercase">Asian</div>
                            <div className="text-lg font-semibold text-slate-900">
                              {enrollment.pctAsian?.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 text-xs font-medium uppercase">Diverse</div>
                            <div className="text-lg font-semibold text-slate-900">
                              {((enrollment.pctBlack || 0) + (enrollment.pctHispanic || 0) + (enrollment.pctOther || 0)).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Property Tax Info - KEY for homebuyers */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="text-xs text-amber-900 font-semibold uppercase mb-3">
                            💰 Property Tax for Homes Near This School
                          </div>

                          <div className="text-sm text-amber-950">
                            {district.leaid === '3904676' ? (
                              // Olentangy schools - vary by city
                              school.city === 'Powell' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$6,200-6,500<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home in Powell
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Delaware County • Powell city services
                                  </div>
                                </>
                              ) : school.city === 'Lewis Center' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$5,900-6,200<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home in Lewis Center
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Delaware County • Unincorporated (lower taxes)
                                  </div>
                                </>
                              ) : school.city === 'Westerville' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$6,300-6,700<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home in Westerville
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Delaware/Franklin County border • City services
                                  </div>
                                </>
                              ) : school.city === 'Galena' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2 text-green-700">~$5,700-5,900<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-green-700 mb-2 font-semibold">
                                    Estimated annual property tax on a $600k home in Galena • LOWEST in Olentangy
                                  </div>
                                  <div className="text-xs text-green-800 bg-green-100 rounded px-2 py-1 inline-block">
                                    Delaware County • Rural area (minimal city services)
                                  </div>
                                </>
                              ) : school.city === 'Delaware' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$4,400-4,600<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home in Delaware
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Delaware County • County seat
                                  </div>
                                </>
                              ) : school.city === 'Lewis' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$4,200-4,400<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home in Lewis
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Delaware County • Berkshire Township
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$4,200-4,400<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Delaware County (Olentangy Schools)
                                  </div>
                                </>
                              )
                            ) : (
                              // Dublin schools - vary by zip/area within Franklin County
                              school.zip === '43016' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2 text-red-700">~$7,100-7,500<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-red-700 mb-2 font-semibold">
                                    Estimated annual property tax on a $600k home • HIGHEST in Dublin
                                  </div>
                                  <div className="text-xs text-red-800 bg-red-100 rounded px-2 py-1 inline-block">
                                    Franklin County • Washington Township • Extensive city services
                                  </div>
                                </>
                              ) : school.zip === '43017' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$6,900-7,200<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home in Dublin
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Franklin County • Jerome Township
                                  </div>
                                </>
                              ) : school.zip === '43081' ? (
                                <>
                                  <div className="font-bold text-3xl mb-2 text-green-700">~$6,500-6,900<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-green-700 mb-2 font-semibold">
                                    Estimated annual property tax on a $600k home • LOWEST in Dublin
                                  </div>
                                  <div className="text-xs text-green-800 bg-green-100 rounded px-2 py-1 inline-block">
                                    Delaware County portion of Dublin
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="font-bold text-3xl mb-2">~$6,900-7,300<span className="text-lg text-slate-600">/year</span></div>
                                  <div className="text-xs text-amber-800 mb-2">
                                    Estimated annual property tax on a $600k home in Dublin
                                  </div>
                                  <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 inline-block">
                                    Franklin County (Dublin Schools)
                                  </div>
                                </>
                              )
                            )}
                          </div>
                          <div className="mt-3 pt-3 border-t border-amber-200">
                            <p className="text-xs text-amber-600 italic">
                              Tax rates vary by county, township, city, and school district - not by individual school.
                              All homes in {school.city} (ZIP {school.zip}) with {district.name} pay similar rates.
                              These are estimates based on county averages. Verify exact amount with county auditor.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basic School Info */}
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {school.gradesLow && school.gradesHigh && (
                        <div>
                          <div className="text-slate-500">Grades</div>
                          <div className="text-slate-900 font-medium">
                            {school.gradesLow} - {school.gradesHigh}
                          </div>
                        </div>
                      )}
                      {school.address && (
                        <div>
                          <div className="text-slate-500">Address</div>
                          <div className="text-slate-900">
                            {school.city}, {school.state} {school.zip}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-slate-500">NCES ID</div>
                        <div className="text-slate-900 font-mono text-xs">
                          {school.ncessch}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Data Note */}
      <div className="mt-12 p-6 bg-slate-100 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-2">About This Data</h3>
        <p className="text-sm text-slate-600">
          School information is sourced from the NCES Common Core of Data (CCD) for school year 2023-24.
          This includes basic directory information such as school names, addresses, and grade levels.
          Additional metrics (enrollment, demographics, achievement data) will be added in future updates.
        </p>
      </div>
    </div>
  );
}
