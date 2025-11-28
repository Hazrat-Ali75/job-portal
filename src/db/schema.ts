import {
    pgTable,
    uuid,
    text,
    varchar,
    timestamp,
    boolean,
    integer,
    jsonb,
    pgEnum,
    index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -------------------- ENUMS --------------------

export const roleEnum = pgEnum("Role", [
    "CANDIDATE",
    "EMPLOYER",
    "ADMIN"
]);

export const jobTypeEnum = pgEnum("JobType", [
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERN",
    "REMOTE"
]);

export const applicationStatusEnum = pgEnum("ApplicationStatus", [
    "APPLIED",
    "SHORTLISTED",
    "INTERVIEW",
    "OFFERED",
    "REJECTED",
    "HIRED"
]);

// -------------------- USER --------------------

export const users = pgTable("User", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name"),
    email: varchar("email").unique(),
    password: varchar("password"),
    role: roleEnum("role"),
    createdAt: timestamp("createdAt").defaultNow(),
});

// -------------------- CANDIDATE --------------------

export const candidates = pgTable("Candidate", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").unique().references(() => users.id),
    resumeUrl: text("resumeUrl"),
    bio: text("bio"),
    skills: text("skills").array().default([]),
    experiences: jsonb("experiences"), // structured JSON
});

// -------------------- EMPLOYER --------------------

export const employers = pgTable("Employer", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").unique().references(() => users.id),
    companyName: varchar("companyName"),
    companyLogo: text("companyLogo"),
    location: varchar("location"),
});

// -------------------- JOB --------------------

export const jobs = pgTable("Job", {
    id: uuid("id").primaryKey().defaultRandom(),
    employerId: uuid("employerId").references(() => employers.id),
    title: varchar("title"),
    description: text("description"),
    skills: text("skills").array().default([]),
    salaryFrom: integer("salaryFrom"),
    salaryTo: integer("salaryTo"),
    jobType: jobTypeEnum("jobType"),
    location: varchar("location"),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow(),
    expiresAt: timestamp("expiresAt"),
}, (table) => ({
    titleIdx: index("job_title_idx").on(table.title),
    locationIdx: index("job_location_idx").on(table.location),
}));

// -------------------- APPLICATION --------------------

export const applications = pgTable("Application", {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("jobId").references(() => jobs.id),
    candidateId: uuid("candidateId").references(() => candidates.id),
    coverLetter: text("coverLetter"),
    resumeUrl: text("resumeUrl"),
    status: applicationStatusEnum("status").default("APPLIED"),
    appliedAt: timestamp("appliedAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
}, (table) => ({
    jobIdx: index("application_job_idx").on(table.jobId),
    candidateIdx: index("application_candidate_idx").on(table.candidateId),
}));


// -------------------- USER RELATIONS --------------------

export const userRelations = relations(users, ({ one }) => ({
    candidate: one(candidates, {
        fields: [users.id],
        references: [candidates.userId],
    }),
    employer: one(employers, {
        fields: [users.id],
        references: [employers.userId],
    }),
}));

// -------------------- CANDIDATE RELATIONS --------------------

export const candidateRelations = relations(candidates, ({ one, many }) => ({
    user: one(users, {
        fields: [candidates.userId],
        references: [users.id],
    }),
    applications: many(applications),
}));

// -------------------- EMPLOYER RELATIONS --------------------

export const employerRelations = relations(employers, ({ one, many }) => ({
    user: one(users, {
        fields: [employers.userId],
        references: [users.id],
    }),
    jobs: many(jobs),
}));

// -------------------- JOB RELATIONS --------------------

export const jobRelations = relations(jobs, ({ one, many }) => ({
    employer: one(employers, {
        fields: [jobs.employerId],
        references: [employers.id],
    }),
    applications: many(applications),
}));

// -------------------- APPLICATION RELATIONS --------------------

export const applicationRelations = relations(applications, ({ one }) => ({
    job: one(jobs, {
        fields: [applications.jobId],
        references: [jobs.id],
    }),
    candidate: one(candidates, {
        fields: [applications.candidateId],
        references: [candidates.id],
    }),
}));

