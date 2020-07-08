import express, { Request, Response, Router } from 'express';
import { check, validationResult, ValidationChain } from 'express-validator';
import { envConfig } from '../env/envConfig';
import fs from 'fs';
import path from 'path';
const userRouter: Router = express.Router();

import User, { IUserInfo, IUserModel } from '../models/User';
import FriendList, { IFriendListModel } from '../models/FriendList';
import Chat from '../models/Chat';
import Match from '../models/Match';
import Prospect, { IProspectModel } from '../models/Prospect';

import genderTypes, { getGender } from '../utils/genderTypes';
import preferredPronouns, { getPreferredPronouns } from '../utils/pronounTypes';
import orientationTypes, { getOrientation } from '../utils/orientationTypes';

import { _removeFriend } from '../utils/socialUtils';
import { _addNew, _removeFromAll } from '../utils/prospectUtils';
import { sendEmailVerification, sendResetPassword } from '../utils/emailUtils';
import {
  uploadNewProfilePhoto,
  deleteProfilePicture,
} from '../utils/imageHandlerUtils';

import * as argon2 from 'argon2';
import * as auth from '../middleware/auth';
import sendCSRF from '../middleware/csrf';

const rateLimit = require('express-rate-limit');
const createAccountLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message: 'Too many sign in attempts, please try again in 5 minutes',
});

const exportUser = (user: IUserModel): IUserInfo => {
  const returnUser = {
    id: user._id,
    gamerTag: user.info.gamerTag,
    gender: user.info.gender,
    preferredPronoun: user.info.preferredPronoun,
    orientation: user.info.orientation,
    firstName: user.info.firstName,
    lastName: user.info.lastName,
    email: user.info.email,
    dob: user.info.dob,
  };

  return returnUser;
};

/**
 * @route GET user/
 * @desc checks if user is signed in
 * @access private
 */
userRouter.get('/', sendCSRF, async (req: Request, res: Response) => {
  if (req!.session!.userId) {
    return res.status(200).send({ success: true });
  } else {
    return res.status(401).send({ success: false });
  }
});

/**
 * @route GET user/fullProfile
 * @desc returns full user profile
 * @access private
 */
