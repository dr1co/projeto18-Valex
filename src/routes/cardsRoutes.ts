import express from 'express';

import validateSchema from '../middlewares/validateSchemaMiddleware';
import { cardSchema, activateCardSchema, passwordSchema} from '../schemas/cardSchema';
import { validateEmployee } from '../middlewares/validateEmployeeMiddleware';
import { validateCardActivation, validateCard, validateCardBlock, validateCardUnblock } from '../middlewares/validateCardMiddleware';
import { createCard, activateCard, blockCard, unblockCard } from '../controllers/cardController';
import { validateCompany } from '../middlewares/validateCompanyMiddleware';

const cardRouter = express.Router();

cardRouter.post("/cards", validateSchema(cardSchema), validateEmployee, validateCompany, createCard);
cardRouter.put("/cards/activate/:id", validateSchema(activateCardSchema), validateCard, validateCardActivation, activateCard);
cardRouter.put("/cards/block/:id", validateSchema(passwordSchema), validateCard, validateCardBlock, blockCard);
cardRouter.put("/cards/unblock/:id", validateSchema(passwordSchema), validateCard, validateCardUnblock, unblockCard);

export default cardRouter;