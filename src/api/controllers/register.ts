import { NextFunction, Request, Response } from 'express';
import { registerSchema } from '../validations/register';
import { registerStudentsToTeacher } from '../../services/teacher';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacher, students } = registerSchema.parse(req.body);
    
    await registerStudentsToTeacher(teacher, students);
    
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
