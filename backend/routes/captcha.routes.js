import express from 'express';
import { generateCaptcha } from '../controllers/captcha.controller.js';

const router = express.Router();

router.get('/captcha/generate', generateCaptcha);

export default router;
