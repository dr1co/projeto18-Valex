import joi from 'joi';

const cardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string().required().valid('groceries', 'restaurant', 'transport', 'education', 'health')
});

export default cardSchema;