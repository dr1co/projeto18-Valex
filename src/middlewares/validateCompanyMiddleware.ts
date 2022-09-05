import { NextFunction, Request, Response } from "express";

import { findByApiKey } from "../repositories/companyRepository";
import handleError from "../services/errorServices";

export async function validateCompany(req: Request, res: Response, next: NextFunction) {
    const apiKey: any = req.headers['x-api-key'];

    try {
        const company = await findByApiKey(apiKey);

        if (!company) {
            throw { code: "NoCompany", message: "Error: company not found" };
        } else {
            res.locals.company =  company;
            next();
        }
    } catch (err: any) {
        if (err.code === "NoCompany") {
            const statusCode = handleError(err.code);
            return res.status(statusCode).send(err.message);
        }
        res.status(500).send("On getCompanyData: " + err);
    }
}