userRouter.get(
  '/fullProfile',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    try {
      await User.findById(req!.session!.userId)
        .then((user) => {
          if (user) {
            return res.status(200).send({
              info: exportUser(user),
              games: user.games,
              animes: user.animes,
              aboutMe: user.aboutMe,
            });
          } else {
            throw new Error('Failed to find user');
          }
        })
        .catch((err) => {
          console.error(err);
          throw new Error('Failed to find user');
        });
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
);

/**
 * @route GET user/info
 * @desc returns use information
 * @access private
 */
userRouter.get(
  '/info',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (req.session) {
      User.findById(req.session.userId)
        .then((user: IUserModel | null) => {
          if (user) {
            res.status(200).json(exportUser(user));
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(404).send({ err });
        });
    }
  }
);

/**
 * @route POST users/signup
 * @desc register a new user
 * @access public
 * @TODO implement nodemailer to verify email
 */
userRouter.post(
  '/register',
  [
    check('firstName')
      .isLength({ min: 2 })
      .isAlpha()
      .withMessage('Must only be aphanumeric letters'),
    check('lastName')
      .isLength({ min: 2 })
      .isAlpha()
      .withMessage('Must only be aphanumeric letters'),
    check('password').isLength({ min: 8 }),
    check('email')
      .isEmail()
      .withMessage('Invalid Email')
      .custom(
        (email: string): Promise<ValidationChain | void> => {
          return User.findOne({ email }).then((user: IUserModel | null) => {
            if (user) {
              throw new Error('Email is already registered');
            }
          });
        }
      ),
  ],
  async (req: Request, res: Response): Promise<Response | undefined> => {
    if (!validationResult(req).isEmpty()) {
      console.error(validationResult(req).array());
      return res.status(422).json({ errors: validationResult(req).array() });
    }
    try {
      await User.findOne({ 'info.email': req.body.email.toLowerCase() })
        .then(async (user) => {
          if (user !== null) {
            return res.status(400).send({
              err: 'That email address is already registered',
            });
          } else {
            const userInput: IUserInfo = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email.toLowerCase(),
              password: req.body.password,
              gamerTag: req.body.gamerTag ? req.body.gamerTag : '',
              gender: req.body.gender
                ? getGender(req.body.gender)
                : genderTypes.forgo,
              preferredPronoun: req.body.preferredPronoun
                ? getPreferredPronouns(req.body.preferredPronoun)
                : preferredPronouns.forgo,
              orientation: req.body.orientation
                ? getOrientation(req.body.orientation)
                : orientationTypes.forgo,
              dob: req.body.dob,
            };
            const userInfo = {
              info: userInput,
            };
            const newUser: IUserModel = new User(userInfo);
            await argon2
              .hash(req.body.password)
              .then(async (hash: string) => {
                const hashedPassword: string = hash.substring(
                  hash.indexOf('p=') + 2,
                  hash.length
                );
                newUser.info.password = hashedPassword;

                // create friend list for new user
                const newFriendList: IFriendListModel = new FriendList({
                  userID: newUser.id,
                });

                const newProspect: IProspectModel = new Prospect({
                  userID: newUser.id,
                });
                await newUser.save();
                await newFriendList.save();
                await newProspect.save().then(async (savedProspect) => {
                  await _addNew(newUser.id).catch((err) => {
                    throw err;
                  });
                });
                const defaultPic = fs.readFileSync(
                  path.join(__dirname, '../resources/profile.png')
                );
                uploadNewProfilePhoto(
                  `images/${newUser.id}/profile.png`,
                  'image/png',
                  defaultPic
                ).catch((err) => {
                  throw err;
                });

                sendEmailVerification(
                  newUser._id,
                  newUser.info.firstName,
                  newUser.info.lastName,
                  newUser.info.email
                ).catch((err) => {
                  throw err;
                });

                req!.session!.userId = newUser.id;
                res.cookie('XSFR-TOKEN', req.csrfToken());
                return res.status(200).send(exportUser(newUser));
              })
              .catch((err) => {
                console.error(err);
                return res.status(500).send({ err });
              });
          }
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.error(err);
      return res.status(400).send({ err: 'Invalid input' });
    }
  }
);

/**
 * @route POST users/login
 * @desc Login in using email and password
 * @access public
 */
interface ILogin {
  email: string;
  password: string;
}
userRouter.post(
  '/login',
  [
    (check('email').isEmail(), check('password').isLength({ min: 8 })),
    createAccountLimiter,
  ],
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      console.error(validationResult(req).array());
      // return res.status(422).json({ errors: validationResult(req).array() });
      return res.status(400).send({ err: 'No password entered' });
      // }
    }
    const loginInfo: ILogin = req.body;
    await User.findOne({ 'info.email': loginInfo.email.toLowerCase() })
      .then(async (user: IUserModel | null) => {
        if (user === null) {
          return res.status(400).send({
            err:
              'The email address you provided is not associated with an account',
          });
        } else {
          const checkPassword: string =
            /* tslint:disable */
            envConfig['ARGON_HASH_METADATA']! + user.info.password;
          /* tslint:enable */
          argon2
            .verify(checkPassword, loginInfo.password)
            .then((verified: boolean) => {
              if (verified) {
                req!.session!.userId = user.id;
                return res.status(200).send(exportUser(user));
              } else {
                return res.status(400).send({ err: 'Invalid Password' });
              }
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).send({ err: 'Could not verify password' });
            });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).send({ err: 'Could not connect to database' });
      });
  }
);

/**
 * @route POST user/logout
 * @desc log user out and destroy session
 * @access private
 */
userRouter.post(
  '/logout',
  auth.checkSignOut,
  async (req: Request, res: Response) => {
    req!.session!.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(400).send({ err: 'Logout failed' });
      }
      /* tslint:disable */
      res.clearCookie(envConfig['SESS_NAME'] as string);
      /* tslint:enable */
      return res.status(200).send({ msg: 'Logout successful' });
    });
  }
);

/**
 * @route GET user/about
 * @desc gets the current users about me description
 * @access private
 */
