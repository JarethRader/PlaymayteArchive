import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const socialRouter: Router = express.Router();

import User from '../models/User';
import Chat from '../models/Chat';
import {
  _removeFriend,
  _getFriendList,
  _createNewRoom,
  _unmatch,
} from '../utils/socialUtils';

import * as auth from '../middleware/auth';

/**
 * @route POST /social/user
 * @params id: id object
 * @desc get another users profile
 * @access private
 */
socialRouter.post(
  '/user',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!req.body.userID) {
      return res.status(400).send({ msg: 'No user selected' });
    }
    try {
      await User.findById(req.body.userID)
        .then((user) => {
          if (user) {
            return res.status(200).send({
              info: {
                id: user._id,
                gamerTag: user.info.gamerTag,
                gender: user.info.gender,
                preferredPronoun: user.info.preferredPronoun,
                orientation: user.info.orientation,
                firstName: user.info.firstName,
                lastName: user.info.lastName,
                dob: user.info.dob,
              },
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
 * @route GET /social/rooms
 * @desc Get all rooms of the user
 * @access private
 */
socialRouter.get(
  '/rooms',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    try {
      await _getFriendList(req!.session!.userId)
        .then((list) => {
          return res.status(200).send(list);
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
 * @route POST /social/history
 * @desc Get full chat history of the room
 * @access private
 */
socialRouter.post(
  '/history',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!req.body.roomID) {
      return res.status(400).send({ err: 'No room selected' });
    }
    try {
      await Chat.findOne({ 'room.roomID': req.body.roomID })
        .then((room) => {
          if (!room) {
            throw new Error('Room is empty');
          }
          return res.status(200).send({ history: room.history });
        })
        .catch((err) => {
          throw new Error('Could not find room');
        });
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
);

/**
 * @route DELETE /social/room
 * @desc delete chat room
 * @access private
 */
socialRouter.delete(
  '/room',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!req.body.roomID) {
      return res.status(400).send({ err: 'No room to delete' });
    }
    try {
      await Chat.findOneAndDelete({ 'room.roomID': req.body.roomID })
        .then(async (room) => {
          if (!room) {
            throw new Error('Failed to find room');
          }
          await _createNewRoom(room.room.userI._ID, room.room.userII._ID).then(
            (created) => {
              if (created) {
                return res.status(200).send({ removed: true });
              }
              throw new Error('failed to create new room');
            }
          );
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
);

/**
 * @route DELETE /social/friend
 * @desc remove friend from list
 * @access private
 */
socialRouter.delete(
  '/friend',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    if (!req.body.roomID) {
      return res.status(400).send({ err: 'No room to delete' });
    }
    if (!req.body.friendID) {
      return res.status(400).send({ err: 'No friend to remove' });
    }
    try {
      await Chat.findOneAndDelete({ 'room.roomID': req.body.roomID })
        .then(async (room) => {
          await _removeFriend(req!.session!.userId, req.body.friendID)
            .then(async () => {
              await _unmatch(req!.session!.userId, req.body.friendID)
                .then(async (unmatched) => {
                  if (unmatched) {
                    await _getFriendList(req!.session!.userId)
                      .then((list) => {
                        return res.status(200).send(list);
                      })
                      .catch((err) => {
                        throw err;
                      });
                  }
                  throw new Error('Failed to unmatch');
                })
                .catch((err) => {
                  throw err;
                });
            })
            .catch((err) => {
              throw new Error('Failed to remove match');
            });
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
);
export default socialRouter;
