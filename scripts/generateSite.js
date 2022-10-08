import Mustache from 'mustache';
import path from 'path';
import fs from 'fs';
import siteData from '../data/site.json' assert {type: 'json'};
import { config } from '../src/server/config.js';

const partialsDirectory = 'src/site/partials';
const partials = {};

const partialsDirectoryFiles = fs.readdirSync(partialsDirectory);
if (!partialsDirectoryFiles || !partialsDirectoryFiles.length) {
    console.error('could not file partials files');
    process.exit(0);
}

// Find all the mustache partials in the partils directory and add them to the partials
// object which eventually is passed to Mustache.render()
partialsDirectoryFiles.forEach((fileName) => {
    const filePath = path.join(partialsDirectory, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && fileName.indexOf('.mst') > -1) {
        const partialPathInformation = path.parse(filePath);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        partials[partialPathInformation.name] = fileContents;
    }
});

siteData.posts.reverse();

const nextPost = siteData.posts.length < 2
? null
: siteData.posts[1];
outputTemplateToFile('src/site/views/post.mst', `${config.pathToWebRoot}/index.html`, {
    ...siteData,
    posts: siteData.posts.slice(0, 10),
    post: siteData.posts.length ? siteData.posts[0] : null,
    nextPost,
});

// Loop through each post to set it's tags
siteData.posts.map((post) => {
    post.tagObjects = post.tags 
        ? post.tags.split(',').map(tag => {
            const cleanTag = tag.replace(/\s/, '').toLowerCase();
            return {
                tagName: cleanTag,
                tagUrl: `tag-${cleanTag}.html`
            };
        })
        : [];
    return post;
});
const tagsAndPosts = {};
siteData.posts.forEach(post => {
    post.tagObjects.forEach(tagObject => {
        if (!tagsAndPosts[tagObject.tagName]) tagsAndPosts[tagObject.tagName] = [];
        tagsAndPosts[tagObject.tagName].push(post);
    });
});

let i = 0;
siteData.posts.forEach((post) => {
    const prevPost = i === 0
        ? null
        : siteData.posts[i - 1];
    const nextPost = i === siteData.posts.length
        ? null
        : siteData.posts[i + 1];
    outputTemplateToFile('src/site/views/post.mst', `${config.pathToWebRoot}/${post.url}`, {
        ...siteData,
        title: `${siteData.title} = ${post.title}`,
        post,
        prevPost,
        nextPost,
        posts: siteData.posts.slice(0, 10),
    });
    i++;
});
console.log(tagsAndPosts);

// Create a landing page for each tag
for (let cleanTag in tagsAndPosts) {
    outputTemplateToFile('src/site/views/post.mst', `${config.pathToWebRoot}/tag-${cleanTag}.html`, {
        title: `Trooper.fun Photo Blog - ${cleanTag}`,
        heading: `Tag - ${cleanTag}`,
        posts: tagsAndPosts[cleanTag],
        post: tagsAndPosts[cleanTag][0],
    });
}

function outputTemplateToFile(pathToTemplate, outputFilePath, data) {
    fs.readFile(pathToTemplate, 'utf8', (err, templateContents) => {
        if (err) {
            console.error(err);
            return;
        }

        const outputToWrite = Mustache.render(templateContents, data, partials);
        fs.writeFile(outputFilePath, outputToWrite, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}
