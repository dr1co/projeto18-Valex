import { NextFunction, Request, Response } from "express";

import { findById as findEmployee } from "../repositories/employeeRepository";

export async function validateEmployee(req: Request, res: Response, next: NextFunction) {
    const { employeeId } = req.body;

    try {
        const employee = await findEmployee(employeeId);

        if (!employee) {
            return res.status(404).send("Error: user not found");
        }

        res.locals.employee = employee;
        next();
    } catch (err) {
        res.status(500).send("On validateEmployee: " + err);
    }
}