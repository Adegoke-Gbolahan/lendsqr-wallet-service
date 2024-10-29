import express, { RequestHandler } from 'express';
import { registerUser } from '../controllers/userController';
import { fundWallet } from '../controllers/walletController';

const router = express.Router();

// Cast the handlers to RequestHandler to avoid type mismatch
router.post('/register', registerUser as RequestHandler);
router.post('/fund', fundWallet as RequestHandler);

export default router;
