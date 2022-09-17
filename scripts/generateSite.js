import Mustache from 'mustache';
import path from 'path';
import fs from 'fs';
import siteData from '../data/site.json' assert {type: 'json'};

const templateDirectory = 'src/templates';
const outputDirectory = 'public';

fs.readdir(templateDirectory, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach((fileName) => {
        const filePath = path.join(templateDirectory, fileName);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error(err);
                return;
            }

            // Find all the mustache files in the template directory and output them to files
            if (stats.isFile() && fileName.indexOf('.mustache') > -1) {
                outputTemplateToFile(filePath);
            }
        });
    });
});

function outputTemplateToFile(pathToTemplate) {
    fs.readFile(pathToTemplate, 'utf8', (err, templateContents) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(templateContents)

        const parsedTemplate = Mustache.parse(templateContents);
        const outputToWrite = Mustache.render(parsedTemplate, siteData);
        const templatePathInformation = path.parse(pathToTemplate);
        const pathToOutputFile = path.join(outputDirectory, `${templatePathInformation.name}.html`);

        fs.writeFile(pathToOutputFile, outputToWrite, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}
