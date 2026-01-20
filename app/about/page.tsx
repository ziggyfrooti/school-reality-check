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
          School Reality Check helps families compare individual schools within Olentangy and Dublin school districts - two of Ohio's top-rated districts. The unique insight? <strong>Property taxes can vary by $1,500-2,000/year even within the same excellent school district</strong>, depending on which city or township you choose.
        </p>
        <p className="text-slate-700 mb-4">
          Unlike typical real estate searches (pick budget → realtor shows houses in that budget), this tool lets you:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4 ml-4">
          <li>Browse schools by grade level (Elementary, Middle, High)</li>
          <li>Compare up to 4 schools side-by-side</li>
          <li>See detailed metrics: enrollment size, student-teacher ratio, diversity, economic demographics</li>
          <li>View property tax estimates specific to each school's location</li>
          <li>Calculate potential savings over 18 years (K-12)</li>
        </ul>
        <p className="text-slate-700">
          <strong>Bottom line:</strong> Both districts are 5-star rated with excellent academics. The real difference is location and cost. This tool makes that transparent.
        </p>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Official Data Sources</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">NCES Common Core of Data (CCD)</h3>
            <p className="text-sm text-slate-600 mb-2">
              School year 2024-25. The nation's primary database on public elementary and secondary education.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">What we extract:</span> School names, addresses, grade levels, enrollment counts, student-teacher ratios, demographic breakdowns (race/ethnicity), Free/Reduced Lunch percentages.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Ohio School Report Cards</h3>
            <p className="text-sm text-slate-600 mb-2">
              School year 2024-25. Official performance ratings from the Ohio Department of Education.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">What we show:</span> Overall district ratings (5-star system), achievement scores, graduation rates, math/reading proficiency.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">F-33 School District Finance Survey</h3>
            <p className="text-sm text-slate-600 mb-2">
              Fiscal year 2022 (most recent available). Annual financial data from all public school districts.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">What we extract:</span> Per-pupil expenditure, total revenue, revenue sources (local/state/federal), total expenditures.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">County Auditor Property Tax Data</h3>
            <p className="text-sm text-slate-600 mb-2">
              Delaware and Franklin County Auditor offices, effective rates as of 2024.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">What we show:</span> Estimated annual property taxes on a $600k home, broken down by city/township within each district.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What You Can Compare</h2>
        <p className="text-slate-700 mb-4">For each school, you can see:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li><span className="font-medium">School Size:</span> Total student enrollment</li>
          <li><span className="font-medium">Class Size:</span> Student-teacher ratio (lower is better for individualized attention)</li>
          <li><span className="font-medium">Student Diversity:</span> Racial/ethnic breakdown percentages</li>
          <li><span className="font-medium">Economic Demographics:</span> Free/Reduced Lunch % (affluent vs. mixed-income communities)</li>
          <li><span className="font-medium">Per-Pupil Spending:</span> District-level average spending per student</li>
          <li><span className="font-medium">Property Tax Estimates:</span> Annual cost for a $600k home, specific to each school's location</li>
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
          When searching for a home, realtors typically ask: "What's your budget?" Then they show you houses in that price range. But here's what they don't always highlight: <strong>property taxes within the same school district can vary significantly by city and township.</strong>
        </p>
        <p className="text-slate-700 mb-4">
          Both Olentangy and Dublin are 5-star rated districts with excellent academics. The quality difference between individual schools is minimal. <strong>The real difference is location and annual cost.</strong> Why pay $7,200/year in property taxes when you could pay $5,800/year and send your kids to an equally excellent school?
        </p>
        <p className="text-slate-700 mb-4">
          This tool was built by a family going through this exact decision. We wanted to see all our options side-by-side: school quality, class sizes, diversity, and - most importantly - the actual long-term cost of each location.
        </p>
        <p className="text-slate-700">
          This is an independent tool using only publicly available data. We have no affiliation with any school district, real estate company, or government agency.
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
