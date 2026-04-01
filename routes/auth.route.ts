import express from "express";
import { validateData } from "../middleware/validation";
import { signUpSchema } from "../schemas/auth";
import { signUp } from "../controllers/auth";

const router = express.Router();

router.post("/signup", validateData(signUpSchema), signUp);

export default router;
