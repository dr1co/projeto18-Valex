import { NextFunction, Request, Response } from "express";

import * as cardRepository from '../repositories/cardRepository';
import { decryptSecCode, compareCrypt } from "../services/encryptServices";
import { generateCardDate } from "../services/cardServices";

export async function validateCardActivation(req: Request, res: Response, next: NextFunction) {
    const { securityCode } = req.body
    const card: cardRepository.Card = res.locals.card

    try {
        const decrypted = decryptSecCode(card.securityCode);

        if (decrypted !== securityCode) {
            return res.status(401).send("Error: incorrect security code");
        }

        const today = new Date();
        const expDate = generateCardDate(card.expirationDate);

        if (today > expDate) {
            return res.status(401).send("Error: card expired");
        }

        if (!card.isBlocked) {
            return res.status(422).send("Error: card is already active");
        }

        next();
    } catch (err) {
        res.status(500).send("On validateCardActivation: " + err);
    }
}

export async function validateCardBlock(req: Request, res: Response, next: NextFunction) {
    const card: cardRepository.Card = res.locals.card;
    const { password } = req.body;
    const today = new Date();
    const expDate = generateCardDate(card.expirationDate);

    try {
        if (!card.password || card.isBlocked || today > expDate) {
            return res.status(422).send("Error: card is not active or is already blocked/expired");
        }

        const validate = compareCrypt(password, card.password);

        if (!validate) {
            return res.status(401).send("Error: password is incorrect");
        }

        next();
    } catch (err) {
        res.status(500).send("on validateCardBlock: " + err);
    }
}

export async function validateCardUnblock(req: Request, res: Response, next: NextFunction) {
    const card: cardRepository.Card = res.locals.card;
    const { password } = req.body;
    const today = new Date();
    const expDate = generateCardDate(card.expirationDate);

    try {
        if (!card.password || !card.isBlocked || today > expDate) {
            return res.status(422).send("Error: card is not active or is already unblocked/expired");
        }

        const validate = compareCrypt(password, card.password);

        if (!validate) {
            return res.status(401).send("Error: password is incorrect");
        }

        next();
    } catch (err) {
        res.status(500).send("on validateCardUnblock: " + err);
    }
}

export async function validateCard(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
        const card = await cardRepository.findById(Number(id));

        if (!card) {
            return res.status(404).send("Error: card not found");
        }

        res.locals.card = card;

        next();
    } catch (err) {
        res.status(500).send("On validateCard: " + err);
    } 
}