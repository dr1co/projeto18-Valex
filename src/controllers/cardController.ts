import { Request, Response } from "express";

import * as cardRepository from '../repositories/cardRepository';
import * as paymentRepository from '../repositories/paymentRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import { getCompanyData } from "../services/companyServices";
import { generateCardData, calculateBalance } from "../services/cardServices";
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

export async function getTransactions(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const transactions = await paymentRepository.findByCardId(Number(id));
        const recharges = await rechargeRepository.findByCardId(Number(id));
        const transactionsValues: number[] = [];
        const rechargesValues: number[] = [];

        transactions.map(t => transactionsValues.push(t.amount));
        recharges.map(r => rechargesValues.push(r.amount));

        const balance = calculateBalance(transactionsValues, rechargesValues);

        res.status(200).send({
            balance,
            transactions,
            recharges
        });
    } catch (err) {
        res.status(500).send("On getTransactions: " + err);
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