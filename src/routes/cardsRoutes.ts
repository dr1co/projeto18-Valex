import express, { IRouter } from 'express';

import validateSchema from '../middlewares/validateSchemaMiddleware';
import { cardSchema, activateCardSchema} from '../schemas/cardSchema';
import { validateEmployee } from '../middlewares/validateEmployeeMiddleware';
import { validateCard } from '../middlewares/validateCardMiddleware';
import { createCard, activateCard } from '../controllers/cardController';

const cardRouter: IRouter = express.Router();

cardRouter.post("/cards", validateSchema(cardSchema), validateEmployee, createCard);
cardRouter.put("/cards/activate/:id", validateSchema(activateCardSchema), validateCard, activateCard);

export default cardRouter;