// types/nin.ts
export interface NinVerificationResponse {
    first_name: string;
    middle_name?: string;
    last_name: string;
    dob: string;
    gender: 'male' | 'female' | 'other';
  }
  