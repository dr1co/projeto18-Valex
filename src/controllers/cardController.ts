import { Request, Response } from "express";

import * as cardRepository from '../repositories/cardRepository';
import { generateCardData } from "../services/cardServices";
import { generateEncryptedPassword } from "../services/encryptServices";
import { Employee } from "../repositories/employeeRepository";
import handleError from "../services/errorServices";

export async function createCard(req: Request, res: Response) {
    const employee: Employee = res.locals.employee;
    const { type } = req.body

    try {
        const card = await generateCardData(employee, type);

        await cardRepository.insert(card);

        res.status(201).send("Card created successfully. Your security code is: " + card.securityCode);
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

export async function blockCard(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await cardRepository.update(Number(id), { isBlocked: true });

        res.status(200).send("Card blocked successfully");
    } catch (err) {
        res.status(500).send("On blockCard: " + err);
    }
}

export async function unblockCard(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await cardRepository.update(Number(id), { isBlocked: false });

        res.status(200).send("Card blocked successfully");
    } catch (err) {
        res.status(500).send("On unblockCard: " + err);
    }
}