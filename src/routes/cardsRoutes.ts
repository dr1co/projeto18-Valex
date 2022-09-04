import express, { IRouter } from 'express';

import validateSchema from '../middlewares/validateSchemaMiddleware';
import cardSchema from '../schemas/cardSchema';
import { validateEmployee } from '../middlewares/validateEmployeeMiddleware';
import { createCard } from '../controllers/cardController';

const cardRouter: IRouter = express.Router();

cardRouter.post("/cards", validateSchema(cardSchema), validateEmployee, createCard);

export default cardRouter;