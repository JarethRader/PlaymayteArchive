import express from 'express';

export default function sendCSRF(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.csrfToken();
  res.cookie('CSRF-Token', token);
  res.locals.csrftoken = token;
  next();
}
