import joi from 'joi';

export const cardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string().required().valid('groceries', 'restaurant', 'transport', 'education', 'health')
});

export const activateCardSchema = joi.object({
    securityCode: joi.string().required().pattern(/^[0-9]*$/, 'numbers').length(3),
    password: joi.string().required().pattern(/^[0-9]*$/, 'numbers').length(4)
});