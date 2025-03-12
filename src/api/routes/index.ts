import { Router } from "express";
import commonStudentsRoutes from "./commonStudents";
import notificationsRoutes from "./notifications";
import registerRoutes from "./register";
import suspendRoutes from "./suspend";

const router = Router();

// Register all routes
router.use("/register", registerRoutes);
router.use("/commonstudents", commonStudentsRoutes);
router.use("/suspend", suspendRoutes);
router.use("/retrievefornotifications", notificationsRoutes);

export default router;
