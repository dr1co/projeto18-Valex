import { NextFunction, Request, Response } from "express";

import * as cardRepository from '../repositories/cardRepository';
import { decryptSecCode } from "../services/encryptServices";

export async function validateCard(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { securityCode } = req.body

    try {
        const card = await cardRepository.findById(Number(id));

        if (!card) {
            return res.status(404).send("Error: card not found");
        }

        const decrypted = decryptSecCode(card.securityCode);

        if (decrypted !== securityCode) {
            return res.status(401).send("Error: incorrect security code");
        }

        const today = new Date();
        const expDateMonth = card.expirationDate.slice(0, 2);
        const expDateYear = card.expirationDate.slice(3);
        const expDate = new Date(Number(`20${expDateYear}`), Number(expDateMonth) - 1);

        if (today > expDate) {
            return res.status(401).send("Error: card expired");
        }

        if (!card.isBlocked) {
            return res.status(422).send("Error: card is already active");
        }

        next();
    } catch (err) {
        res.status(500).send("On validateCard: " + err);
    }
}