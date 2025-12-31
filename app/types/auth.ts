export interface User {
  id: number;
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  full_name: string;
  avatar: string;
  // Add other user properties as needed
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  candidate: User;
  message: string;
}