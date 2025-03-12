import { NextFunction, Request, Response } from 'express';
import { suspendSchema } from '../validations/suspend';
import { suspendStudent } from '../../services/student';

export const suspend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student } = suspendSchema.parse(req.body);
    
    await suspendStudent(student);
    
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
