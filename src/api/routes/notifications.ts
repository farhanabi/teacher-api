import { Router } from 'express';
import { retrieveForNotifications } from '../controllers/notifications';

const router = Router();

router.post('/', retrieveForNotifications);

export default router;