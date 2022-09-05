import joi from 'joi';

export const rechargeSchema = joi.object({
    amount: joi.number().required().positive()
});

export const paymentSchema = joi.object({
    amount: joi.number().required().positive(),
    businessId: joi.number().required(),
    password: joi.string().required().pattern(/^[0-9]*$/, 'numbers').length(4)
});