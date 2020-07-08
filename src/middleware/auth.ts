import express from 'express';
import Users, { IUserModel } from '../models/User';

export function checkSignIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { userId } = req!.session!;
  // Check for token
  if (!userId) {
    return res.status(401).send('authorizaton denied');
  } else {
    res.locals.user = Users.findById(userId)
      .then((user: IUserModel | null) =>
        user
          ? {
              gamerTag: user.info.gamerTag,
              gender: user.info.gender,
              preferredPronoun: user.info.preferredPronoun,
              orientation: user.info.orientation,
              firstName: user.info.firstName,
              lastName: user.info.lastName,
              email: user.info.email,
              dob: user.info.dob,
            }
          : null
      )
      .catch((err) => res.status(404).send(err));
  }
  next();
}

export function checkSignOut(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { userId } = req!.session!;
  // Check for token
  if (!userId) {
    return res.status(401).send('Not logged in');
  }
  next();
}
