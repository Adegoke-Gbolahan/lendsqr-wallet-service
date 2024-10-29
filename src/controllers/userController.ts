import { Request, Response } from 'express';
import { createUser } from '../models/userModel';
import { createWallet } from '../models/walletModel';
import { isBlacklisted } from '../services/blacklistService';
import { RegisterUserRequestBody } from '../types/userTypes';
import Joi from 'joi';

const registerUserSchema = Joi.object<RegisterUserRequestBody>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  bvn: Joi.string().length(11).required()  // Assuming BVN is 11 digits
});

export const registerUser = async (
  req: Request<{}, {}, RegisterUserRequestBody>,
  res: Response
): Promise<Response<any> | void> => {
  try {
    // Validate request payload
    const { error, value } = registerUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, bvn } = value;

    // Check if user is blacklisted
    const blacklisted = await isBlacklisted(bvn);
    if (blacklisted) {
      return res.status(403).json({ message: 'User is blacklisted' });
    }

    // Create user and wallet
    const [userId] = await createUser({ name, email });
    await createWallet(userId);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};
