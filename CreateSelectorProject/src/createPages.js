import * as fs from 'node:fs';
import { fileURLToPath, URL } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'node:fs/promises';
import { class_model } from './templates/javascript_playwright.js';

export async function createPageFile(url, selectors)
{
    var pageName = new URL(url);

    var splitPath = pageName.pathname.split('/');

    var file = splitPath.pop(splitPath.length - 1);

    file = file.substring(0, file.indexOf('.'));

    var folders = splitPath.join('/');
    
    console.log(`Creating page for ${pageName}`);

    var classDeclaration = class_model;

    classDeclaration = classDeclaration.replace('{{Selectors}}', selectors);
    classDeclaration = classDeclaration.replace('{{ClassName}}', file);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    let fullPath = folders ? join(__dirname, '..', 'output', folders) : join(__dirname, '..', 'output');

    await mkdir(fullPath, {recursive:true});
    var pageFile = fs.createWriteStream(join(fullPath,`${file}.js`), {flags: 'w'});

    pageFile.write(classDeclaration);

    console.log("Creation of the page is over.");
}