import {config} from '../config';

export default (logger) => {
    return (req, res) => {
        // Only allow login from one person
        if (req.user.profile.displayName.toLowerCase() !== config.allowedDisplayName.toLowerCase()) {
            res.redirect('/app');
            return;
        }

        // User has logged in.
        logger.info('User has logged in.');

        // Save the oauth token to a file
        req.session.save(() => {
            res.redirect('/app');
        });
    }
}
