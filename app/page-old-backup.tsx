import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import FlipCard from './components/FlipCard';
import HomePageWrapper from './components/HomePageWrapper';

async function getDistrictComparison() {
  try {
    // Get both districts with ALL data including finance
    const [olentangy] = await db.select().from(schema.districts).where(eq(schema.districts.leaid, '3904676'));
    const [dublin] = await db.select().from(schema.districts).where(eq(schema.districts.leaid, '3904702'));

    // Count schools for each district
    const olentangySchools = await db.select({ count: count() })
      .from(schema.schools)
      .where(eq(schema.schools.leaid, '3904676'));

    const dublinSchools = await db.select({ count: count() })
      .from(schema.schools)
      .where(eq(schema.schools.leaid, '3904702'));

    return {
      olentangy: {
        ...olentangy,
        schoolCount: olentangySchools[0]?.count || 0,
      },
      dublin: {
        ...dublin,
        schoolCount: dublinSchools[0]?.count || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching district data:', error);
    return null;
  }
}

export default async function Home() {
  const data = await getDistrictComparison();

  if (!data || !data.olentangy || !data.dublin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Data Not Available</h1>
          <p className="text-slate-600 mb-8">
            Please run <code className="bg-slate-100 px-2 py-1 rounded">npm run seed-real</code> to populate the database.
          </p>
        </div>
      </div>
    );
  }

  const { olentangy, dublin } = data;

  return (
    <HomePageWrapper>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Buying a home often means<br />choosing a school district.
        </h1>
        <p className="text-xl text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed">
          But the data is scattered across multiple websites, outdated, and confusing.
        </p>
        <p className="text-xl text-slate-900 font-medium max-w-3xl mx-auto">
          This web app brings official public school data into one clear, honest comparison.
        </p>
      </section>

      {/* Financial Comparison - THE GAME CHANGER */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          The Real Question: Are Higher Taxes Worth It?
        </h2>
        <p className="text-slate-600 text-center mb-8 max-w-3xl mx-auto">
          Both districts rely heavily on local property taxes. Here's what you're actually paying for.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Olentangy Column */}
          <div className="space-y-10">
            <FlipCard district={olentangy} color="blue" />

            {/* Olentangy Bottom Line */}
            <div className="bg-slate-900 text-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3 text-blue-400">The Bottom Line: Olentangy</h3>
              <div className="text-sm space-y-3">
                <p className="text-slate-300">
                  Spends <span className="font-bold text-white">$16,456 per student</span> <span className="text-xs text-slate-400">(FY 2021-22)</span> with high efficiency.
                  Still well-funded, competitive spending levels.
                </p>
                <p className="text-slate-300">
                  Property tax rate: <span className="font-bold text-white">~53.7 mills</span> <span className="text-xs text-slate-400">(2024)</span> in Delaware County.
                  Lower tax burden while maintaining solid per-pupil investment.
                </p>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Lower taxes, strong spending.</span> Great value if you prioritize tax savings while still getting quality education funding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dublin Column */}
          <div className="space-y-10">
            <FlipCard district={dublin} color="green" />

            {/* Dublin Bottom Line */}
            <div className="bg-slate-900 text-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3 text-green-400">The Bottom Line: Dublin</h3>
              <div className="text-sm space-y-3">
                <p className="text-slate-300">
                  Spends <span className="font-bold text-white">$17,437 per student</span> <span className="text-xs text-slate-400">(FY 2021-22)</span> (6% more than Olentangy).
                  That's nearly $1,000 more per student annually.
                </p>
                <p className="text-slate-300">
                  Property tax rate: <span className="font-bold text-white">~60-65 mills</span> <span className="text-xs text-slate-400">(2024)</span> in Franklin County.
                  You'll pay more in taxes for potentially better-funded schools.
                </p>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Premium spending, premium taxes.</span> Higher investment per student—check test scores to see if it translates to better outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Note */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-slate-700 text-center">
            <span className="font-semibold text-slate-900">Both districts are heavily funded by YOUR property taxes</span> (79-82% local funding).
            The real question: Does Dublin's extra $1,000 per student translate to better outcomes for your kids?
            Check graduation rates, test scores, and college placement data to decide if the tax premium is worth it.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-center">🚀 Coming Soon</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold mb-2 text-blue-300">More Districts</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Westerville City Schools</li>
                <li>• Worthington City Schools</li>
                <li>• Upper Arlington City Schools</li>
                <li>• New Albany-Plain Local Schools</li>
                <li>• Hilliard City Schools</li>
                <li>• Gahanna-Jefferson Schools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-300">More Data</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Ohio Report Card grades (A-F)</li>
                <li>• Graduation rates</li>
                <li>• College enrollment rates</li>
                <li>• Student-teacher ratios</li>
                <li>• Test scores & performance index</li>
                <li>• Special education services</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center mt-6">
            We're actively working on adding more districts and comprehensive school performance data. Check back soon!
          </p>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-16 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            What makes this different?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Official Data Only</h3>
              <p className="text-sm text-slate-600">
                NCES Common Core of Data. No opinions, no ratings from us.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Real School Names</h3>
              <p className="text-sm text-slate-600">
                Actual schools from federal education database, not mock data.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Clear Limitations</h3>
              <p className="text-sm text-slate-600">
                This is V1. More metrics coming as we parse additional datasets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-12">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Data Sources</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-semibold text-slate-900 mb-2">School Directory & Enrollment</div>
              <p className="text-slate-600">
                NCES Common Core of Data (CCD) 2023-24. Covers {olentangy.schoolCount + dublin.schoolCount} schools across both districts.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">Financial Data</div>
              <p className="text-slate-600">
                F-33 School District Finance Survey 2021-22. Revenue, expenditure, and per-pupil spending.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">Property Tax Estimates</div>
              <p className="text-slate-600">
                Delaware and Franklin County Auditor data. Effective millage rates as of 2024.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">What's Next</div>
              <p className="text-slate-600">
                Adding test scores, graduation rates, student-teacher ratios, and free/reduced lunch data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </HomePageWrapper>
  );
}
