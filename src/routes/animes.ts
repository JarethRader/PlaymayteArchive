import express, { Request, Response, Router } from 'express';
const animeRouter: Router = express.Router();

import User, { IAnimes, IUserModel } from '../models/User';

import * as auth from '../middleware/auth';

import fetch from 'node-fetch';

const exportAnimes = (user: IUserModel): IAnimes => {
  const returnAnimes = {
    currentlyWatching: user.animes?.currentlyWatching,
    finishedAnimes: user.animes?.finishedAnimes,
    favoriteAnimes: user.animes?.favoriteAnimes,
    beteNoireAnimes: user.animes?.beteNoireAnimes,
    other: user.games?.other,
  };
  return returnAnimes;
};

/**
 * @route /animes
 * @desc Get  the users game preferences from their profile
 * @access private
 */
animeRouter.get('/', auth.checkSignIn, async (req: Request, res: Response) => {
  try {
    await User.findById(req!.session!.userId)
      .then((user: IUserModel | null) => {
        if (user) {
          return res.status(200).send(exportAnimes(user));
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
 * @route /animes/update
 * @desc Update the users game preferences
 * @access private
 */
animeRouter.put(
  '/update',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    try {
      await User.findById(req!.session!.userId)
        .then(async (user: IUserModel | null) => {
          if (user) {
            if (req.body.currentlyWatching)
              user.animes!.currentlyWatching = req.body.currentlyWatching;
            if (req.body.finishedAnimes)
              user.animes!.finishedAnimes = req.body.finishedAnimes;
            if (req.body.favoriteAnimes)
              user.animes!.favoriteAnimes = req.body.favoriteAnimes;
            if (req.body.beteNoireAnimes)
              user.animes!.beteNoireAnimes = req.body.beteNoireAnimes;
            if (req.body.other) user.animes!.other = req.body.other;
            await user
              .save()
              .then((updatedUser) => {
                if (updatedUser) {
                  return res.status(200).send(exportAnimes(updatedUser));
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
 * @route /animes/search
 * @desc search list of animes
 * @access public
 */
animeRouter.get('/search', async (req: Request, res: Response) => {
  try {
    await fetch(
      'https://kitsu.io/api/edge/anime?filter[text]=' + req.query.anime
    )
      .then(async (_response) => {
        if (_response.status >= 200 && _response.status < 300) {
          return _response.json();
        } else {
          throw new Error(await _response.json());
        }
      })
      .then((responseJson) => {
        const responseArray: { title: string }[] = [];
        responseJson.data.forEach((element: any) => {
          responseArray.push({ title: element.attributes.titles.en });
        });
        return res.status(200).send({ result: responseArray });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    return res.status(500).send({ err });
  }
});

export default animeRouter;
