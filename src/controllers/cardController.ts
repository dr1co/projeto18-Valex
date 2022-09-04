import { Request, Response } from "express";

import * as cardRepository from '../repositories/cardRepository';
import { getCompanyData } from "../services/companyServices";
import { generateCardData } from "../services/cardServices";
import { generateEncryptedPassword } from "../services/encryptServices";
import { Employee } from "../repositories/employeeRepository";
import handleError from "../services/errorServices";

export async function createCard(req: Request, res: Response) {
    const apiKey: any = req.headers['x-api-key'];
    const employee: Employee = res.locals.employee;
    const { type } = req.body

    try {
        await getCompanyData(apiKey);
        const card = await generateCardData(employee, type);

        await cardRepository.insert(card);

        res.status(201).send("Card created successfully");
    } catch (err: any) {
        const statusCode = handleError(err.code);
        if (statusCode !== 418)
            return res.status(statusCode).send(err.message);
        res.status(500).send("On createCard: " + err);
    }
}

export async function activateCard(req: Request, res: Response) {
    const { securityCode, password } = req.body;
    const { id } = req.params;

    try {
        const newPassword = generateEncryptedPassword(password)

        await cardRepository.update(Number(id), {
            securityCode,
            password: newPassword,
            isBlocked: false
        });

        res.status(202).send("Card activated successfully");
    } catch (err) {
        res.status(500).send("On activateCard: " + err);
    }
}