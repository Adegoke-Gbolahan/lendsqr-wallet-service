import express, { RequestHandler } from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { fundWallet,withdrawWallet, transferFunds } from '../controllers/walletController';
import {authenticateToken} from "../helpers/authMiddleware"

const router = express.Router();
 
router.post('/login', loginUser as RequestHandler);
router.post('/register-user', registerUser as RequestHandler);
router.post('/fund-wallet', authenticateToken, fundWallet as RequestHandler);
router.post('/wallet-withdrawal', authenticateToken, withdrawWallet as RequestHandler);
router.post('/transfer-fund', authenticateToken, transferFunds as RequestHandler);

export default router;
