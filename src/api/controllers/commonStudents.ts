import { NextFunction, Request, Response } from 'express';
import { getCommonStudents } from '../../services/teacher';

export const getCommonStudentsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherParam = req.query.teacher;
    
    if (!teacherParam) {
      res.status(400).json({ message: 'Teacher parameter is required' });
    }
    
    const teacherEmails = Array.isArray(teacherParam) 
      ? teacherParam as string[] 
      : [teacherParam as string];
    
    const commonStudentEmails = await getCommonStudents(teacherEmails);
    
    res.status(200).json({ students: commonStudentEmails });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
