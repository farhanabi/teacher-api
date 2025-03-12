import { Router } from "express";
import { suspend } from "../controllers/suspend";
import { validate } from "../middlewares/validation";
import { suspendSchema } from "../validations/suspend";

const router = Router();

router.post("/", validate(suspendSchema), suspend);

export default router;
