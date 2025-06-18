export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'Student' | 'trainer';
}

export interface NewUserCredentials {
  name: string;
  role: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface GymStatusUpdate {
  status: string;
}

export interface GymStatus {
  status: 'open' | 'closed';
  last_updated?: string;
  updated_by?: string;
}