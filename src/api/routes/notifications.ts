import { Router } from 'express';
import { retrieveForNotifications } from '../controllers/notifications';
import { validate } from '../middlewares/validation';
import { notificationsSchema } from '../validations/notifications';

const router = Router();

router.post('/', validate(notificationsSchema), retrieveForNotifications);

export default router;