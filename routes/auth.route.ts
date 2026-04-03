import express from "express";
import { validateData } from "../middleware/validation";
import { loginSchema, signUpSchema } from "../schemas/auth";
import { login, session, signUp } from "../controllers/auth";
import { tokenMiddleware } from "../middleware/middleware";

const router = express.Router();

router.post("/signup", validateData(signUpSchema), signUp);
router.post("/login", validateData(loginSchema), login);
router.get("/session", tokenMiddleware(), session);

export default router;
