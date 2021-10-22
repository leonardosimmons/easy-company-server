import Express from 'express';

export async function hasValidCreateUserFields(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<any> {
  let errors = [];

  if (req.body) {
    if (!req.body.firstname) {
      errors.push('Missing firstname field');
    }
    if (!req.body.lastname) {
      errors.push('Missing lastname field');
    }
    if (!req.body.email) {
      errors.push('Missing email field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(',') });
    } else {
      return next();
    }
  } else {
    return res.status(400).send({ errors: 'No request body was provided' });
  }
}
