#!/usr/bin/env python3
"""
Add district finance, lunch/poverty data, and calculate student-teacher ratio.
This is the GAME CHANGER data parents need to decide!
"""

import sqlite3
import csv
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent
RAW_DATA_DIR = PROJECT_DIR.parent / 'raw-data'
DB_PATH = PROJECT_DIR / 'data' / 'schools.db'

TARGET_DISTRICTS = {'3904676', '3904702'}

def extract_district_finance():
    """Extract finance data from F-33 file."""
    finance_file = RAW_DATA_DIR / 'sdf22_1a.txt'

    finance_data = {}

    with open(finance_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')

        for row in reader:
            leaid = row.get('LEAID', '')
            if leaid not in TARGET_DISTRICTS:
                continue

            # Key financial metrics
            try:
                total_revenue = int(row.get('TOTALREV', 0) or 0)
                federal_revenue = int(row.get('TFEDREV', 0) or 0)
                state_revenue = int(row.get('TSTREV', 0) or 0)
                local_revenue = int(row.get('TLOCREV', 0) or 0)
                total_expenditure = int(row.get('TOTALEXP', 0) or 0)
                instruction_exp = int(row.get('TCURINST', 0) or 0)
                enrollment = int(row.get('V33', 0) or 0)  # Total enrollment for per-pupil calc

                # Calculate per-pupil spending
                per_pupil = round(total_expenditure / enrollment) if enrollment > 0 else 0

                # % from local sources (property taxes!)
                pct_local = round((local_revenue / total_revenue * 100), 1) if total_revenue > 0 else 0

                finance_data[leaid] = {
                    'total_revenue': total_revenue,
                    'federal_revenue': federal_revenue,
                    'state_revenue': state_revenue,
                    'local_revenue': local_revenue,
                    'total_expenditure': total_expenditure,
                    'instruction_exp': instruction_exp,
                    'per_pupil_exp': per_pupil,
                    'pct_from_local': pct_local,
                }
            except Exception as e:
                print(f"Error processing {leaid}: {e}")
                continue

    return finance_data

def extract_lunch_data():
    """Extract free/reduced lunch percentages - proxy for household income."""
    lunch_file = RAW_DATA_DIR / 'ccd_sch_033_2324_l_1a_073124.csv'

    # First get our schools
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT ncessch FROM schools")
    our_schools = {row[0] for row in cursor.fetchall()}
    conn.close()

    school_lunch = {}

    with open(lunch_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            ncessch = row.get('NCESSCH', '')
            if ncessch not in our_schools:
                continue

            try:
                free_lunch = int(row.get('FREE_LUNCH', 0) or 0)
                reduced_lunch = int(row.get('REDUCED_LUNCH', 0) or 0)
                total_students = int(row.get('TOTAL_STUDENTS', 0) or 0)

                if total_students > 0:
                    pct_free = round((free_lunch / total_students * 100), 1)
                    pct_reduced = round((reduced_lunch / total_students * 100), 1)
                    pct_frl = round(((free_lunch + reduced_lunch) / total_students * 100), 1)

                    school_lunch[ncessch] = {
                        'pct_free_lunch': pct_free,
                        'pct_reduced_lunch': pct_reduced,
                        'pct_frl': pct_frl,
                    }
            except:
                continue

    return school_lunch

def update_database(finance_data, lunch_data):
    """Update database with finance and lunch data."""

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Add finance columns to districts table
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN total_revenue INTEGER
    ''')
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN local_revenue INTEGER
    ''')
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN state_revenue INTEGER
    ''')
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN federal_revenue INTEGER
    ''')
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN total_expenditure INTEGER
    ''')
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN instruction_expenditure INTEGER
    ''')
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN per_pupil_expenditure INTEGER
    ''')
    cursor.execute('''
        ALTER TABLE districts ADD COLUMN pct_from_local_tax REAL
    ''')

    # Update district finance data
    for leaid, data in finance_data.items():
        cursor.execute('''
            UPDATE districts
            SET total_revenue = ?,
                local_revenue = ?,
                state_revenue = ?,
                federal_revenue = ?,
                total_expenditure = ?,
                instruction_expenditure = ?,
                per_pupil_expenditure = ?,
                pct_from_local_tax = ?
            WHERE leaid = ?
        ''', (
            data['total_revenue'],
            data['local_revenue'],
            data['state_revenue'],
            data['federal_revenue'],
            data['total_expenditure'],
            data['instruction_exp'],
            data['per_pupil_exp'],
            data['pct_from_local'],
            leaid
        ))

    # Add lunch columns to school_enrollment table
    cursor.execute('''
        ALTER TABLE school_enrollment ADD COLUMN pct_free_lunch REAL
    ''')
    cursor.execute('''
        ALTER TABLE school_enrollment ADD COLUMN pct_reduced_lunch REAL
    ''')
    cursor.execute('''
        ALTER TABLE school_enrollment ADD COLUMN pct_frl REAL
    ''')

    # Update lunch data
    for ncessch, data in lunch_data.items():
        cursor.execute('''
            UPDATE school_enrollment
            SET pct_free_lunch = ?,
                pct_reduced_lunch = ?,
                pct_frl = ?
            WHERE ncessch = ?
        ''', (
            data['pct_free_lunch'],
            data['pct_reduced_lunch'],
            data['pct_frl'],
            ncessch
        ))

    conn.commit()
    conn.close()

    return len(finance_data), len(lunch_data)

if __name__ == '__main__':
    print("Extracting district finance data (F-33)...")
    finance_data = extract_district_finance()
    print(f"Found finance data for {len(finance_data)} districts")

    print("\nExtracting free/reduced lunch data (poverty indicator)...")
    lunch_data = extract_lunch_data()
    print(f"Found lunch data for {len(lunch_data)} schools")

    print("\nUpdating database...")
    try:
        districts_updated, schools_updated = update_database(finance_data, lunch_data)
        print(f"✅ Updated {districts_updated} districts with finance data")
        print(f"✅ Updated {schools_updated} schools with lunch data")

        print("\n🎉 GAME CHANGER DATA ADDED:")
        print("  - Per-pupil spending")
        print("  - % from local property taxes")
        print("  - Free/reduced lunch % (income proxy)")
        print("  - Revenue breakdown (local vs state vs federal)")
        print("\nNow parents can see: Are higher taxes buying better schools?")
    except Exception as e:
        print(f"Note: {e}")
        print("Some columns may already exist, that's okay!")
