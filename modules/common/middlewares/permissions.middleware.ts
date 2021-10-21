import Express from 'express';
import { PermissionLevel } from '../../auth/auth.config';

export function minimumPermissionLevelRequired(
  required_permission_level: number,
) {
  return async function (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) {
    const user_permission_level = parseInt(
      res.locals.jwt.permissionLevel as string,
    );
    if (user_permission_level >= required_permission_level) {
      return next();
    } else {
      return res.status(403).json({
        message: 'Invalid permssions',
      });
    }
  };
}

// ----------------------------------------------------------------

export async function onlySameUserOrAdmin(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  const user_permission_level = parseInt(res.locals.jwt.permissionLevel);
  const userId: string = res.locals.jwt.userId;
  if (req.params && req.params.userId && userId === req.params.userId) {
    return next();
  } else {
    if (user_permission_level & PermissionLevel.ADMIN) {
      return next();
    } else {
      return res.status(403).json({
        message: 'Invalid permissions',
      });
    }
  }
}

// ----------------------------------------------------------------

export async function sameUserCantDo(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  const userId: string = res.locals.jwt.userId;
  if (req.params.userId !== userId) {
    return next();
  } else {
    return res.status(400).json({
      message: 'Request cannot be performed by the same user',
    });
  }
}
