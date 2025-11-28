CREATE TYPE "public"."ApplicationStatus" AS ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'REJECTED', 'HIRED');--> statement-breakpoint
CREATE TYPE "public"."JobType" AS ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'REMOTE');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('CANDIDATE', 'EMPLOYER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "Application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jobId" uuid,
	"candidateId" uuid,
	"coverLetter" text,
	"resumeUrl" text,
	"status" "ApplicationStatus" DEFAULT 'APPLIED',
	"appliedAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Candidate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"resumeUrl" text,
	"bio" text,
	"skills" text[] DEFAULT '{}',
	"experiences" jsonb,
	CONSTRAINT "Candidate_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "Employer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"companyName" varchar,
	"companyLogo" text,
	"location" varchar,
	CONSTRAINT "Employer_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "Job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employerId" uuid,
	"title" varchar,
	"description" text,
	"skills" text[] DEFAULT '{}',
	"salaryFrom" integer,
	"salaryTo" integer,
	"jobType" "JobType",
	"location" varchar,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"expiresAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"email" varchar,
	"password" varchar,
	"role" "Role",
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_Job_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateId_Candidate_id_fk" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Employer" ADD CONSTRAINT "Employer_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_Employer_id_fk" FOREIGN KEY ("employerId") REFERENCES "public"."Employer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "application_job_idx" ON "Application" USING btree ("jobId");--> statement-breakpoint
CREATE INDEX "application_candidate_idx" ON "Application" USING btree ("candidateId");--> statement-breakpoint
CREATE INDEX "job_title_idx" ON "Job" USING btree ("title");--> statement-breakpoint
CREATE INDEX "job_location_idx" ON "Job" USING btree ("location");