import express from "express";
import { validateData } from "../middleware/validation";
import { loginSchema, signUpSchema } from "../schemas/auth";
import { login, signUp } from "../controllers/auth";

const router = express.Router();

router.post("/signup", validateData(signUpSchema), signUp);
router.post("/login", validateData(loginSchema), login);

export default router;
