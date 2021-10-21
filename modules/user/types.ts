import { PermissionLevel } from '../auth/enums';

export type UserAuthorization = {
  id: null | string;
  role: 'trial' | 'user' | 'paid' | 'admin';
  permissionLevel:
    | PermissionLevel.TRIAL
    | PermissionLevel.USER
    | PermissionLevel.PAID
    | PermissionLevel.ADMIN;
};

export type UserInfo = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type UserStatus = {
  status: 'offline' | 'online';
};

export type User = UserAuthorization & UserInfo & UserStatus;
