import { Router } from 'express';
import registerRoutes from './register';
import commonStudentsRoutes from './commonStudents';
import suspendRoutes from './suspend';
import notificationsRoutes from './notifications';

const router = Router();

// Register all routes
router.use('/register', registerRoutes);
router.use('/commonstudents', commonStudentsRoutes);
router.use('/suspend', suspendRoutes);
router.use('/retrievefornotifications', notificationsRoutes);

export default router;