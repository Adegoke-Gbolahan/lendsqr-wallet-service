import axios from 'axios';
import { NinVerificationResponse } from '../types/nin';

export const isBlacklisted = async (identity: string): Promise<boolean> => {
  try {
    const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/${identity}`, {
      headers: { 'Authorization': `Bearer ${process.env.ADJUTOR_API_KEY}` },
    });
    return response.data.message === "Identity not found in karma ecosystem"
      ? false
      : true;
  } catch (error) {
    // console.error('Error checking blacklist status:', error);
    return false;
  }
};

export const verifyNin = async (nin: string): Promise<NinVerificationResponse | {}> => {
  try {
    const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/nin/${nin}`, {
      headers: { Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}` },
    });

    const data: NinVerificationResponse = response.data.data;

    return {
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      dob: data.dob,
      gender: data.gender,
    };
  } catch (error) {
    console.error('Error verifying NIN:', error);
    return {};
  }
};
