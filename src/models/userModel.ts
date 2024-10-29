import db from '../config/db';

export const createUser = async (userData: { name: string; email: string }) => {
  return db('users').insert(userData);
};

export const getUserById = async (userId: number) => {
  return db('users').where({ id: userId }).first();
};
