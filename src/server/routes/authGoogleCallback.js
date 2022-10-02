import {config} from '../config.js';
import fs from 'fs';

export default (logger) => {
    return (req, res) => {
        // Only allow login from one person
        if (req.user.profile.displayName.toLowerCase() !== config.allowedDisplayName.toLowerCase()) {
            res.redirect('/app');
            return;
        }

        fs.writeFile('./data/googleOauthToken', req.user.token, (err) => {
            if (err) {
                console.error(err);
            }

            // User has logged in.
            logger.info('User has logged in.');
    
            // Save the oauth token to a file
            req.session.save(() => {
                res.redirect('/app');
            });
        });
    }
}
