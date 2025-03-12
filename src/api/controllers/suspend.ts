import { NextFunction, Request, Response } from 'express';
import { SuspendRequest } from '../validations/suspend';
import { suspendStudent } from '../../services/student';
import { ApiError } from '../middlewares/error';

export const suspend = async (req: Request, res: Response, next: NextFunction) => {
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
