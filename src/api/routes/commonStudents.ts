import { Router } from 'express';
import { getCommonStudentsHandler } from '../controllers/commonStudents';
import { validate } from '../middlewares/validation';
import { commonStudentsSchema } from '../validations/commonStudents';

const router = Router();

router.get('/', validate(commonStudentsSchema), getCommonStudentsHandler);

export default router;