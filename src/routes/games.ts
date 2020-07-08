import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const gameRouter: Router = express.Router();

import User, { IGames, IUserModel } from '../models/User';

import * as auth from '../middleware/auth';

import fetch from 'node-fetch';

const exportGames = (user: IUserModel): IGames => {
  const returnGames = {
    currentlyPlaying: user.games?.currentlyPlaying,
    favoriteGames: user.games?.favoriteGames,
    beteNoireGames: user.games?.beteNoireGames,
    other: user.games?.other,
  };
  return returnGames;
};

/**
 * @route /games
 * @desc Get  the users game preferences from their profile
 * @access private
 */
gameRouter.get('/', auth.checkSignIn, async (req: Request, res: Response) => {
  try {
    await User.findById(req!.session!.userId)
      .then((user: IUserModel | null) => {
        if (user) {
          return res.status(200).send(exportGames(user));
        }
        throw new Error('User does not exist');
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Failed to find user');
      });
  } catch (err) {
    return res.status(500).send({ err });
  }
});

/**
 * @route /games/update
 * @desc Update the users game preferences
 * @access private
 */
gameRouter.put(
  '/update',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    try {
      await User.findById(req!.session!.userId)
        .then(async (user: IUserModel | null) => {
          if (user) {
            if (req.body.currentlyPlaying)
              user.games!.currentlyPlaying = req.body.currentlyPlaying;
            if (req.body.favoriteGames)
              user.games!.favoriteGames = req.body.favoriteGames;
            if (req.body.beteNoireGames)
              user.games!.beteNoireGames = req.body.beteNoireGames;
            if (req.body.other) user.games!.other = req.body.other;
            await user
              .save()
              .then((updatedUser: IUserModel) => {
                if (updatedUser) {
                  return res.status(200).send(exportGames(updatedUser));
                } else {
                  throw new Error('Failed to save changes');
                }
              })
              .catch((err) => {
                console.error(err);
                throw new Error('Failed to save updates');
              });
          } else {
            throw new Error('User does not exist');
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
 * @route GET /games/search
 * @desc search list of games
 * @access public
 */
gameRouter.get('/search', async (req: Request, res: Response) => {
  try {
    await fetch('https://chicken-coop.fr/rest/games?title=' + req.query.game)
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((responseJson) => {
        return res.status(200).send(responseJson);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  } catch (err) {
    return res.status(500).send({ err });
  }
});

export default gameRouter;
