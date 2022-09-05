import * as paymentRepository from '../repositories/paymentRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';

export async function calculateBalance(id: number) {
    let balance = 0;
    
    try {
        const transactions = await paymentRepository.findByCardId(Number(id));
        const recharges = await rechargeRepository.findByCardId(Number(id));
        const transactionsValues: number[] = [];
        const rechargesValues: number[] = [];

        transactions.map(t => transactionsValues.push(t.amount));
        recharges.map(r => rechargesValues.push(r.amount));

        rechargesValues.map(r => balance += r)
        transactionsValues.map(t => balance -= t);

        return balance;
    } catch (err) {
        throw { code: "ServerProblem", message: "On calculateBalance: " + err };
    }
}