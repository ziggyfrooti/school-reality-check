import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Import real extracted data
const realDataPath = path.join(process.cwd(), '..', 'raw-data', 'real-data-extract.json');
const realData = JSON.parse(fs.readFileSync(realDataPath, 'utf-8'));

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'schools.db');

// Remove existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Create tables (same schema as before)
db.exec(`
  CREATE TABLE districts (
    leaid TEXT PRIMARY KEY,
    irn TEXT,
    name TEXT NOT NULL,
    state_id TEXT,
    location TEXT,
    phone TEXT,
    website TEXT,
    total_schools INTEGER
  );

  CREATE TABLE schools (
    ncessch TEXT PRIMARY KEY,
    leaid TEXT NOT NULL,
    irn TEXT,
    name TEXT NOT NULL,
    school_type TEXT,
    grades_low TEXT,
    grades_high TEXT,
    status TEXT,
    latitude REAL,
    longitude REAL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    FOREIGN KEY (leaid) REFERENCES districts(leaid)
  );
`);

// Helper to classify school type based on grade levels
function classifySchoolType(gradesLow: string, gradesHigh: string): string {
  const low = gradesLow === 'PK' ? 0 : parseInt(gradesLow) || 0;
  const high = gradesHigh ? parseInt(gradesHigh) : 0;

  if (high <= 5) return 'Elementary';
  if (low >= 6 && high <= 8) return 'Middle';
  if (low >= 9) return 'High';
  if (high === 6) return 'Elementary'; // K-6
  if (low >= 5 && high === 8) return 'Middle'; // 5-8 or 6-8
  return 'Other';
}

// Insert districts
const insertDistrict = db.prepare(`
  INSERT INTO districts (leaid, irn, name, state_id, location, phone, website, total_schools)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('📥 Inserting REAL district data...\n');

for (const district of realData.districts) {
  const schoolCount = realData.schools.filter((s: any) => s.leaid === district.leaid).length;

  insertDistrict.run(
    district.leaid,
    district.state_id.replace('OH-', ''),
    district.name,
    district.state_id,
    district.location,
    district.phone,
    district.website,
    schoolCount
  );

  console.log(`✓ ${district.name} (${schoolCount} schools)`);
}

// Insert schools
const insertSchool = db.prepare(`
  INSERT INTO schools (
    ncessch, leaid, name, school_type, grades_low, grades_high,
    status, address, city, state, zip
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('\n🏫 Inserting REAL school data...\n');

let counts = { Elementary: 0, Middle: 0, High: 0, Other: 0 };

for (const school of realData.schools) {
  const schoolType = classifySchoolType(school.grades_low, school.grades_high);
  counts[schoolType as keyof typeof counts]++;

  insertSchool.run(
    school.ncessch,
    school.leaid,
    school.name,
    schoolType,
    school.grades_low,
    school.grades_high,
    school.status || 'Open',
    school.address,
    school.city,
    school.state,
    school.zip
  );
}

console.log(`✓ Inserted ${realData.schools.length} schools:`);
console.log(`  Elementary: ${counts.Elementary}`);
console.log(`  Middle: ${counts.Middle}`);
console.log(`  High: ${counts.High}`);
console.log(`  Other: ${counts.Other}`);

console.log('\n✅ Database seeded with REAL DATA successfully!');
console.log(`📊 Database location: ${dbPath}`);
console.log('\n📁 Data Summary:');
console.log(`  Districts: ${realData.districts.length}`);
console.log(`  Schools: ${realData.schools.length}`);

db.close();
