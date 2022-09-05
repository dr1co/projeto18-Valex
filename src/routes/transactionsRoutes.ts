import express from 'express';

import { validateCard } from '../middlewares/validateCardMiddleware';
import { validateTransaction, validatePayment } from '../middlewares/validateTransactionMiddleware';
import { getTransactions, performPayment } from '../controllers/transactionsController';
import { rechargeSchema, paymentSchema } from '../schemas/transactionsSchema';
import { addRecharge } from '../controllers/transactionsController';
import validateSchema from '../middlewares/validateSchemaMiddleware';
import { validateCompany } from '../middlewares/validateCompanyMiddleware';

const transactionsRouter = express.Router();

transactionsRouter.get("/transactions/:id", validateCard, getTransactions);
transactionsRouter.post("/transactions/recharge/:id",validateSchema(rechargeSchema), validateCard, validateCompany, validateTransaction, addRecharge);
transactionsRouter.post("/transactions/payment/:id", validateSchema(paymentSchema), validateCard, validateTransaction, validatePayment, performPayment);

export default transactionsRouter;