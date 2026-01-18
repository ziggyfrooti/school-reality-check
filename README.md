# School Reality Check

> **Honest, data-driven comparison of Central Ohio school districts**

## What is this?

Buying a home often means choosing a school district — but the data is scattered across multiple websites, outdated, and confusing.

This dashboard brings official public school data into one clear, honest comparison for Central Ohio districts (Olentangy and Dublin in V1).

## Purpose

This tool helps home buyers and parents understand school district trade-offs when deciding where to live. It uses **only publicly available data** from:

- NCES Common Core of Data (enrollment, demographics)
- School District Finance Survey F-33 (district finance)
- Ohio School Report Cards (achievement, graduation, readiness)

## What makes it different?

- ✅ **Official data only** - NCES, Ohio Department of Education. No opinions, no ratings from us.
- ✅ **Honest about lag** - Finance data is ~18 months behind. We tell you that upfront.
- ✅ **Clear limitations** - School-level funding isn't publicly available. We don't make it up.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Seed the database**
   ```bash
   npm run seed
   ```

   This will:
   - Create a SQLite database at `data/schools.db`
   - Populate it with data for Olentangy Local Schools and Dublin City Schools
   - Include 24 schools total with enrollment, achievement, and finance data

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
school-reality-check/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with nav and footer
│   ├── page.tsx           # Home page (district comparison)
│   ├── districts/         # District detail pages (planned)
│   └── about/             # About the data page (planned)
├── components/            # Reusable React components
├── lib/
│   ├── db/
│   │   ├── schema.ts     # Drizzle ORM schema
│   │   └── client.ts     # Database connection
│   └── utils.ts          # Utility functions
├── scripts/
│   └── seed.ts           # Database seeding script
├── data/
│   └── schools.db        # SQLite database (generated)
└── public/               # Static assets
```

## Data Model

### Districts
- Basic info (name, location, total schools)
- Links to enrollment, finance, and performance data

### Schools
- Basic info (name, type, grades served, location)
- Links to enrollment, achievement, and outcomes data

### Metrics Available

**District-Level:**
- Total enrollment, demographics, Free/Reduced Lunch %
- Per-pupil expenditure, revenue by source (FY 2022)
- Overall rating, graduation rates, college readiness %

**School-Level:**
- Enrollment by demographics
- % Proficient in Math, ELA, Science, Social Studies
- Value-added progress measures
- Graduation rates (high schools only)
- College credit %, industry credentials, AP/IB participation (high schools)

## Data Sources & Limitations

### Data Sources
- **NCES Common Core of Data (CCD)**: Enrollment and demographic data (SY 2024-25)
- **School District Finance Survey (F-33)**: District-level finance (FY 2022, ~18 month lag)
- **Ohio School Report Cards**: Achievement and outcomes (SY 2024-25)

### Limitations

**What's NOT available:**
- ❌ School-level funding (only district totals available)
- ❌ Teacher qualifications (not publicly reported)
- ❌ SAT/ACT scores (not in public datasets)
- ❌ Class sizes (district averages only)
- ❌ Extracurricular programs (not tracked)
- ❌ Facilities quality (not tracked)

**Proxies used:**
- "Per-pupil expenditure" = district average (NOT school-specific)
- "Student-teacher ratio" = weak proxy for class size

### Time Lags
- **Enrollment/Demographics**: ~6 months (SY 2024-25 data)
- **Finance**: ~18 months (FY 2022 = SY 2021-22)
- **Achievement/Graduation**: Current year (SY 2024-25)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite + Drizzle ORM
- **Styling**: Tailwind CSS
- **Charts**: Recharts (planned for V2)

## Roadmap

### V1 (Current)
- ✅ Olentangy Local Schools
- ✅ Dublin City Schools
- ✅ District comparison landing page
- ✅ Basic enrollment and performance metrics
- ⏳ District detail pages
- ⏳ School comparison tables
- ⏳ Individual school detail pages

### V2 (Planned)
- Add 3 more districts (Worthington, New Albany, Westerville)
- Historical trends (3-5 years)
- Map view with school locations
- Side-by-side district comparison
- Data visualizations (charts, graphs)
- Automated data refresh pipeline

## Development

### Adding a New District

1. Update `scripts/seed.ts` with new district data
2. Run `npm run seed` to regenerate the database
3. Add district to homepage comparison

### Database Schema Changes

1. Update `lib/db/schema.ts`
2. Regenerate SQLite database: `rm data/schools.db && npm run seed`

## License

MIT

## Acknowledgments

- Data from NCES and Ohio Department of Education
- Built with Next.js, Drizzle ORM, and Tailwind CSS

---

**Note**: This is a demonstration project using realistic mock data based on public data structures. For production use, implement actual data fetching from NCES and Ohio DOE APIs/downloads.
