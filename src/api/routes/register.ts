import { Router } from "express";
import { register } from "../controllers/register";
import { validate } from "../middlewares/validation";
import { registerSchema } from "../validations/register";

const router = Router();

router.post("/", validate(registerSchema), register);

export default router;
