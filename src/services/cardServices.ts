import { faker } from '@faker-js/faker';

import { Employee } from '../repositories/employeeRepository';
import * as cardRepository from '../repositories/cardRepository';
import { encryptSecCode } from './encryptServices';

export async function generateCardData(employee: Employee, type: cardRepository.TransactionTypes) {
    try {
        const card = await cardRepository.findByTypeAndEmployeeId(type, employee.id);

        if (card) {
            throw "CardFound";
        }

        const cardName = generateCardName(employee.fullName);
        const cardNumber = faker.random.numeric(16);
        const secCode = encryptSecCode(faker.random.numeric(3).toString());
        const expDate = generateExpDate();

        const newCard = {
            employeeId: employee.id,
            number: cardNumber,
            cardholderName: cardName,
            securityCode: secCode,
            expirationDate: expDate,
            password: null,
            isVirtual: false,
            originalCardId: null,
            isBlocked: true,
            type,
        }

        return newCard;
    } catch (err) {
        if (err === "CardFound") {
            throw { code: "CardFound", message: `Error: card with type '${type}' already exists` }
        } else {
            throw { code: "ServerProblem", message: err };
        }
    }
}

export function calculateBalance(transactions: number[], recharges: number[]) {
    let balance = 0;

    recharges.map(r => balance += r)
    transactions.map(t => balance -= t);

    return balance;
}

function generateCardName(fullName: string) {
    const nameArray: string[] = fullName.toUpperCase().split(" ").filter(name => name.length >= 3);

    for (let i = 0; i < nameArray.length; i++) {
        if (i !== 0 && i !== nameArray.length - 1)
            nameArray[i] = nameArray[i].slice(0, 1);
    }

    return nameArray.join(" ");
}

function generateExpDate() {
    const today = new Date()
    const month = today.getMonth();
    const year = (today.getFullYear() % 100) + 5

    if (month < 10) return `0${month}/${year}`;
    else return `${month}/${year}`;
}