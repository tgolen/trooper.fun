import { config } from '../../../config.js';

export default (passport) => passport.authenticate('google', {
    scope: config.scopes,
    failureFlash: true,  // Display errors to the user.
    session: true,
});
