import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import * as auth from '../middleware/auth';
import { IncomingForm } from 'formidable';

import { uploadNewProfilePhoto } from '../utils/imageHandlerUtils';

const imagesRouter: Router = express.Router();

imagesRouter.post(
  '/setProfile',
  auth.checkSignIn,
  async (req: Request, res: Response) => {
    const form = new IncomingForm();
    form.parse(req, async (parseErr, fields, files) => {
      if (parseErr) throw parseErr;
      const file = files.file;

      fs.rename(file.name, 'profile.png', () => {
        fs.rename(file.path, file.path + '.png', async () => {
          const Key = `images/${fields.user}/profile.png`;
          const ContentType = 'image/png';
          const converted = fs.readFileSync(file.path + '.png');

          await uploadNewProfilePhoto(Key, ContentType, converted)
            .then(() => {
              return res.status(200).send({ success: true });
            })
            .catch((err) => {
              res.status(500).send(err);
              throw err;
            });
        });
      });
    });
  }
);

export default imagesRouter;
