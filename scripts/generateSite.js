import Mustache from 'mustache';
import path from 'path';
import fs from 'fs';
import siteData from '../data/site.json' assert {type: 'json'};

const partialsDirectory = 'src/templates/partials';
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

    if (stats.isFile() && fileName.indexOf('.mustache') > -1) {
        const partialPathInformation = path.parse(filePath);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        partials[partialPathInformation.name] = fileContents;
    }
});

outputTemplateToFile('src/templates/index.mustache', 'public/index.html', siteData);

siteData.posts.reverse().forEach((post) => {
    outputTemplateToFile('src/templates/post.mustache', `public/${post.url}`, {
        ...siteData,
        title: `${siteData.title} = ${post.title}`,
        post: post
    });
});

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
