import db from '../config/db';
import {UserLog} from "../types/userTypes"
export const createUser = async (userData: object) => {
  return db('users').insert(userData);
};

export const getUserById = async (userId: number) => {
  return db('users').where({ id: userId }).first();
};

export const getUserByDetails = async (
  phone_number?: string,
  bvn?: string,
  email?: string
) => {
  const query = db('users');

  if (phone_number) {
    query.orWhere({ phone_number });
  }

  if (bvn) {
    query.orWhere({ bvn });
  }

  if (email) {
    query.orWhere({ email });
  }

  const user = await query.first();
  return user;
};

export const getUserByEmail = async (email: string) => {
  return db('users').where({ email }).first();
};

export const logUserActivity = async (log: UserLog): Promise<void> => {
  try {
    await db('user_logs').insert(log);
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};