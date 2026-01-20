import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import EnhancedFlipCard from './components/EnhancedFlipCard';
import NewLandingPage from './components/NewLandingPage';
import HomePageWrapper from './components/HomePageWrapper';
import districtFeatures from '@/data/district-features.json';

async function getDistrictComparison() {
  try {
    // Get both districts with ALL data including new report card columns
    const districts = await db.select().from(schema.districts);

    const olentangy = districts.find(d => d.leaid === '3904676');
    const dublin = districts.find(d => d.leaid === '3904702');

    if (!olentangy || !dublin) {
      return null;
    }

    // Count schools for each district
    const olentangySchools = await db.select().from(schema.schools).where(eq(schema.schools.leaid, '3904676'));
    const dublinSchools = await db.select().from(schema.schools).where(eq(schema.schools.leaid, '3904702'));

    // Load features from JSON
    const olentangyFeatures = districtFeatures.districts.find(d => d.irn === '046763');
    const dublinFeatures = districtFeatures.districts.find(d => d.irn === '047027');

    return {
      olentangy: {
        ...olentangy,
        schoolCount: olentangySchools.length,
        features: olentangyFeatures,
      },
      dublin: {
        ...dublin,
        schoolCount: dublinSchools.length,
        features: dublinFeatures,
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
            Please run the data import scripts to populate the database.
          </p>
        </div>
      </div>
    );
  }

  const { olentangy, dublin } = data;

  // Calculate savings
  const olentangyTax = 4440; // $600k home
  const dublinTax = 5904; // $600k home
  const annualSavings = dublinTax - olentangyTax;
  const savingsOver18Years = annualSavings * 18;

  return (
    <HomePageWrapper>
      {/* NEW Landing Hero */}
      <NewLandingPage />

      {/* Comparison Section */}
      <section id="comparison" className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              The Real Comparison: Olentangy vs Dublin
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Both are excellent 5-star districts. But are you getting the best value for your money?
              Here's what the official data shows.
            </p>
          </div>

          {/* Side-by-Side Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Olentangy Column */}
            <div className="space-y-10">
              <EnhancedFlipCard district={olentangy} color="blue" />

              {/* Olentangy What Makes Us Different */}
              {olentangy.features && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-4 text-blue-600">
                    🔵 What Makes Olentangy Different
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-2">Strengths:</div>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {olentangy.features.strengths.map((strength: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-2">Special Programs:</div>
                      <div className="flex flex-wrap gap-2">
                        {olentangy.features.special_programs.slice(0, 4).map((program: string, i: number) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 pt-2 border-t">
                      Commute to downtown: {olentangy.features.commute_to_downtown}
                    </div>
                  </div>
                </div>
              )}

              {/* Olentangy Bottom Line */}
              <div className="bg-slate-900 text-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-blue-400">The Bottom Line: Olentangy</h3>
                <div className="text-sm space-y-3">
                  <p className="text-slate-300">
                    ⭐⭐⭐⭐⭐ <span className="font-bold text-white">5-star rating</span> - Largest 5-star district in Ohio
                  </p>
                  <p className="text-slate-300">
                    📊 <span className="font-bold text-white">94.9% achievement score</span>, 96.2% graduation rate
                  </p>
                  <p className="text-slate-300">
                    💰 <span className="font-bold text-white">$4,440/year</span> property tax ($600k home)
                  </p>
                  <p className="text-green-400 font-semibold pt-3 border-t border-slate-700">
                    ✅ BEST VALUE: Same quality, lower taxes!
                  </p>
                </div>
              </div>
            </div>

            {/* Dublin Column */}
            <div className="space-y-10">
              <EnhancedFlipCard district={dublin} color="green" />

              {/* Dublin What Makes Us Different */}
              {dublin.features && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-4 text-green-600">
                    🟢 What Makes Dublin Different
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-2">Strengths:</div>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {dublin.features.strengths.map((strength: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-2">Special Programs:</div>
                      <div className="flex flex-wrap gap-2">
                        {dublin.features.special_programs.slice(0, 4).map((program: string, i: number) => (
                          <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 pt-2 border-t">
                      Commute to downtown: {dublin.features.commute_to_downtown}
                    </div>
                  </div>
                </div>
              )}

              {/* Dublin Bottom Line */}
              <div className="bg-slate-900 text-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-green-400">The Bottom Line: Dublin</h3>
                <div className="text-sm space-y-3">
                  <p className="text-slate-300">
                    ⭐⭐⭐⭐⭐ <span className="font-bold text-white">5-star rating</span> - Established reputation
                  </p>
                  <p className="text-slate-300">
                    📊 <span className="font-bold text-white">89.4% achievement score</span>, 95.8% graduation rate
                  </p>
                  <p className="text-slate-300">
                    💰 <span className="font-bold text-white">$5,904/year</span> property tax ($600k home)
                  </p>
                  <p className="text-slate-400 pt-3 border-t border-slate-700">
                    Excellent quality, but $1,464/year more than Olentangy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* VALUE COMPARISON - THE GAME CHANGER! */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                💰 The Aha! Moment
              </h2>
              <p className="text-xl text-green-100">
                Both districts have the SAME 5-star rating. So what's the real difference?
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div className="text-center">
                  <div className="text-sm text-green-200 mb-2">Olentangy (5 stars)</div>
                  <div className="text-5xl font-bold mb-2">${olentangyTax.toLocaleString()}</div>
                  <div className="text-sm text-green-200">annual property tax</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-green-200 mb-2">Dublin (5 stars)</div>
                  <div className="text-5xl font-bold mb-2">${dublinTax.toLocaleString()}</div>
                  <div className="text-sm text-green-200">annual property tax</div>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-white/20">
                <div className="text-sm text-green-200 mb-2">Your Savings with Olentangy:</div>
                <div className="text-6xl font-bold mb-3 text-yellow-300">
                  ${annualSavings.toLocaleString()}
                </div>
                <div className="text-xl text-green-100">per year</div>
              </div>
            </div>

            <div className="bg-yellow-400 text-slate-900 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">
                  Over 18 years of K-12 education:
                </div>
                <div className="text-5xl font-bold mb-2">
                  ${savingsOver18Years.toLocaleString()}
                </div>
                <div className="text-sm">
                  That's enough for 4 years of college tuition at Ohio State!
                </div>
              </div>
            </div>

            <div className="text-center text-green-100">
              <p className="text-lg mb-6">
                Same 5-star quality. Lower taxes. That's the power of knowing the data.
              </p>
              <p className="text-sm">
                * Based on $600k home price, Delaware County (Olentangy) vs Franklin County (Dublin) property tax rates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">🚀 Coming Soon</h2>
            <p className="text-xl text-slate-600">
              We're expanding to help even more Central Ohio families
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">More Districts</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span> Worthington City Schools
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span> Upper Arlington City Schools
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span> Hilliard City Schools
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span> Westerville City Schools
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span> New Albany-Plain Local
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200">
              <h3 className="text-2xl font-bold mb-4 text-green-900">More Data & Tools</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span> Individual school pages
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span> Charter school comparisons
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span> Private school cost analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span> Personalized school matcher
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span> Neighborhood boundary maps
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </HomePageWrapper>
  );
}
