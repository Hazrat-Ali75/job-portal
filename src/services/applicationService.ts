import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { applications, jobs } from "../db/schema";


export async function applyForJob(jobId: string, candidateId: string, resumeUrl?: string, coverLetter?: string) {
    const existingApplication = await db.select().from(applications).where(and(eq(applications.candidateId, candidateId), eq(applications.jobId, jobId)));
    if (existingApplication.length > 0) {
        return { error: "you have already applied for this job" }
    }
    const [application] = await db.insert(applications).values({
        jobId,
        candidateId,
        resumeUrl,
        coverLetter,
        status: "APPLIED"
    }).returning();
    return application;
}

export async function getApplicationById(id: string) {
    const [application] = await db.select().from(applications).where(eq(applications.id, id)).innerJoin(jobs, eq(applications.jobId, jobs.id));;
    return application;
}