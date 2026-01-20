import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'schools.db');
const db = new Database(dbPath);

console.log('🔧 Fixing school types based on grade levels...\n');

// Fix Elementary schools (KG-05, PK-05, KG-06, etc.)
const fixElementary = db.prepare(`
  UPDATE schools
  SET school_type = 'Elementary'
  WHERE school_type = 'Other'
  AND (
    (grades_low IN ('KG', 'PK', '01', '1') AND grades_high IN ('05', '5', '06', '6'))
    OR (grades_low = 'KG' AND grades_high = 'KG')
  )
`);

const elementaryResult = fixElementary.run();
console.log(`✓ Fixed ${elementaryResult.changes} Elementary schools`);

// Fix Middle schools (06-08, 05-08, 07-08, etc.)
const fixMiddle = db.prepare(`
  UPDATE schools
  SET school_type = 'Middle'
  WHERE school_type = 'Other'
  AND (
    (grades_low IN ('05', '5', '06', '6', '07', '7') AND grades_high IN ('08', '8'))
  )
`);

const middleResult = fixMiddle.run();
console.log(`✓ Fixed ${middleResult.changes} Middle schools`);

// Fix High schools (09-12, 10-12, etc.)
const fixHigh = db.prepare(`
  UPDATE schools
  SET school_type = 'High'
  WHERE school_type = 'Other'
  AND (
    (grades_low IN ('09', '9', '10') AND grades_high IN ('12'))
  )
`);

const highResult = fixHigh.run();
console.log(`✓ Fixed ${highResult.changes} High schools`);

// Verify the fixes
console.log('\n📊 School counts after fix:\n');

// Dublin
const dublinCounts = db.prepare(`
  SELECT school_type, COUNT(*) as count
  FROM schools
  WHERE leaid = '3904702'
  GROUP BY school_type
  ORDER BY school_type
`).all();

console.log('Dublin City Schools:');
dublinCounts.forEach((row: any) => {
  console.log(`  ${row.school_type}: ${row.count}`);
});

// Olentangy
const olentangyCounts = db.prepare(`
  SELECT school_type, COUNT(*) as count
  FROM schools
  WHERE leaid = '3904676'
  GROUP BY school_type
  ORDER BY school_type
`).all();

console.log('\nOlentangy Local Schools:');
olentangyCounts.forEach((row: any) => {
  console.log(`  ${row.school_type}: ${row.count}`);
});

db.close();
console.log('\n✅ School types fixed!');
