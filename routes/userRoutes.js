import express from 'express';
import { getUserTree, registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/tree/:code', getUserTree); 
export default router;
