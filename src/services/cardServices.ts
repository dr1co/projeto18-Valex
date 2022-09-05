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

        const secCode = faker.random.numeric(3).toString();

        const cardName = generateCardName(employee.fullName);
        const cardNumber = faker.random.numeric(16);
        const encryptedSecCode = encryptSecCode(secCode);
        const expDate = generateNewExpDate();

        const newCard = {
            employeeId: employee.id,
            number: cardNumber,
            cardholderName: cardName,
            securityCode: encryptedSecCode,
            expirationDate: expDate,
            password: null,
            isVirtual: false,
            originalCardId: null,
            isBlocked: true,
            type,
        }

        return { ...newCard, securityCode: secCode};
    } catch (err) {
        if (err === "CardFound") {
            throw { code: "CardFound", message: `Error: card with type '${type}' already exists` }
        } else {
            throw { code: "ServerProblem", message: err };
        }
    }
}

export function formatCardDate(date: string) {
    const expDateMonth = date.slice(0, 2);
    const expDateYear = date.slice(3);
    const newDate = new Date(Number(`20${expDateYear}`), Number(expDateMonth) - 1);
    return newDate;
}

function generateCardName(fullName: string) {
    const nameArray: string[] = fullName.toUpperCase().split(" ").filter(name => name.length >= 3);

    for (let i = 0; i < nameArray.length; i++) {
        if (i !== 0 && i !== nameArray.length - 1)
            nameArray[i] = nameArray[i].slice(0, 1);
    }

    return nameArray.join(" ");
}

function generateNewExpDate() {
    const today = new Date()
    const month = today.getMonth();
    const year = (today.getFullYear() % 100) + 5

    if (month < 10) return `0${month}/${year}`;
    else return `${month}/${year}`;
}