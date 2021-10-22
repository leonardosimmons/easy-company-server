import Express from 'express';
import type { User } from '.prisma/client';
import { PrismaClient } from '@prisma/client';
import { httpError } from '../../../lib/functions';
import { HashController, HashToken } from '../../../lib/models/HashController';
import { UserModel } from '../model/user.model';

export async function createUser(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  const prisma = new PrismaClient();
  const pwHash: HashToken = new HashController().hash(req.body.password);
  const pw: string = pwHash.salt + '$' + pwHash.hash;

  try {
    const user = await prisma.user.create({
      data: {
        firstname: req.body.firstname,
        lastname: req.body.lastname || '',
        email: req.body.email,
        password: pw,
        permissionLevel: req.body.role === 'trial' ? 0 : 1,
        role: req.body.role === 'trial' ? req.body.role : 'user',
        status: 'offline',
      },
    });

    res.status(201).json({
      message: 'User successfully added to database',
      payload: {
        id: user.id,
      },
    });
  } catch (err) {
    const error = httpError(err as Error, 'Unable to add new user to database');
    next(error);
  }
}

// ----------------------------------------------------------------

export async function getUsers(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  const model = new UserModel();
  const prisma = new PrismaClient();
  let info: Partial<User>[] = [];

  if (req.query.page && req.query.per_page) {
    const page: number = parseInt(req.query.page as string);
    const per_page: number = parseInt(req.query.per_page as string);

    try {
      const users = await prisma.user.findMany({
        skip: per_page * (page - 1),
        take: per_page,
      });

      users.forEach((user) => {
        info.push(model.filterUserInfo(user));
      });

      res.status(200).json({
        message: 'Users successfully retrieved',
        payload: info,
      });
    } catch (err) {
      const error = httpError(
        err as Error,
        'Unable to retrieve user from database',
      );
      next(error);
    }
  } else {
    try {
      const users = await prisma.user.findMany();
      users.forEach((user) => {
        info.push(model.filterUserInfo(user));
      });

      res.status(200).json({
        message: 'Users successfully retrieved',
        payload: info,
      });
    } catch (err) {
      const error = httpError(
        err as Error,
        'Unable to retrieve user from database',
      );
      next(error);
    }
  }
}

// ----------------------------------------------------------------

export async function getUserById(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  const model = new UserModel();
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: String(req.params.userId),
      },
    });

    const info = model.filterUserInfo(user as User);
    res.status(200).json({
      message: 'User successfully retrieved',
      payload: {
        user: info,
      },
    });
  } catch (err) {
    const error = httpError(
      err as Error,
      'Unable to retrieve user from database',
    );
    next(error);
  }
}

// ----------------------------------------------------------------

export async function patchUser(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.user.update({
      where: {
        id: String(req.params.userId),
      },
      data: { ...req.body },
    });

    res.status(204).json({
      message: 'User successfully updated',
      payload: {
        id: result.id,
      },
    });
  } catch (err) {
    const error = httpError(err as Error, 'Unable to udpate user');
    next(error);
  }
}

// ----------------------------------------------------------------

export async function deleteUser(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.deleteMany({
      where: {
        id: String(req.params.userId),
      },
    });

    res.status(204).json({
      message: 'User succesfully deleted',
      payload: {
        user,
      },
    });
  } catch (err) {
    const error = httpError(err as Error, 'Unable to delete user');
    next(error);
  }
}
