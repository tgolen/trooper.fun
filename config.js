export const config = {};

// The OAuth client ID from the Google Developers console.
config.oAuthClientID = '750032288883-347sfrobqn1tg8vmv6ij1p49i49eho4c.apps.googleusercontent.com';

// The OAuth client secret from the Google Developers console.
config.oAuthclientSecret = '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';

// The callback to use for OAuth requests. This is the URL where the app is
// running. For testing and running it locally, use 127.0.0.1.
config.oAuthCallbackUrl = 'http://localhost:8080/auth/google/callback';

// The port where the app should listen for requests.
config.port = 8080;

// The scopes to request. The app requires the photoslibrary.readonly and
// plus.me scopes.
config.scopes = [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'profile',
];

// The API end point to use. Do not change.
config.apiEndpoint = 'https://photoslibrary.googleapis.com';
