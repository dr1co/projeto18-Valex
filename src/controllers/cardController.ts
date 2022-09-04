import { Request, Response } from "express";

import { getCompanyData } from "../services/companyServices";
import { generateCardData } from "../services/cardServices";
import { Employee } from "../repositories/employeeRepository";
import handleError from "../services/errorServices";

export async function createCard(req: Request, res: Response) {
    const apiKey: any = req.headers['x-api-key'];
    const employee: Employee = res.locals.employee;
    const { type } = req.body

    try {
        const company = await getCompanyData(apiKey);
        const card = await generateCardData(employee, type);

        res.status(201).send("Card created successfully");
    } catch (err: any) {
        const statusCode = handleError(err.code);
        res.status(statusCode).send(err.message);
    }
}