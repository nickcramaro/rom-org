const fs = require('fs');
const zipLib = require('node-zip');

const pathToRoms = `D:/games/roms/Super Nintendo Entertainment System Emulator & ROMs (844 Games)-KaN1vE/ROMS (Games)/SNES`;
const pathToTest = `D:/dev/test`;
const inputPath = pathToRoms; // path to original files
const outputPath = `D:/games/roms/snes`; // final path of files
const tempPath = `./temp`; // temp working directory

init();

function init() {
    copyToTemp().then(() => {
        console.log('Copy complete');
        renameRoms().then(() => {
            console.log('Rename complete');
            zipRoms().then(() => {
                console.log('Zipping complete');
                cleanUp().then(() => console.log('Process complete'));
            });
        });
    });
}

function copyToTemp() {
    return readFilesInFolder(inputPath).then(files => {
        console.log('Copying files...');
        files.forEach(file => {
            fs.copyFileSync(inputPath + '/' + file, tempPath + '/' + file);
            console.log('Copied', file);
        });

        // resolve promise once loop is complete
        return new Promise((resolve, reject) => {
            
            resolve();
        });
    });
}

function renameRoms() {
    return readFilesInFolder(tempPath).then(files => {
        console.log('Renaming files...');
        files.forEach(file => {

            let extension = file.match(/\.zip/) || file.match(/\.smc/) || '';

            let newName = file
                .replace(/\(U\)/, '') // strip (U)
                .replace(/\[!\]/, '') // strip [!]
                .replace(extension, '') // remove extension
                .trim(); // remove whitespace

            fs.renameSync(tempPath + '/' + file, outputPath + '/' + newName + extension);
            console.log('Renamed ', newName);
        });

        // resolve promise once loop is complete
        return new Promise((resolve, reject) => {
            
            resolve();
        });
    });
}

function zipRoms() {
    return readFilesInFolder(outputPath).then(files => {

        files.forEach(file => {
            ('Zipping files...');
            if (!/.zip/.test(file)) {
                let zip = new zipLib();
                zip.file(file, fs.readFileSync(outputPath + '/' + file));
                let data = zip.generate({ base64:false, compression: 'DEFLATE' });
                fs.writeFileSync(outputPath + `/${file}.zip`, data, 'binary');
                console.log('Zipped ', file);
            }
        });

        // resolve promise once loop is complete
        return new Promise((resolve, reject) => {

            resolve();
        });
    });
}

function cleanUp() {
    return readFilesInFolder(outputPath).then(files => {
        
        files.forEach(file => {
            ('Cleaning up...');
            if (!/.zip/.test(file)) {
                fs.unlinkSync(outputPath + '/' + file);
            }
        });

        // resolve promise once loop is complete
        return new Promise((resolve, reject) => {

            resolve();
        });
    });
}

function readFilesInFolder(pathToRead) {
    return new Promise((resolve, reject) => {    
        console.log('Reading files...');
        fs.readdir(pathToRead, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        });
    });
}

