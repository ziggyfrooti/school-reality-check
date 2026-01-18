#!/usr/bin/env python3
"""
Seed database with REAL NCES data for Olentangy and Dublin districts
"""
import sqlite3
import json
import os
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / 'data'
REAL_DATA_FILE = PROJECT_DIR.parent / 'raw-data' / 'real-data-extract.json'

# Ensure data directory exists
DATA_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / 'schools.db'

# Remove existing database
if DB_PATH.exists():
    DB_PATH.unlink()

# Load real data
print(f"📥 Loading real data from {REAL_DATA_FILE}...")
with open(REAL_DATA_FILE) as f:
    real_data = json.load(f)

# Connect to database
conn = sqlite3.connect(str(DB_PATH))
cursor = conn.cursor()

# Create tables
print("🔧 Creating database schema...")
cursor.executescript('''
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
''')

# Helper to classify school type
def classify_school_type(grades_low, grades_high):
    try:
        low = 0 if grades_low == 'PK' else int(grades_low) if grades_low else 0
        high = int(grades_high) if grades_high and grades_high != '' else 0

        if high <= 5:
            return 'Elementary'
        if low >= 6 and high <= 8:
            return 'Middle'
        if low >= 9:
            return 'High'
        if high == 6:
            return 'Elementary'  # K-6
        if low >= 5 and high == 8:
            return 'Middle'  # 5-8 or 6-8
        return 'Other'
    except:
        return 'Other'

# Insert districts
print('\n📥 Inserting REAL district data...\n')

for district in real_data['districts']:
    school_count = len([s for s in real_data['schools'] if s['leaid'] == district['leaid']])
    irn = district['state_id'].replace('OH-', '')

    cursor.execute('''
        INSERT INTO districts (leaid, irn, name, state_id, location, phone, website, total_schools)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        district['leaid'],
        irn,
        district['name'],
        district['state_id'],
        district['location'],
        district['phone'],
        district['website'],
        school_count
    ))

    print(f"✓ {district['name']} ({school_count} schools)")

# Insert schools
print('\n🏫 Inserting REAL school data...\n')

counts = {'Elementary': 0, 'Middle': 0, 'High': 0, 'Other': 0}

for school in real_data['schools']:
    school_type = classify_school_type(school['grades_low'], school['grades_high'])
    counts[school_type] += 1

    cursor.execute('''
        INSERT INTO schools (
            ncessch, leaid, name, school_type, grades_low, grades_high,
            status, address, city, state, zip
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        school['ncessch'],
        school['leaid'],
        school['name'],
        school_type,
        school['grades_low'],
        school['grades_high'],
        school['status'] or 'Open',
        school['address'],
        school['city'],
        school['state'],
        school['zip']
    ))

print(f"✓ Inserted {len(real_data['schools'])} schools:")
print(f"  Elementary: {counts['Elementary']}")
print(f"  Middle: {counts['Middle']}")
print(f"  High: {counts['High']}")
print(f"  Other: {counts['Other']}")

conn.commit()
conn.close()

print('\n✅ Database seeded with REAL DATA successfully!')
print(f'📊 Database location: {DB_PATH}')
print('\n📁 Data Summary:')
print(f'  Districts: {len(real_data["districts"])}')
print(f'  Schools: {len(real_data["schools"])}')
print('\n🚀 Next step: npm run dev')
