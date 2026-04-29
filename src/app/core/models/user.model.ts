export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'professional' | 'client';
  salonId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpDTO {
  email: string;
  password: string;
  name: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}
