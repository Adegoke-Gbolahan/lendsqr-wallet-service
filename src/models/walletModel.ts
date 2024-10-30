import db from '../config/db';

export const createWallet = async (userId: number) => {
  return db('wallets').insert({ user_id: userId, balance: 0 });
};

export const getWalletByUserId = async (userId: number) => {
  return db('wallets').where({ user_id: userId }).first();
};

export const updateWalletBalance = async (userId: number, amount: number) => {
  return db('wallets').where({ user_id: userId }).increment('balance', amount);
};
export const generalUpdateWallet = async (userId: number, amount: number) => {
  return db('wallets').where({ user_id: userId }).update({ balance: amount });
};

