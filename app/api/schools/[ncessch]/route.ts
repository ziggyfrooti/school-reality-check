import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ncessch: string }> }
) {
  try {
    const { ncessch } = await params;

    // Fetch school with enrollment data
    const [schoolWithEnrollment] = await db
      .select({
        school: schema.schools,
        enrollment: schema.schoolEnrollment,
      })
      .from(schema.schools)
      .leftJoin(
        schema.schoolEnrollment,
        eq(schema.schools.ncessch, schema.schoolEnrollment.ncessch)
      )
      .where(eq(schema.schools.ncessch, ncessch));

    if (!schoolWithEnrollment) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Fetch district data for per-pupil spending
    const [district] = await db
      .select({
        perPupilExpenditure: schema.districts.perPupilExpenditure,
      })
      .from(schema.districts)
      .where(eq(schema.districts.leaid, schoolWithEnrollment.school.leaid));

    return NextResponse.json({
      enrollment: schoolWithEnrollment.enrollment,
      district: district || null,
    });
  } catch (error) {
    console.error('Error fetching school data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch school data' },
      { status: 500 }
    );
  }
}
