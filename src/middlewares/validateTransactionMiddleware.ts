import { Request, Response, NextFunction } from "express";

import * as cardRepository from '../repositories/cardRepository';
import * as businessRepository from '../repositories/businessRepository';
import { formatCardDate } from "../services/cardServices";
import { compareCrypt } from "../services/encryptServices";
import { calculateBalance } from "../services/transactionsServices";
import handleError from "../services/errorServices";

export async function validateTransaction(req: Request, res: Response, next: NextFunction) {
    const card: cardRepository.Card = res.locals.card;
    const today = new Date();
    const expDate = formatCardDate(card.expirationDate);

    try {
        if (card.isBlocked || today > expDate) {
            return res.status(422).send("Error: card is blocked/not active or is already expired");
        }

        next();
    } catch (err) {
        res.status(500).send("On validateCardTransaction: " + err);
    }
}

export async function validatePayment(req: Request, res: Response, next: NextFunction) {
    const card: cardRepository.Card = res.locals.card;
    const { password, amount, businessId } = req.body;

    try {
        const validatePassword = compareCrypt(password, card.password);

        if (!validatePassword) {
            throw { code: "InvalidPassword", message: "Error: password is incorrect" };
        }

        const business = await businessRepository.findById(Number(businessId));

        if (!business) {
            throw { code: "NotBusiness", message: "Error: this business is not registered for our services" };
        }

        if (card.type !== business.type) {
            throw { code: "InvalidType", message: "Error: this card type is mismatched with this business" };
        }

        const balance = await calculateBalance(Number(card.id));

        if (amount > balance) {
            throw { code: "NotEnoughBalance", message: "Error: insufficient balance to perform the transaction" };
        }

        next();
    } catch (err: any) {
        if (err.code) {
            const statusCode = handleError(err.code);
            return res.status(statusCode).send("On validatePayment: " + err.message);
        }
        res.status(500).send("On validatePayment: " + err);
    }
}