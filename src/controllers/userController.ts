import Joi from 'joi';
import zxcvbn from 'zxcvbn';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { createUser,getUserByDetails,getUserByEmail, logUserActivity  } from '../models/userModel';
import { createWallet } from '../models/walletModel';
import { isBlacklisted,verifyNin } from '../services/lendsqrApiCallService';
import { RegisterUserRequestBody } from '../types/userTypes';
import { NinVerificationResponse } from '../types/nin';
import { cleanPhoneNumber } from '../helpers/validatePhoneNumber'


const registerUserSchema = Joi.object<RegisterUserRequestBody>({
  nin: Joi.string().required(),
  email: Joi.string().email().required(),
  bvn: Joi.string().length(11).required(),
  phone_number: Joi.string().required()  ,
  password:Joi.string().required()
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

    const { nin, email, bvn, phone_number, password } = value;

    // Check password strength
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return res.status(400).json({
        message: 'Password is too weak. Please use a stronger password.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    // Check for existing user
    const existingUser = await getUserByDetails(phone_number, bvn, email);
    if (existingUser) {
      return res
        .status(403)
        .json({ message: 'User Phone Number, BVN, or Email already exists' });
    }

    // Verify NIN
    const ninData = await verifyNin(nin) as NinVerificationResponse;
    if (!ninData) {
      return res.status(403).json({ message: 'Invalid NIN' });
    }
    const { first_name, last_name, dob, gender } = ninData;

    // Check if user is blacklisted
    const blacklisted = await isBlacklisted(bvn);
    if (blacklisted) {
      return res.status(403).json({ message: 'User is blacklisted' });
    }

    // Create user and wallet
    const accountAsPhoneNumber = cleanPhoneNumber(phone_number);
    const [userId] = await createUser({
      email,
      bvn,
      phone_number: accountAsPhoneNumber,
      first_name,
      last_name,
      dob,
      gender,
      password: hashedPassword, 
    });

    await createWallet(userId);
    await logUserActivity({
      user_id: userId,
      activity_type: 'Register',
      description: `User ${email} logged in`,
    });
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

export const loginUser = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
): Promise<Response<any> | void> => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    await logUserActivity({
      user_id: user.id,
      activity_type: 'login',
      description: `User ${email} logged in`,
    });
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Error logging in user' });
  }
};