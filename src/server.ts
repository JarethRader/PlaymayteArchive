import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import helmet from 'helmet';

import userRouter from './routes/user';
import gameRouter from './routes/games';
import animeRouter from './routes/animes';
import socialRouter from './routes/social';
import prospectRouter from './routes/prospects';
import verificationRouter from './routes/verification';
import imagesRouter from './routes/images';

import session from 'express-session';
import * as redis from 'redis';
const RedisStore = require('connect-redis')(session);

import rateLimit from 'express-rate-limit';

// websocket util functions
import { updateChatLog, formatMessage } from './utils/chatUtils';

// initialize environment variables
import { envConfig, nodeEnv } from './env/envConfig';

// Initial app
const app: express.Application = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Define mongoose port
/* tslint:disable */
const port: number = parseInt(envConfig['PORT'], 10) || 8000;
/* tslint:enable */

// Read in Mongo URI from environment variables
/* tslint:disable */
const mongoDB: string = envConfig['MONGO_URI'];
/* tslint:enable */

// Connect to Mongo
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

// Morgan Logging
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

// Define Redis client
const RedisClient = redis.createClient(
  /* tslint:disable */
  parseInt(envConfig['REDIS_PORT'], 10),
  envConfig['REDIS_HOST'],
  {
    password: envConfig['REDIS_PASSWORD'],
  }
  /* tslint:enable */
);
RedisClient.unref();
RedisClient.on('error', (options) => {
  if (options.error && options.error.code === 'ECONNREFUSED') {
    // End reconnecting on a specific error and flush all commands with
    // a individual error
    return new Error('The server refused the connection');
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    // End reconnecting after a specific timeout and flush all commands
    // with a individual error
    return new Error('Retry time exhausted');
  }
  if (options.attempt > 10) {
    // End reconnecting with built in error
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
});

const store = new RedisStore({
  client: RedisClient,
});

const cookieConfig: any = {
  /* tslint:disable */
  maxAge: parseInt(envConfig['SESS_LIFETIME'], 10),
  sameSite: true,
  secure: envConfig['NODE_ENV'] === 'production' ? true : false,
  /* tslint:enable */
};

// Sessions
app.use(
  session({
    name: process.env.SESS_NAME as string,
    store,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    /* tslint:disable */
    secret: envConfig['SESS_SECRET'],
    /* tslint:enable */
    cookie: cookieConfig,
  })
);

/* tslint:disable */
const corsOptions = cors({
  credentials: true,
  origin: envConfig['PUBLIC_PATH'],
  maxAge: parseInt(envConfig['SESS_LIFETIME'], 10),
});

app.options(envConfig['PUBLIC_PATH'], corsOptions);
app.use(corsOptions);

cookieConfig['key'] = '_csrf';
export const csrfProtection = csrf({
  cookie: cookieConfig,
});
app.use(cookieParser(envConfig['COOKIE_SECRET']));
/* tslint:enable */
app.use(
  csrf({
    cookie: cookieConfig,
  })
);

// rate limiter
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Define Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/animes', animeRouter);
app.use('/api/v1/social', socialRouter);
app.use('/api/v1/prospects', prospectRouter);
app.use('/api/v1/verification', verificationRouter);
app.use('/api/v1/images', imagesRouter);

// Run socket when a client connects
io.on('connection', (socket: SocketIO.Socket) => {
  console.log('User connected');
  socket.on('joinRoom', ({ room }: { sender: string; room: string }) => {
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });

  socket.on(
    'chatMessage',
    async (msg: string, room: string, sender: string) => {
      await updateChatLog(room, sender, msg)
        .then((success) => {
          if (success) {
            io.emit('message', formatMessage(sender, msg));
          }
        })
        .catch((err) => {
          io.emit('messageFailed', formatMessage(sender, msg));
        });
    }
  );
});

// app.use(
//   (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     if (req.header('x-forwarded-proto') !== 'https') {
//       res.redirect(`https://${req.header('host')}${req.url}`);
//     } else {
//       next();
//     }
//   }
// );

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
