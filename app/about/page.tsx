import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Comparison
      </Link>

      <h1 className="text-4xl font-bold text-slate-900 mb-8">About the Data</h1>

      {/* Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Tool Does</h2>
        <p className="text-slate-700 mb-4">
          School Reality Check is a free, independent tool that helps homebuyers compare Central Ohio school districts using official public data. Unlike rating sites that rely on subjective reviews or proprietary scoring, we show you the raw numbers from government sources so you can make your own decisions.
        </p>
        <p className="text-slate-700">
          Our goal is simple: make school district comparison transparent, data-driven, and useful for the biggest decision many families make — where to buy a home.
        </p>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Official Data Sources</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">NCES Common Core of Data (CCD)</h3>
            <p className="text-sm text-slate-600 mb-2">
              School year 2023-24. The nation's primary database on public elementary and secondary education.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">What we extract:</span> School names, addresses, grade levels, enrollment counts, demographic breakdowns (race/ethnicity).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">F-33 School District Finance Survey</h3>
            <p className="text-sm text-slate-600 mb-2">
              Fiscal year 2021-22 (most recent available). Annual financial data from all public school districts.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">What we extract:</span> Total revenue, revenue sources (local/state/federal), total expenditures, instructional spending, per-pupil expenditure.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">County Auditor Property Tax Data</h3>
            <p className="text-sm text-slate-600 mb-2">
              Delaware and Franklin County Auditor offices, effective rates as of 2024.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">What we show:</span> Effective millage rates (after House Bill 920 reductions), estimated annual taxes on a $300k home.
            </p>
          </div>
        </div>
      </div>

      {/* What We Don't Show Yet */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Coming Soon</h2>
        <p className="text-slate-700 mb-4">We're actively working to add:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li><span className="font-medium">Test scores and performance ratings</span> from state report cards</li>
          <li><span className="font-medium">Graduation rates</span> (4-year and 5-year cohorts)</li>
          <li><span className="font-medium">Student-teacher ratios</span> at the school level</li>
          <li><span className="font-medium">Free/reduced lunch percentages</span> as a proxy for household income</li>
          <li><span className="font-medium">AP/IB course offerings</span> and college readiness metrics</li>
        </ul>
      </div>

      {/* Important Limitations */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Important Limitations</h2>
        <ul className="space-y-3 text-slate-700">
          <li>
            <span className="font-semibold">Financial data has an 18-month lag.</span> The most recent F-33 data is from fiscal year 2021-22, published in late 2023. This is normal for government datasets.
          </li>
          <li>
            <span className="font-semibold">Per-pupil spending is district-level only.</span> Public datasets don't break down spending by individual school. The per-pupil number is an average across the entire district.
          </li>
          <li>
            <span className="font-semibold">Property tax estimates are approximations.</span> Actual property taxes depend on your home's assessed value, exemptions, and voter-approved levies. Use our estimates as a starting point, then verify with the county auditor.
          </li>
          <li>
            <span className="font-semibold">We show data, not ratings.</span> We don't assign letter grades, star ratings, or "best district" rankings. Numbers don't tell the full story — visit schools, talk to parents, and decide what matters most to your family.
          </li>
        </ul>
      </div>

      {/* Why We Built This */}
      <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Why We Built This</h2>
        <p className="text-slate-700 mb-4">
          When buying a home, school district is often the deciding factor. But the data is scattered across dozens of websites, PDFs, and state portals. Rating sites use opaque formulas. District websites bury financial information.
        </p>
        <p className="text-slate-700 mb-4">
          We wanted something simple: show the official numbers, cite the sources, explain the limitations, and let families decide for themselves.
        </p>
        <p className="text-slate-700">
          This is an independent, volunteer project. We have no affiliation with any school district, real estate company, or government agency. All data is publicly available, and we cite our sources.
        </p>
      </div>

      {/* Contact */}
      <div className="bg-slate-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Feedback & Questions</h2>
        <p className="text-slate-700 mb-4">
          See incorrect data? Have suggestions for metrics we should add? Want to expand this to other Ohio districts?
        </p>
        <p className="text-slate-700">
          This is a work in progress. We're committed to accuracy, transparency, and continuous improvement.
        </p>
      </div>
    </div>
  );
}