userRouter.get(
  '/about',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    try {
      await User.findById(req!.session!.userId)
        .then((user) => {
          if (user) {
            return res.status(200).send({ aboutMe: user.aboutMe });
          } else {
            throw new Error('Failed to get user');
          }
        })
        .catch((err) => {
          console.error(err);
          throw new Error('Failed to find user');
        });
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
);

/**
 * @route PUT /user/about
 * @desc update users about me description
 * @access private
 */
userRouter.put(
  '/about',
  auth.checkSignIn,
  [check('aboutMe').isLength({ max: 500 })],
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      console.error(validationResult(req).array());
      return res.status(422).json({ errors: validationResult(req).array() });
    }
    try {
      await User.findById(req!.session!.userId)
        .then((user: IUserModel | null) => {
          if (user) {
            user.aboutMe = req.body.aboutMe;
            user
              .save()
              .then((updatedUser: IUserModel) => {
                return res.status(200).send({ aboutMe: updatedUser.aboutMe });
              })
              .catch((err: Error) => {
                console.error(err);
                throw new Error('Failed to update user');
              });
          } else {
            throw new Error('Failed to get user');
          }
        })
        .catch((err: Error) => {
          console.error(err);
          throw new Error('Failed to find user');
        });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ err });
    }
  }
);

/**
 * @route PUT user/update
 * @desc update user information
 * @access private
 * @TODO implement nodemailer to verify email
 */

userRouter.put(
  '/updateInfo',
  [
    check('firstName')
      .optional()
      .isLength({ min: 2 })
      .isAlpha()
      .withMessage('Must only be aphanumeric letters'),
    check('lastName')
      .optional()
      .isLength({ min: 2 })
      .isAlpha()
      .withMessage('Must only be aphanumeric letters'),
    check('email').optional().isEmail().withMessage('Invalid Email'),
  ],
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      console.error(validationResult(req).array());
      return res.status(422).json({ errors: validationResult(req).array() });
    }
    await User.findById(req!.session!.userId)
      .then(async (user: IUserModel | null) => {
        if (user) {
          if (req.body.firstName) user.info.firstName = req.body.firstName;
          if (req.body.lastName) user.info.lastName = req.body.lastName;
          if (req.body.gamerTag) user.info.gamerTag = req.body.gamerTag;
          if (req.body.gender) user.info.gender = req.body.gender;
          if (req.body.preferredPronoun)
            user.info.preferredPronoun = req.body.preferredPronoun;
          if (req.body.orientation)
            user.info.orientation = req.body.orientation;
          if (req.body.email) user.info.email = req.body.email;
          await user
            .save()
            .then((newUser: IUserModel) => {
              if (newUser) {
                return res.status(200).send(exportUser(newUser));
              } else {
                throw new Error('Could not save user');
              }
            })
            .catch((err: Error) => {
              console.error(err);
              throw err;
            });
        }
      })
      .catch((err: Error) => {
        console.error(err);
        return res.status(500).send({ err });
      });
  }
);

/**
 * @route DELETE /user
 * @desc delete account
 * @access private
 */
