export interface OptionalUserInfoDTO {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface UserInfoDTO {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
  roles: UserRoleDTO[];
}

export interface UserRoleDTO {
  id: number;
  name: string;
}

export interface ChangeEmailRequestDTO {
  email: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}