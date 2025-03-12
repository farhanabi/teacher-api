import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${err.message}`);
  
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }
  
  // Default to 500 server error
  res.status(500).json({
    message: 'An unexpected error occurred',
  });
};