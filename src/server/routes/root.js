import fs from 'fs';
import { config } from '../config.js';

export default (req, res) => {
    fs.readFile(config.googleUserFilePath, 'utf8', (err, token) => {
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
        fs.readFile(config.siteDataFilePath, 'utf8', async (err, content) => {
            const siteData = JSON.parse(content);
            const postsCopy = [].concat(siteData.posts);
            res.render('home', {
                ...siteData,
                posts: postsCopy.reverse(),
            });
        });
    });
};
