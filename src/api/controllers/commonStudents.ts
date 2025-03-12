import { NextFunction, Request, Response } from 'express';
import { getCommonStudents } from '../../services/teacher';
import { ApiError } from '../middlewares/error';

export const getCommonStudentsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherParam = req.query.teacher;

    const teacherEmails = Array.isArray(teacherParam) 
      ? teacherParam as string[] 
      : [teacherParam as string];
    
    const commonStudentEmails = await getCommonStudents(teacherEmails);
    
    res.status(200).json({ students: commonStudentEmails });
    return;
  } catch (error) {
    if (error instanceof Error) {
      return next(new ApiError(400, error.message));
    }
    return next(error);
  }
};