userRouter.delete('/', auth.checkSignIn, (req: Request, res: Response) => {
  User.findByIdAndRemove(req!.session!.userId)
    .then((success) => {
      Chat.deleteMany({
        $or: [
          { 'room.userI._ID': req!.session!.userId },
          { 'room.userII._ID': req!.session!.userId },
        ],
      })
        .then((chatsRemoved) => {
          Match.deleteMany({
            $or: [
              { 'UserIMatched.userID': req!.session!.userId },
              { 'UserIIMatched.userID': req!.session!.userId },
            ],
          })
            .then((matchesRemoved) => {
              FriendList.findOneAndDelete({
                userID: req!.session!.userId,
              })
                .then((list) => {
                  if (list) {
                    list.FriendList.forEach((friend) => {
                      _removeFriend(
                        friend.friendID,
                        req!.session!.userId
                      ).catch((err) => {
                        throw err;
                      });
                    });

                    Prospect.findOneAndDelete({
                      userID: req!.session!.userId,
                    })
                      .then((prospectList) => {
                        _removeFromAll(req!.session!.userId).catch((err) => {
                          throw err;
                        });

                        deleteProfilePicture(
                          `images/${req!.session!.userId}/profile.png`
                        ).catch((err) => {
                          throw err;
                        });

                        req!.session!.destroy((err: Error) => {
                          if (err) {
                            console.error(err);
                            return res
                              .status(500)
                              .send({ err: 'Logout failed' });
                          }
                          /* tslint:disable */
                          res.clearCookie(envConfig['SESS_NAME'] as string);
                          /* tslint:enable */
                          return res
                            .status(200)
                            .send({ msg: 'Account successfully deleted' });
                        });
                      })
                      .catch((err: Error) => {
                        throw new Error('Failed to remove prospect list');
                      });
                  } else {
                    throw new Error('FriendList not found');
                  }
                })
                .catch((err) => {
                  throw [
                    ...err,
                    new Error('Failed to remove from friendlists'),
                  ];
                });
            })
            .catch((err) => {
              throw [...err, new Error('Failed to remove all matches')];
            });
        })
        .catch((err) => {
          throw [...err, new Error('Failed to remove all chats')];
        });
    })
    .catch((errs: Error[]) => {
      console.error(errs);
      return res.status(500).send({ err: 'unable to delete account' });
    });
});

/**
 * @route POST /user/passwordReset
 * @params userID, new Password
 * @desc change users password
 * @access public
 */
userRouter.post('/passwordReset', async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.newPassword) {
    return res.status(400).send({ msg: 'Invalid input' });
  }
  try {
    await User.findOne({ 'info.email': req.body.email })
      .then(async (user) => {
        if (!user) {
          throw new Error('Failed to find user');
        }
        await argon2
          .hash(req.body.newPassword)
          .then(async (hash: string) => {
            const hashedPassword: string = hash.substring(
              hash.indexOf('p=') + 2,
              hash.length
            );
            user.info.password = hashedPassword;
            user.save();

            return res.status(200).send({ success: true });
          })
          .catch((err) => {
            throw new Error('Failed to hash new password');
          });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * @route POST /user/resetEmail
 * @params email address
 * @desc send email for password reset
 * @access public
 */
userRouter.post('/resetEmail', async (req: Request, res: Response) => {
  if (!req.body.email) {
    return res.status(400).send({ err: 'Invalid email' });
  }
  try {
    await User.findOne({ 'info.email': req.body.email }).then(async (user) => {
      if (!user) {
        throw new Error('Email is not associated with an account');
      }
      await sendResetPassword(
        user._id,
        user.info.firstName,
        user.info.lastName,
        req.body.email
      ).catch((err) => {
        throw err;
      });
      return res.status(200).send({ success: true });
    });
  } catch (err) {
    // console.log(err.message);
    return res.status(500).send({ msg: err.message });
  }
});

/**
 * @route POST /user/passwordUpdate
 * @params current password, new password
 * @desc update password
 * @access private
 */
userRouter.post(
  '/passwordUpdate',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!req.body.currentPassword || !req.body.newPassword) {
      return res.status(400).send({ err: 'Invalid input' });
    }
    try {
      await User.findById(req!.session!.userId)
        .then((user) => {
          if (!user) {
            throw new Error('Failed to find user');
          }
          const checkPassword: string =
            /* tslint:disable */
            envConfig['ARGON_HASH_METADATA']! + user.info.password;
          /* tslint:enable */
          argon2
            .verify(checkPassword, req.body.currentPassword)
            .then(async (verified) => {
              if (!verified) {
                return res.status(400).send({ err: 'Invalid Password' });
              }
              await argon2
                .hash(req.body.newPassword)
                .then(async (hash: string) => {
                  const hashedPassword: string = hash.substring(
                    hash.indexOf('p=') + 2,
                    hash.length
                  );
                  user.info.password = hashedPassword;
                  user.save();

                  return res.status(200).send({ success: true });
                })
                .catch((err) => {
                  throw new Error('Failed to hash new password');
                });
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).send({ err: 'Could not verify password' });
            });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

export default userRouter;
