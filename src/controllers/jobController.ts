import { Request, Response } from "express";
import * as jobService from "../services/jobService";

export async function postJob(req: Request, res: Response) {
    try {
        const jobData = req.body;
        await jobService.createJob(jobData);
        res.status(201).json({ message: "Job created successfully" });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ error: "Failed to create job" });
    }
}

export async function listJobs(req: Request, res: Response) {
    const { page, limit, q, skills, location, jobType } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    try {
        const result = await jobService.listJobs({ pageNumber, limitNumber, q, skills, location, jobType });
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching jobs :", error.message);
        }
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
}

export async function getJob(req: Request, res: Response) {
    try {
        const jobId = req.params.id;
        const job = await jobService.getJobs(jobId);
        res.status(200).json(job);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching job :", error.message);
        }
        res.status(500).json({ error: "Failed to fetch job" });
    }
}