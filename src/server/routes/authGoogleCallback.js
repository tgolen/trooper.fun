import fs from 'fs';
import {config} from '../config.js';

export default (logger) => {
    return (req, res) => {
        // Only allow login from one person
        if (req.user.profile.id !== config.allowedUserID.toLowerCase()) {
            console.log('Unauthorized user tried to log in', req.user);
            res.redirect('/app');
            return;
        }

        fs.writeFile(config.googleUserFilePath, JSON.stringify(req.user), (err) => {
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
