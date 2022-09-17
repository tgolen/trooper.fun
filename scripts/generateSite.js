import Mustache from 'mustache';
import path from 'path';
import fs from 'fs';
import siteData from '../data/site.json' assert {type: 'json'};

const templateDirectory = 'src/templates';
const partialsDirectory = 'src/templates/partials';
const outputDirectory = 'public';

let partials = {};

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


const templateDirectoryFiles = fs.readdirSync(templateDirectory);
if (!templateDirectoryFiles || !templateDirectoryFiles.length) {
    console.error('could not file template files');
    process.exit(0);
}

templateDirectoryFiles.forEach((fileName) => {
    const filePath = path.join(templateDirectory, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && fileName.indexOf('.mustache') > -1) {
        outputTemplateToFile(filePath);
    }
});

function outputTemplateToFile(pathToTemplate) {
    fs.readFile(pathToTemplate, 'utf8', (err, templateContents) => {
        if (err) {
            console.error(err);
            return;
        }

        const parsedTemplate = Mustache.parse(templateContents);
        const outputToWrite = Mustache.render(templateContents, siteData, partials);
        const templatePathInformation = path.parse(pathToTemplate);
        const pathToOutputFile = path.join(outputDirectory, `${templatePathInformation.name}.html`);

        fs.writeFile(pathToOutputFile, outputToWrite, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}
