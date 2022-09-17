import Mustache from 'mustache';
import path from 'path';
import fs from 'fs';
import Stats from 'fs';

const pageDirectory = 'src/templates';

fs.readdir(pageDirectory, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach((fileName) => {
        const filePath = path.join(pageDirectory, fileName);
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
    const pathInformation = path.parse(pathToTemplate);
    console.log(pathInformation);
}
