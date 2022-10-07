import fs from 'fs';
import { config } from '../config.js';
import siteData from '../../../data/site.json' assert {type: 'json'};

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
        
        res.render('home', {
            ...siteData,
            posts: siteData.posts.reverse(),
        });
    });
};
