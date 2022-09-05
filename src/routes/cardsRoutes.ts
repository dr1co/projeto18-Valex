import express, { IRouter } from 'express';

import validateSchema from '../middlewares/validateSchemaMiddleware';
import { cardSchema, activateCardSchema, passwordSchema} from '../schemas/cardSchema';
import { validateEmployee } from '../middlewares/validateEmployeeMiddleware';
import { validateCardActivation, validateCard, validateCardBlock, validateCardUnblock } from '../middlewares/validateCardMiddleware';
import { createCard, activateCard, getTransactions, blockCard, unblockCard } from '../controllers/cardController';

const cardRouter: IRouter = express.Router();

cardRouter.post("/cards", validateSchema(cardSchema), validateEmployee, createCard);
cardRouter.put("/cards/activate/:id", validateSchema(activateCardSchema), validateCard, validateCardActivation, activateCard);
cardRouter.get("/cards/transactions/:id", validateCard, getTransactions);
cardRouter.put("/cards/block/:id", validateSchema(passwordSchema), validateCard, validateCardBlock, blockCard);
cardRouter.put("/cards/unblock/:id", validateSchema(passwordSchema), validateCard, validateCardUnblock, unblockCard);

export default cardRouter;