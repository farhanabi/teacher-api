import type { NextFunction, Request, Response } from "express";
import { registerStudentsToTeacher } from "../../services/teacher";
import { ApiError } from "../middlewares/error";
import type { RegisterRequest } from "../validations/register";

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { teacher, students } = req.body as RegisterRequest;

		await registerStudentsToTeacher(teacher, students);

		res.status(204).send();
		return;
	} catch (error) {
		if (error instanceof Error) {
			return next(new ApiError(400, error.message));
		}
		return next(error);
	}
};
