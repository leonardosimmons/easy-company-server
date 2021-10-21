import Express from 'express';

export async function hasRequestBody(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<any> {
  if (!req.body) {
    res.statusCode = 404;
    res.send({ errors: 'Error: No request body was provided' });
    return;
  } else {
    return next();
  }
}

export async function hasRequestParams(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<any> {
  if (!req.params) {
    res.statusCode = 404;
    res.send({ errors: 'Error: No request parameters were provided' });
    return;
  } else {
    return next();
  }
}
