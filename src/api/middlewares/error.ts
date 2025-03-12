import type { NextFunction, Request, Response } from "express";
import { logger } from "../../utils/logger.js";

export class ApiError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.name = "ApiError";
	}
}

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	logger.error(`API Error: ${err.message}`, {
		method: req.method,
		url: req.originalUrl,
		ip: req.ip,
		statusCode: err instanceof ApiError ? err.statusCode : 500,
		stack: err.stack,
	});

	if (err instanceof ApiError) {
		res.status(err.statusCode).json({
			message: err.message,
		});
		return;
	}

	// Default to 500 server error
	res.status(500).json({
		message: "An unexpected error occurred",
	});
};
