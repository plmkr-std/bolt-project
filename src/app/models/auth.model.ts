export interface LoginRequestDTO {
  login: string;
  password: string;
}

export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
  roles: UserRoleDTO[];
}

export interface UserRoleDTO {
  id: number;
  name: string;
}

export interface ResetPasswordRequestDTO {
  email: string;
}

export interface SetNewPasswordRequestDTO {
  token: string;
  password: string;
}

export interface ApiSuccessResponseDTO {
  message: string;
  data: any;
}

export interface ApiErrorResponseDTO {
  path: string;
  message: string;
  statusCode: number;
  localDateTime: string;
  errorMap?: Record<string, string>;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userData: any | null;
  loading: boolean;
  error: string | null;
}