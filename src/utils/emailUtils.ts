import * as nodemailer from 'nodemailer';
import { envConfig } from '../env/envConfig';
import * as RD from 'reallydangerous';
import Mail from 'nodemailer/lib/mailer';
import User from '../models/User';
import * as argon2 from 'argon2';

/* tslint:disable */
const TSsigner = new RD.TimestampSigner(envConfig['SIGNER_SECRET']);
const publicPath = envConfig['PUBLIC_PATH'];
/* tslint:enable */

// move AWS SES out of sandbox
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html

const verifySMTP = (transporter: Mail) => {
  return new Promise<Error | true>((resolve, reject) => {
    transporter.verify((error: Error | null, success: true) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

export const initializeSMTP = async (): Promise<Mail> => {
  return new Promise(async (resolve, reject) => {
    const transporter: Mail = nodemailer.createTransport({
      /* tslint:disable */
      host: envConfig['SMTP_HOST'],
      port: 465,
      secure: true,
      auth: {
        user: envConfig['SMTP_USER'],
        pass: envConfig['SMTP_PASS'],
        /* tslint:enable */
      },
    });

    await verifySMTP(transporter)
      .then((success) => {
        resolve(transporter);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const VerificationEmail = (
  userID: string,
  firstName: string,
  lastName: string,
  emailAddress: string,
  transporter: Mail
) => {
  const signed: string = TSsigner.sign(userID);

  const message: Mail.Options = {
    from: 'noreply@playmayte.com',
    to: `${emailAddress}`,
    subject: '[Playmayte] Verify your email address',
    /* tslint:disable */
    html: `
    <html>
    <head></head>
    <body>
      <p>
      ${firstName} ${lastName},
      <br/>
      <br/>
      Click the link to verify your email address:
      <br/>
      <br/>
      <a href="${publicPath}/verification?correlation_id=${signed}" target="_blank">${publicPath}/verification?correlation_id=${signed}</a>
      <br/>      
      <br/>
      Please do not reply to this notification, this inbox is not monitored.
      <br/>
      <br/>
      If you did not create this account click this link:
      <br/>
      <br/>
      <a href="${publicPath}/remove_email?correlation_id=${signed}" target="_blank">${publicPath}/remove_email?correlation_id=${signed}</a>
      <br/>
      <br/>
      Thanks for using the site!
      </p>
    </body>
    </html>
    `,
  };
  /* tslint:enable */

  transporter
    .sendMail(message)
    .then((success) => {
      if (success) {
        console.log('Verificiation email sent');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const sendEmailVerification = async (
  userID: string,
  firstName: string,
  lastName: string,
  email: string
) => {
  return new Promise<boolean>(async (resolve, reject) => {
    await initializeSMTP()
      .then(async (transporter) => {
        VerificationEmail(userID, firstName, lastName, email, transporter);
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const passwordResetEmail = async (
  userID: string,
  firstName: string,
  lastName: string,
  emailAddress: string,
  transporter: Mail
) => {
  return new Promise(async (resolve, reject) => {
    const signed: string = TSsigner.sign(userID);
    const tmpPass: string =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).toUpperCase().slice(2);

    const message: Mail.Options = {
      from: 'noreply@playmayte.com',
      to: `${emailAddress}`,
      subject: '[Playmayte] Reset password',
      /* tslint:disable */
      html: `
      <html>
      <head></head>
      <body>
        <p>
        ${firstName} ${lastName},
        <br/>
        <br/>
        You password has been changed to:
        <br/>
        <br/>
        ${tmpPass}
        <br/>
        <br/>
        After you log in with this password, go to settings and you can change your password.
        <br/>
        <br/>
        You can login <a href="${publicPath}/login" target="_blank">here</a>
        <br/>
        <br/>
        Please do not reply to this notification, this inbox is not monitored.
        <br/>
        <br/>
        If you did not create this account click this link to remove your email from this account:
        <br/>
        <br/>
        <a href="${publicPath}/remove_email?correlation_id=${signed}" target="_blank">${publicPath}/remove_email?correlation_id=${signed}</a>
        <br/>
        <br/>
        Thanks for using the site!
        </p>
      </body>
      </html>
      `,
      /* tslint:enable */
    };

    try {
      await User.findById(userID).then(async (user) => {
        if (!user) throw new Error('Failed to find user');
        await argon2
          .hash(tmpPass)
          .then(async (hash: string) => {
            const hashedPassword: string = hash.substring(
              hash.indexOf('p=') + 2,
              hash.length
            );
            user.info.password = hashedPassword;

            user.save();
            transporter
              .sendMail(message)
              .then((success) => {
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const sendResetPassword = (
  userID: string,
  firstName: string,
  lastName: string,
  email: string
) => {
  return new Promise(async (resolve, reject) => {
    await initializeSMTP()
      .then(async (transporter) => {
        await passwordResetEmail(
          userID,
          firstName,
          lastName,
          email,
          transporter
        )
          .then(() => {
            resolve();
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
