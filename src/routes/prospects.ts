import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Prospect, { IProspectModel } from '../models/Prospect';

import { _checkMatch, _createNewChat, _unmatch } from '../utils/socialUtils';

import * as auth from '../middleware/auth';
import { _addNew, _setDecidedTrue } from '../utils/prospectUtils';

const prospectRouter: Router = express.Router();

/**
 * @route GET '/prospects/
 * @desc get prospect list for a given user
 * @access private
 */
prospectRouter.get(
  '/',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    Prospect.findOne({ userID: req!.session!.userId })
      .then((prospectList: IProspectModel | null) => {
        const unmatchedProspect = prospectList?.prospects.filter(
          (prospect) => prospect.decided !== true
        );
        return res.status(200).send({
          prospects: unmatchedProspect,
        });
      })
      .catch((err: Error) => {
        return res.status(500).send({ err });
      });
  }
);

/**
 * @route POST /prospects/match
 * @desc match users and create a chatroom
 * @access private
 */
prospectRouter.post(
  '/match',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!req.body.matchWith) {
      return res.status(400).send({ err: 'No user to match with' });
    } else {
      try {
        await _createNewChat(req!.session!.userId, req.body.matchWith).then(
          async (success) => {
            if (success) {
              await _setDecidedTrue(req!.session!.userId, req.body.matchWith)
                /* tslint:disable */
                .then((success) => {
                  /* tslint:enable */
                  if (success) {
                    return res.status(200).send({ matched: true });
                  }
                })
                .catch((err) => {
                  throw err;
                });
            }
            throw new Error('Failed to match users');
          }
        );
      } catch (err) {
        return res.status(500).send({ err });
      }
    }
  }
);

/**
 * @route POST /prospects/pass
 * @desc pass on matching with a user
 * @access private
 */
prospectRouter.post(
  '/pass',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!req.body.unmatchWith) {
      return res.status(400).send({ msg: 'No user selected' });
    }
    try {
      await _unmatch(req!.session!.userId, req.body.unmatchWith)
        .then(async (unmatched) => {
          await _setDecidedTrue(req!.session!.userId, req.body.unmatchWith)
            .then((decidedTrue) => {
              if (decidedTrue) {
                return res.status(200).send({ unmatched: true });
              }
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
);

/**
 * @route POST /prospects/addNew
 * @desc add a new user to everyones list and add everyone to new users list
 * @access private
 */
prospectRouter.post(
  '/addNew',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    try {
      await _addNew(req!.session!.userId)
        .then((success) => {
          return res.status(200).send({ added: true });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
);

export default prospectRouter;
