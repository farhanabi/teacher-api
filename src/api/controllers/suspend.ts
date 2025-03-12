import type { NextFunction, Request, Response } from "express";
import { suspendStudent } from "../../services/student";
import { ApiError } from "../middlewares/error";
import type { SuspendRequest } from "../validations/suspend";

export const suspend = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { student } = req.body as SuspendRequest;

		await suspendStudent(student);

		res.status(204).send();
		return;
	} catch (error) {
		if (error instanceof Error) {
			return next(new ApiError(400, error.message));
		}
		return next(error);
	}
};
