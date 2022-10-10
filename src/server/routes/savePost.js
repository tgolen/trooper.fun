import fs from 'fs';
import { config } from '../config.js';
import buildSite from '../buildSite.js';

export default (req, res) => {
    if (req.body.url) {
        fs.readFile(config.siteDataFilePath, 'utf8', async (err, content) => {
            const siteData = JSON.parse(content);
            const postsCopy = [].concat(siteData.posts);
            const newSiteData = {
                ...siteData,
                posts: postsCopy.map(post => {
                    if (post.url !== req.body.url) {
                        return post;
                    }
                    return {
                        ...post,
                        ...req.body,
                    };
                }),
            };
            fs.writeFileSync(config.siteDataFilePath, JSON.stringify(newSiteData, null, 4));
            buildSite();
        });
    }
    
    res.redirect('/app');
};
