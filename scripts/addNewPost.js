import fs from 'fs';
import {config} from '../src/server/config.js';

fs.readFile('./data/googleOauthToken', 'utf8', (err, token) => {
    if (err && err.message.indexOf('no such file or directory') > -1) {
        console.error(`No Google AuthToken found. You need to generate a new one from ${config.urlApp}`);
        return;
    }

    if (err) { console.error(err); return; }

    console.log(token);
});
