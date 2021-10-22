import Express from 'express';
import * as UserController from './controllers/user.controllers';
import * as UserMiddleware from './middleware/user.middleware';
import * as PermissionMiddleware from '../common/middlewares/permissions.middleware';
import * as ValidationMiddleware from '../common/middlewares/validation.middleware';
import * as RequestFieldsMiddleWare from '../common/middlewares/common.fields';
import { PermissionLevel } from '../auth/auth.config';

const router = Express.Router();

router.post('/create-user', [
  UserMiddleware.hasValidCreateUserFields,
  UserController.createUser,
]);

router.get('/users', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.USER),
  RequestFieldsMiddleWare.hasRequestBody,
  UserController.getUsers,
]);

router.get('/:userId', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.USER),
  PermissionMiddleware.onlySameUserOrAdmin,
  RequestFieldsMiddleWare.hasRequestParams,
  UserController.getUserById,
]);

router.patch('/:userId', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.USER),
  PermissionMiddleware.onlySameUserOrAdmin,
  RequestFieldsMiddleWare.hasRequestBody,
  UserController.patchUser,
]);

router.delete('/:userId', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.ADMIN),
  UserController.deleteUser,
]);

export default router;
