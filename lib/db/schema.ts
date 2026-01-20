import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Districts table - Basic district information
export const districts = sqliteTable('districts', {
  leaid: text('leaid').primaryKey(),
  irn: text('irn'),
  name: text('name').notNull(),
  stateId: text('state_id'),
  location: text('location'),
  phone: text('phone'),
  website: text('website'),
  totalSchools: integer('total_schools'),
  // Finance data
  totalRevenue: integer('total_revenue'),
  localRevenue: integer('local_revenue'),
  stateRevenue: integer('state_revenue'),
  federalRevenue: integer('federal_revenue'),
  totalExpenditure: integer('total_expenditure'),
  instructionExpenditure: integer('instruction_expenditure'),
  perPupilExpenditure: integer('per_pupil_expenditure'),
  pctFromLocalTax: real('pct_from_local_tax'),
  // Ohio Report Card data
  overallRating: integer('overall_rating'),
  achievementScore: real('achievement_score'),
  graduationRate4yr: real('graduation_rate_4yr'),
  mathProficiency: real('math_proficiency'),
  readingProficiency: real('reading_proficiency'),
});

// Schools table - Basic school information
export const schools = sqliteTable('schools', {
  ncessch: text('ncessch').primaryKey(),
  leaid: text('leaid').notNull().references(() => districts.leaid),
  irn: text('irn'),
  name: text('name').notNull(),
  schoolType: text('school_type'),
  gradesLow: text('grades_low'),
  gradesHigh: text('grades_high'),
  status: text('status'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
});

// School enrollment - Student count by demographics
export const schoolEnrollment = sqliteTable('school_enrollment', {
  ncessch: text('ncessch').primaryKey().references(() => schools.ncessch),
  schoolYear: text('school_year').notNull(),
  totalStudents: integer('total_students'),
  pctWhite: real('pct_white'),
  pctBlack: real('pct_black'),
  pctHispanic: real('pct_hispanic'),
  pctAsian: real('pct_asian'),
  pctOther: real('pct_other'),
  pctFrl: real('pct_frl'),
  studentTeacherRatio: real('student_teacher_ratio'),
});

// School achievement - Test scores and performance
export const schoolAchievement = sqliteTable('school_achievement', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ncessch: text('ncessch').notNull().references(() => schools.ncessch),
  schoolYear: text('school_year').notNull(),
  performanceIndex: real('performance_index'),
  valueAddedGrade: text('value_added_grade'),
  overallGrade: text('overall_grade'),
});

// School outcomes - Graduation, attendance, etc.
export const schoolOutcomes = sqliteTable('school_outcomes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ncessch: text('ncessch').notNull().references(() => schools.ncessch),
  schoolYear: text('school_year').notNull(),
  graduationRate: real('graduation_rate'),
  attendanceRate: real('attendance_rate'),
});

// District enrollment - Aggregate district-level enrollment
export const districtEnrollment = sqliteTable('district_enrollment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leaid: text('leaid').notNull().references(() => districts.leaid),
  schoolYear: text('school_year').notNull(),
  totalStudents: integer('total_students'),
  pctWhite: real('pct_white'),
  pctBlack: real('pct_black'),
  pctHispanic: real('pct_hispanic'),
  pctAsian: real('pct_asian'),
});

// District finance - Revenue and expenditure data
export const districtFinance = sqliteTable('district_finance', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leaid: text('leaid').notNull().references(() => districts.leaid),
  fiscalYear: text('fiscal_year').notNull(),
  totalRevenue: real('total_revenue'),
  totalExpenditure: real('total_expenditure'),
  instructionalExpenditure: real('instructional_expenditure'),
  perPupilExpenditure: real('per_pupil_expenditure'),
});

// District performance - Aggregate district-level outcomes
export const districtPerformance = sqliteTable('district_performance', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leaid: text('leaid').notNull().references(() => districts.leaid),
  schoolYear: text('school_year').notNull(),
  overallGrade: text('overall_grade'),
  graduationRate: real('graduation_rate'),
});

// Relations
export const districtsRelations = relations(districts, ({ many }) => ({
  schools: many(schools),
}));

export const schoolsRelations = relations(schools, ({ one }) => ({
  district: one(districts, {
    fields: [schools.leaid],
    references: [districts.leaid],
  }),
}));
