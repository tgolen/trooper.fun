import fs from 'fs';

export default (req, res) => {
    fs.readFile('./data/googleOauthToken', 'utf8', (err, token) => {
        if (err && err.message.indexOf('no such file or directory') > -1) {
            // Need to login again
            res.render('login');
            return;
        }
    
        if (err) { console.error(err); return; }

        if (!req.user || !req.isAuthenticated()) {
            // Not logged in yet.
            res.render('login');
            return;
        }
        
        res.render('home', {token: 'test'});
    });
};
