import { Router } from 'express';
import { suspend } from '../controllers/suspend';

const router = Router();

router.post('/', suspend);

export default router;