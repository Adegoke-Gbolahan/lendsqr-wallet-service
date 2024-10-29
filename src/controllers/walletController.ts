import { Request, Response } from 'express';
import { getWalletByUserId, updateWalletBalance } from '../models/walletModel';
import { FundWalletRequestBody } from '../types/walletTypes';


export const fundWallet = async (req: Request<{}, {}, FundWalletRequestBody>, res: Response): Promise<void> => {
  try {
    const { userId, amount } = req.body;

    await updateWalletBalance(userId, amount);
    res.status(200).json({ message: 'Wallet funded successfully' });
  } catch (error) {
    console.error(error); // Log the error for better debugging
    res.status(500).json({ message: 'Error funding wallet' });
  }
};
