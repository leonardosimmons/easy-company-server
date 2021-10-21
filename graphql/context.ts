import { PrismaClient } from '@prisma/client';
import type { UserAuthorization, UserInfo } from '../modules/user';

export interface Context {
  auth: UserAuthorization;
  prisma: PrismaClient;
  user: Omit<UserInfo, 'password'>;
}

const prisma = new PrismaClient();

const authInitialState: UserAuthorization = {
  id: null,
  role: 'trial',
  permissionLevel: 0
}

const userInitialState: Omit<UserInfo, 'password'> = {
  firstname: '',
  lastname: '',
  email: '',
}

export const context: Context = {
  auth: authInitialState,
  prisma: prisma,
  user: userInitialState,
}