import fs from 'fs';
import {config} from '../src/server/config.js';
console.log(config.googleUserFilePath);

fs.readFile(config.googleUserFilePath, 'utf8', (err, googleUser) => {
    if (err && err.message.indexOf('no such file or directory') > -1) {
        console.error(`No Google AuthToken found. You need to generate a new one from ${config.urlApp}`);
        return;
    }

    if (err) { console.error(err); return; }

    const user = JSON.parse(googleUser);
    console.log(user);
});
