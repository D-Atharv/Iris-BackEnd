import express from 'express';
import { login, logout, signup,getMe } from '../controllers/authController';
import { protectRoute } from '../middleware/protectRoute';
import loginRateLimiter from '../middleware/loginRateLimiter';
const router = express.Router();

router.get('/me',protectRoute,getMe);
// /api/auth/login
router.post('/signup',signup);

router.post('/login',loginRateLimiter, login);

router.post('/logout', logout);


export default router;