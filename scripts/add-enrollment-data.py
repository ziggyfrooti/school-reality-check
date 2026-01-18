#!/usr/bin/env python3
"""
Extract enrollment and demographic data from NCES files and add to database.
This gives homeowners actual data to make decisions!
"""

import sqlite3
import csv
from pathlib import Path
from collections import defaultdict

PROJECT_DIR = Path(__file__).parent.parent
RAW_DATA_DIR = PROJECT_DIR.parent / 'raw-data'
DB_PATH = PROJECT_DIR / 'data' / 'schools.db'

def get_our_schools():
    """Get list of NCESSCHs from our database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT ncessch FROM schools")
    schools = {row[0] for row in cursor.fetchall()}
    conn.close()
    return schools

def extract_school_enrollment():
    """Extract enrollment by race/ethnicity for each school."""

    enrollment_file = RAW_DATA_DIR / 'ccd_sch_052_2324_l_1a_073124.csv'
    our_schools = get_our_schools()

    # Store enrollment data aggregated by school
    school_data = defaultdict(lambda: {
        'total': 0,
        'white': 0,
        'black': 0,
        'hispanic': 0,
        'asian': 0,
        'other': 0
    })

    with open(enrollment_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            ncessch = row.get('NCESSCH', '')

            if ncessch not in our_schools:
                continue

            race = row.get('RACE_ETHNICITY', '')

            try:
                count = int(row.get('STUDENT_COUNT', 0) or 0)
            except:
                continue

            # Sum across all grades and sexes - we aggregate everything
            # Map race/ethnicity text to our categories
            if 'White' in race:
                school_data[ncessch]['white'] += count
                school_data[ncessch]['total'] += count
            elif 'Black' in race or 'African American' in race:
                school_data[ncessch]['black'] += count
                school_data[ncessch]['total'] += count
            elif 'Hispanic' in race or 'Latino' in race:
                school_data[ncessch]['hispanic'] += count
                school_data[ncessch]['total'] += count
            elif 'Asian' in race:
                school_data[ncessch]['asian'] += count
                school_data[ncessch]['total'] += count
            elif 'Two or more' not in race and race != 'Not Specified':  # Pacific Islander, Am Indian
                school_data[ncessch]['other'] += count
                school_data[ncessch]['total'] += count
            elif 'Two or more' in race:
                school_data[ncessch]['other'] += count
                school_data[ncessch]['total'] += count

    return school_data

def update_database(school_data):
    """Insert enrollment data into database."""

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create enrollment table if it doesn't exist (simpler version)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS school_enrollment (
            ncessch TEXT PRIMARY KEY,
            school_year TEXT NOT NULL,
            total_students INTEGER,
            pct_white REAL,
            pct_black REAL,
            pct_hispanic REAL,
            pct_asian REAL,
            pct_other REAL,
            FOREIGN KEY (ncessch) REFERENCES schools(ncessch)
        )
    ''')

    # Insert enrollment data
    inserted = 0
    for ncessch, data in school_data.items():
        total = data['total']
        if total == 0:
            continue

        # Calculate percentages
        pct_white = (data['white'] / total * 100) if total > 0 else 0
        pct_black = (data['black'] / total * 100) if total > 0 else 0
        pct_hispanic = (data['hispanic'] / total * 100) if total > 0 else 0
        pct_asian = (data['asian'] / total * 100) if total > 0 else 0
        pct_other = (data['other'] / total * 100) if total > 0 else 0

        cursor.execute('''
            INSERT OR REPLACE INTO school_enrollment
            (ncessch, school_year, total_students, pct_white, pct_black, pct_hispanic, pct_asian, pct_other)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (ncessch, '2023-24', total, pct_white, pct_black, pct_hispanic, pct_asian, pct_other))

        inserted += 1

    conn.commit()
    conn.close()

    return inserted

if __name__ == '__main__':
    print("Extracting enrollment data from NCES...")
    school_data = extract_school_enrollment()

    print(f"Found enrollment data for {len(school_data)} schools")

    print("Updating database...")
    inserted = update_database(school_data)

    print(f"✅ Successfully added enrollment data for {inserted} schools!")
    print("\nNow the app can show:")
    print("  - Total students per school")
    print("  - Demographic breakdown (White, Black, Hispanic, Asian, Other)")
    print("  - This helps homeowners understand school size and diversity")
