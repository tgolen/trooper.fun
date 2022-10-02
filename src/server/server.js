import express from 'express';
import passport from 'passport';
import http from 'http';
import bodyParser from 'body-parser';
import mustacheExpress from 'mustache-express';

import { auth } from './auth';
import { logger } from './logger';

const app = express();
const server = http.Server(app);

// Set up OAuth 2.0 authentication through the passport.js library.
auth(passport);

// Set up our logging
logger(app);

// Parse application/json request data.
app.use(bodyParser.json());

// Parse application/xwww-form-urlencoded request data.
app.use(bodyParser.urlencoded({extended: true}));

// Set up passport and session handling.
app.use(passport.initialize());

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// GET request to the root.
// Display the login screen if the user is not logged in yet, otherwise the
// photo frame.
app.get('/', (req, res) => {
  if (!req.user || !req.isAuthenticated()) {
    // Not logged in yet.
    res.render('pages/login');
  } else {
    res.render('pages/frame');
  }
});

// Star the OAuth login process for Google.
app.get('/auth/google', passport.authenticate('google', {
  scope: config.scopes,
  failureFlash: true,  // Display errors to the user.
}));

// Callback receiver for the OAuth process after log in.
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/', failureFlash: true, session: true}),
    (req, res) => {
        // User has logged in.
        logger.info('User has logged in.');
        res.redirect('/');
});

export default () => {
    // Start the server
    server.listen(config.port, () => {
        console.log(`App listening on port ${config.port}`);
        console.log('Press Ctrl+C to quit.');
    });
}
