export interface RegisterUserRequestBody {
    name: string;
    email: string;
    bvn:string;
    phone_number:string;
    first_name: string;
    middle_name: string;
    last_name:string;
    dob:string;
    gender:string;
    nin:string;
    password:string
  }

  export interface UserLog {
    user_id: number;
    activity_type: string;
    description: string;
    amount?: number;
  }
  