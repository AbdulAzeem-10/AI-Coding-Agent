import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.js';
const router = Router();

//ai sdk route
router.get('/get-result', aiController.getResult)


export default router;