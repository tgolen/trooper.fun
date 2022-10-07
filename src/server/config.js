import * as dotenv from 'dotenv';
dotenv.config();

export const config = {};

config.googleUserFilePath = './data/googleUser';

config.albumID = 'APUIgiM1r4vrWZEibDLRAAmQJtm6JCqnugkcoRjwtkx4wC7WiCME9XpdOO2u_v-M0txx_n7OblT_';

// The OAuth client ID from the Google Developers console.
config.oAuthClientID = process.env.GOOGLE_OAUTH_CLIENT_ID;

// The OAuth client secret from the Google Developers console.
config.oAuthclientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

// The callback to use for OAuth requests. This is the URL where the app is
// running. For testing and running it locally, use 127.0.0.1.
config.oAuthCallbackUrl = `${process.env.SERVER_URL_ROOT}${process.env.SERVER_APP_ROOT}/auth/google/callback`;

// The port where the app should listen for requests.
config.port = process.env.SERVER_PORT;

config.urlRoot = process.env.SERVER_URL_ROOT;

config.appRoot = process.env.SERVER_APP_ROOT;

config.urlApp = `${process.env.SERVER_URL_ROOT}${process.env.SERVER_APP_ROOT}`;

config.pathToWebRoot = process.env.PATH_TO_WEB_ROOT;

// The scopes to request. The app requires the photoslibrary.readonly and
// plus.me scopes.
config.scopes = [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'profile',
];

// The API end point to use. Do not change.
config.apiEndpoint = 'https://photoslibrary.googleapis.com';

config.allowedUserID = process.env.GOOGLE_ALLOWED_USER_ID;
