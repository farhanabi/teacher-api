import { Router } from 'express';
import { register } from '../controllers/register';

const router = Router();

router.post('/', register);

export default router;