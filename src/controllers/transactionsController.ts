import { Request, Response } from 'express';
import dayjs from 'dayjs';

import * as paymentRepository from '../repositories/paymentRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import { calculateBalance } from '../services/transactionsServices';
import handleError from '../services/errorServices';

export async function getTransactions(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const transactions = await paymentRepository.findByCardId(Number(id));
        const recharges = await rechargeRepository.findByCardId(Number(id));

        const balance = await calculateBalance(Number(id));

        res.status(200).send({
            balance,
            transactions,
            recharges
        });
    } catch (err: any) {
        if (err.code) {
            const statusCode = handleError(err.code);
            return res.status(statusCode).send(err.message);
        }
        res.status(500).send("On getTransactions: " + err);
    }
}

export async function addRecharge(req: Request, res: Response) {
    const { id } = req.params;
    const { amount } = req.body;

    try {
        await rechargeRepository.insert({ cardId: Number(id) , amount });

        const balance = await calculateBalance(Number(id));

        res.status(200).send("Recharged sucessfully. Your new balance is: " + (balance + amount));
    } catch (err: any) {
        if (err.code) {
            const statusCode = handleError(err.code);
            return res.status(statusCode).send(err.message);
        }
        res.status(500).send("On addRecharge: " + err);
    }
}

export async function performPayment(req: Request, res: Response) {
    const { id } = req.params;
    const { amount, businessId } = req.body;

    try {
        await paymentRepository.insert({ cardId: Number(id), businessId, amount });

        const balance = await calculateBalance(Number(id));

        res.status(200).send("Payment succeded. Your new balance is: " + (balance - amount));
    } catch (err: any) {
        if (err.code) {
            const statusCode = handleError(err.code);
            return res.status(statusCode).send(err.message);
        }
        res.status(500).send("On addRecharge: " + err);
    }
}