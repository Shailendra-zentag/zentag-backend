import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth/auth.controller.js';
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout );
router.get("/me", verifyToken, getMe);

export default router;
