// Auth Types
export interface User {
  id: number;
  name: string;
  username: string;
  mobile: string;
  email: string;
  points: number;
  photo: string;
  token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  mobile: string;
  username: string;
  photo: File | null;
}

export interface AuthResponse {
  data: User;
}

export interface MeResponse {
  data: User;
}
