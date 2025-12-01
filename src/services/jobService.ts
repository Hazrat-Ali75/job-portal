import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { jobs, employers } from "../db/schema";
import { ilike } from "drizzle-orm";
import { and } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { arrayContains } from "drizzle-orm";

export type CreateJobInput = typeof jobs.$inferInsert;

export async function createJob(jobData: CreateJobInput) {
    await db.insert(jobs).values(jobData);
}

export async function listJobs({ page = 1, limit = 10, q, skills, location, jobType }: any) {
    console.log(q, skills, location, jobType);
    const skip = (page - 1) * limit;
    const filters = [];
    if (q) filters.push(ilike(jobs.title, `%${q}%`));
    if (skills) {
        const skillList = Array.isArray(skills) ? skills : [skills];
        filters.push(arrayContains(jobs.skills, skillList))
    }
    if (location) filters.push(ilike(jobs.location, `%${location}%`));
    if (jobType) filters.push(eq(jobs.jobType, jobType));
    const where = and(...filters);
    const [items, total] = await Promise.all([
        await db.select().from(jobs).where(where).orderBy(desc(jobs.createdAt)).limit(limit).offset(skip),
        await db.select({ count: sql<number>`count(*)` }).from(jobs).where(where)
    ])

    return {
        items,
        total: Number(total[0]?.count)
    }
}

export async function getJobs(jobId: string | undefined) {
    if (!jobId) return [];
    return (await db.select().from(jobs).where(eq(jobs.id, jobId!)).innerJoin(employers, eq(jobs.employerId, employers.id)));
}
