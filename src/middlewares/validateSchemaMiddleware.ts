import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export default function validateSchema(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { body } = req;
        const { error } = schema.validate(body);

        if (error) {
            return res.status(422).send(error.details.map(detail => detail.message));
        }

        next();
    }
}