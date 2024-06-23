#! /usr/bin/env node

const { Command } = require('commander');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');


const program = new Command();
console.log(figlet.textSync('Dir Manager'));


program.version('1.0.0')
    .description('An exmaple of a simple CLI app for managing directories')
    .option("-l, --ls [value]", "List all files in the directory")
    .option("-m, --mkdir <value>", "Create a new directory")
    .option("-t, --touch <value>", "Create a new file")
    .parse(process.argv);

const options = program.opts();

async function listDirContents(filepath: string) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file: string) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime, } = fileDetails;
            return { fileName: file, "size(Kb)": size, created_at: birthtime }
        });
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (error) {
        console.error(error);
    }
}


function createDir(filepath: string) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
        console.log(`Directory ${filepath} created successfully`);
    }
}
function createFile(filepath: string) {
    fs.openSync(filepath, 'w');
    console.log("an empty file has been created")
}
if (options.ls) {
    // const filepath =  typeof options.ls === 'string' ? options.ls : process.cwd();
    const filepath = typeof options.ls === 'string' ? options.ls : __dirname;

    listDirContents(filepath);
}

if (options.mkdir) {
    createDir(path.resolve(__dirname, options.mkdir));
}

if (options.touch) {
    createFile(path.resolve(__dirname, options.touch));
}
if (!process.argv.slice(2).length){
    program.outputHelp();
}