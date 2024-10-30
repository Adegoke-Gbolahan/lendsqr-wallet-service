import { Request, Response } from 'express';
import { getWalletByUserId, updateWalletBalance, generalUpdateWallet } from '../models/walletModel';
import { FundWalletRequestBody, TransferFundsRequestBody } from '../types/walletTypes';
import {  logUserActivity  } from '../models/userModel';


export const fundWallet = async (req: Request<{}, {}, FundWalletRequestBody>, res: Response): Promise<void> => {
  try {
    const { userId, amount } = req.body;

    await updateWalletBalance(userId, amount);
    await logUserActivity({
      user_id: userId,
      activity_type: 'Register',
      description: `User fund Wallet`,
    });
    await logUserActivity({
      user_id: userId,
      activity_type: 'fund_wallet',
      description: `User funded wallet with ${amount} units`,
      amount,
    });
    res.status(200).json({ message: 'Wallet funded successfully' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error funding wallet' });
  }
};
export const withdrawWallet = async (req: Request<{}, {}, FundWalletRequestBody>, res: Response): Promise<void> => {
  try {
    const { userId, amount } = req.body;
    const wallet = await getWalletByUserId(userId);
    if(wallet.balance < amount){
      res.status(400).json({ message: 'Insufficent Amount' });
    }
    await generalUpdateWallet(userId, parseFloat(wallet.balance) - amount);
    await logUserActivity({
      user_id: userId,
      activity_type: 'withdraw',
      description: `User withdrew ${amount} units`,
      amount,
    });
    res.status(200).json({ message: 'Withdrawal is successful' });
    return
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error funding wallet' });
  }
};

export const transferFunds = async (
  req: Request<{}, {}, TransferFundsRequestBody>,
  res: Response
): Promise<Response | void> => {
  try {
    const { senderId, recipientId, amount } = req.body;

    if (!senderId || !recipientId || !amount) {
      return res.status(400).json({ message: 'Sender, receipent and amount are required field' });
    }
    if (senderId === recipientId) {
      return res.status(400).json({ message: 'Sender and recipient cannot be the same.' });
    }

    const senderWallet = await getWalletByUserId(senderId);
    const recipientWallet = await getWalletByUserId(recipientId);

    if (!senderWallet || !recipientWallet) {
      return res.status(400).json({ message: 'Sender or recipient wallet not found.' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance for transfer.' });
    }

    // Deduct from sender's wallet
    await generalUpdateWallet(senderId, parseFloat(senderWallet.balance) - amount);


    // Add to recipient's wallet
    await generalUpdateWallet(recipientId, parseFloat(recipientWallet.balance) - amount);
    await logUserActivity({
      user_id: senderId,
      activity_type: 'transfer',
      description: `User transferred ${amount} units to user ${recipientId}`,
      amount,
    });
    await logUserActivity({
      user_id: recipientId,
      activity_type: 'receive_transfer',
      description: `User received ${amount} units from user ${senderId}`,
      amount,
    });
    return res.status(200).json({ message: 'Transfer successful.' });
  } catch (error) {
    console.error('Error during fund transfer:', error);
    return res.status(500).json({ message: 'Error transferring funds.' });
  }
};