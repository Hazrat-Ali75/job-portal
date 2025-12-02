import { Request, Response } from "express"
import * as applicationService from "../services/applicationService"

export async function applyForJob(req: Request, res: Response) {
    try {
        const { candidateId, jobId, resumeUrl, coverLetter } = req.body;
        const application = await applicationService.applyForJob(jobId, candidateId, resumeUrl, coverLetter);
        res.status(201).json({
            status: "success",
            message: "Application submitted successfully",
            data: application
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error applying for job", error.message);
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }

    }
}


export async function getApplicationById(req: Request, res: Response) {
    try {
        const applicationId = req.params.id;
        const application = await applicationService.getApplicationById(applicationId as string);
        res.status(200).json({
            status: "success",
            message: "Application fetched successfully",
            data: application
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching application", error.message);
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
}