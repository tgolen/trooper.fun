import express from 'express';
import passport from 'passport';
import http from 'http';
import bodyParser from 'body-parser';
import mustacheExpress from 'mustache-express';
import path from 'path';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { fileURLToPath } from 'url';

import { auth } from './auth.js';
import log from './log.js';
import { config } from './config.js';

import logout from './routes/logout.js';
import authGoogle from './routes/authGoogle.js';
import authGoogleCallback from './routes/authGoogleCallback.js';
import root from './routes/root.js';
import savePost from './routes/savePost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.Server(app);
const fileStore = sessionFileStore(session);

// Set up a session middleware to handle user sessions.
const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  store: new fileStore({}),
  secret: 'trooper fun',
});

// Set up OAuth 2.0 authentication through the passport.js library.
auth(passport);

// Set up our logging
const logger = log(app);

// Parse application/json request data.
app.use(bodyParser.json());

// Parse application/xwww-form-urlencoded request data.
app.use(bodyParser.urlencoded({extended: true}));

// Enable user session handling.
app.use(sessionMiddleware);

// Set up passport and session handling.
app.use(passport.initialize());
app.use(passport.session());

// Register '.mst' extension with The Mustache Express
app.engine('mst', mustacheExpress(`${__dirname}/partials`, '.mst'));
app.set('view engine', 'mst');
app.set('views', `${__dirname}/views`);

app.get(`${config.appRoot}`, root);
app.post(`${config.appRoot}/savePost`, savePost)
app.get(`${config.appRoot}/logout`, logout);

// Start the OAuth login process for Google.
app.get(`${config.appRoot}/auth/google`, authGoogle(passport));

// Callback receiver for the OAuth process after log in.
app.get(`${config.appRoot}/auth/google/callback`,
    passport.authenticate('google', {
        failureRedirect: '/', 
        failureFlash: true, 
        session: true,
    }),
    authGoogleCallback(logger));

export default () => {
    // Start the server
    server.listen(config.port, () => {
        console.log(`App listening on port ${config.port}`);
        console.log(`Open application: ${config.urlApp}`);
        console.log('Press Ctrl+C to quit.');
    });
}
