import type { NextFunction, Request, Response } from "express";
import { type AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				res.status(400).json({
					message: error.errors.map((e) => e.message).join(", "),
				});
			}
			next(error);
		}
	};
};
