import { envConfig } from '../env/envConfig';
import AWS from 'aws-sdk';

AWS.config = new AWS.Config({
  /* tslint:disable */
  accessKeyId: envConfig['S3_KEY'],
  secretAccessKey: envConfig['S3_SECRET'],
  region: envConfig['BUCKET_REGION'],
});
const Bucket = envConfig['BUCKET_NAME'];
/* tslint:enable */

const s3 = new AWS.S3();

export const uploadNewProfilePhoto = (
  Key: string,
  ContentType: string,
  File: Buffer
) => {
  return new Promise<null>((resolve, reject) => {
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket,
        Key,
        ContentType,
        Body: File,
        ACL: 'public-read',
        CacheControl: 'max-age=0',
      },
    });
    const promise = upload.promise();

    promise
      .then((data) => {
        console.log(data);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteProfilePicture = (Key: string) => {
  return new Promise<null>((resolve, reject) => {
    const params = {
      Bucket,
      Key,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
