import express, { IRouter } from 'express';

import validateSchema from '../middlewares/validateSchemaMiddleware';
import { cardSchema, activateCardSchema} from '../schemas/cardSchema';
import { validateEmployee } from '../middlewares/validateEmployeeMiddleware';
import { validateCardActivation, validateCard } from '../middlewares/validateCardMiddleware';
import { createCard, activateCard, getTransactions } from '../controllers/cardController';

const cardRouter: IRouter = express.Router();

cardRouter.post("/cards", validateSchema(cardSchema), validateEmployee, createCard);
cardRouter.put("/cards/activate/:id", validateSchema(activateCardSchema), validateCardActivation, activateCard);
cardRouter.get("/cards/transactions/:id", validateCard, getTransactions)

export default cardRouter;