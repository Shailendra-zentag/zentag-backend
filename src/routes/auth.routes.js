import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth/auth.controller.js';
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout );
router.get("/me", verifyToken, getMe);
router.get("/test", (req, res) => {
  res.json({ 
    message: "Auth route working", 
    cookies: req.cookies,
    headers: req.headers.authorization ? "Authorization header present" : "No Authorization header"
  });
});

export default router;
