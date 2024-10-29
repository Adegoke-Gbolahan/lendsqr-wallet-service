import axios from 'axios';

export const isBlacklisted = async (identity: string): Promise<boolean> => {
  try {
    const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/${identity}`, {
      headers: { 'Authorization': `Bearer ${process.env.ADJUTOR_API_KEY}` },
    });
    return response.data.blacklisted;
  } catch (error) {
    console.error('Error checking blacklist status:', error);
    return false;
  }
};
