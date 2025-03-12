import { Router } from 'express';
import { getCommonStudentsHandler } from '../controllers/commonStudents';

const router = Router();

router.get('/', getCommonStudentsHandler);

export default router;