'use client';

export default function NewLandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Buying a Home in Columbus?
            </h1>
            <p className="text-2xl md:text-3xl font-medium mb-8 text-blue-100">
              Stop Picking Schools Based on<br />
              Realtor Recommendations Alone.
            </p>
          </div>

          {/* The Problem */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Here's What Usually Happens:</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💰</div>
                  <div>
                    <p className="font-semibold mb-1">You tell your realtor your budget</p>
                    <p className="text-blue-100 text-sm">"We can spend up to $600k"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🏘️</div>
                  <div>
                    <p className="font-semibold mb-1">They show you homes in "good" districts</p>
                    <p className="text-blue-100 text-sm">"Dublin and Olentangy are both great!"</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🤷</div>
                  <div>
                    <p className="font-semibold mb-1">You buy without understanding the difference</p>
                    <p className="text-blue-100 text-sm">No data, just trust the hype</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">😱</div>
                  <div>
                    <p className="font-semibold mb-1">Property tax bill arrives</p>
                    <p className="text-blue-100 text-sm">"$5,900/year?! I had no idea!"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Solution */}
          <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">What if you could:</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <p className="text-lg">Compare <strong>ACTUAL school quality</strong> (not just ratings)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <p className="text-lg">See <strong>EXACTLY</strong> what your property tax pays for</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <p className="text-lg">Find <strong>SAME quality</strong> schools for <strong>LESS money</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <p className="text-lg">Make decisions based on <strong>DATA, not hype</strong></p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="#comparison"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                See The Real Comparison
              </a>
              <p className="text-sm text-slate-500 mt-3">Free • No Sign-Up Required • Real Data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="text-6xl">"</div>
              <div>
                <p className="text-xl text-slate-700 mb-4 italic">
                  I was about to buy a $600k home in Dublin until School Reality Check showed me
                  Olentangy had the <strong>SAME 5-star rating</strong> for <strong>$1,500/year less</strong> in
                  property taxes. That's <strong className="text-green-600">$27,000 saved over 18 years!</strong>
                </p>
                <p className="font-semibold text-slate-900">— Sarah M., Powell, OH</p>
                <p className="text-sm text-slate-500">First-time homebuyer, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-blue-600">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Real Data</h3>
              <p className="text-slate-600">
                We pull official data from NCES (National Center for Education Statistics)
                and Ohio Department of Education
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-green-600">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Clear Comparisons</h3>
              <p className="text-slate-600">
                See side-by-side what you're paying for: test scores, graduation rates,
                per-pupil spending, property taxes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-purple-600">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Make Smart Decisions</h3>
              <p className="text-slate-600">
                Understand the value you're getting. Same quality for less cost?
                We'll show you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Why Trust School Reality Check?
          </h2>
          <p className="text-center text-slate-300 mb-12 text-lg max-w-3xl mx-auto">
            Unlike other school rating sites, we're built by parents FOR parents.
            No realtor bias. No affiliate links. Just honest data.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-blue-400">📊 Official Sources Only</h3>
              <p className="text-slate-300">
                Every number comes from government sources: NCES, Ohio Dept of Education,
                County Auditors. No estimates. No guesses.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-green-400">💡 Transparent Calculations</h3>
              <p className="text-slate-300">
                We show you HOW we calculated everything. Flip any card to see the math.
                No black box algorithms.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-purple-400">🎯 Value-Focused</h3>
              <p className="text-slate-300">
                We don't just show you "good" schools. We show you the BEST VALUE:
                same quality for less money.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">🚫 No Hidden Agenda</h3>
              <p className="text-slate-300">
                We're not paid by realtors. No ads. No affiliate commissions.
                Built by a parent who was frustrated with the lack of honest data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Smarter Decision?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            See the real comparison between Olentangy and Dublin schools.
            You might be surprised.
          </p>
          <a
            href="#comparison"
            className="inline-block bg-white text-blue-600 hover:bg-slate-100 font-bold text-xl px-12 py-5 rounded-lg shadow-2xl hover:shadow-xl transition-all transform hover:scale-105"
          >
            Show Me The Data
          </a>
        </div>
      </section>
    </div>
  );
}
