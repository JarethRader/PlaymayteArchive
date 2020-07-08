import express, { Request, Response, Router } from 'express';
import * as RD from 'reallydangerous';
import { envConfig } from '../env/envConfig';
import { sendEmailVerification } from '../utils/emailUtils';

import User from '../models/User';

import * as auth from '../middleware/auth';

const verificationRouter: Router = express.Router();

/* tslint:disable */
const signer: any = new RD.TimestampSigner(envConfig['SIGNER_SECRET']);
/* tslint:enable */

/**
 * @route POST /verification/isVerified
 * @desc check if a user is verified
 * @access private
 */
verificationRouter.get(
  '/isVerified',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    try {
      await User.findById(req!.session!.userId)
        .then((user) => {
          if (!user) {
            throw new Error('Failed to find user');
          }
          const userVerified = {
            verified: user.info.verified,
          };
          return res.status(200).send(userVerified);
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

/**
 * @route GET '/verification/:correlation_id
 * @query correlation_id
 * @desc verify a users email address
 * @access public
 */
verificationRouter.get('/', async (req: Request, res: Response) => {
  const { correlation_id } = req.query;
  try {
    const unsignedUserID = signer.unsign(correlation_id, 3600, false);
    User.findById(unsignedUserID)
      .then((user) => {
        if (!user) {
          throw new Error('Failed to find user');
        }
        user!.info.verified = true;
        user.save();
        res.status(200).redirect('/account');
      })
      .catch((err) => {
        throw new Error('Failed to verify email');
      });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * @route POST /verification/sendVerify
 * @desc send verification email
 * @access private
 */
verificationRouter.post(
  '/sendVerify',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    const { id, firstName, lastName, email } = req.body;
    try {
      await sendEmailVerification(id, firstName, lastName, email)
        .then((success) => {
          return res.status(200).send({ success: true });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

export default verificationRouter;
