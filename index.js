const fs = require('fs');
const zipLib = require('node-zip');

const pathToRoms = `D:/games/roms/Super Nintendo Entertainment System Emulator & ROMs (844 Games)-KaN1vE/ROMS (Games)/SNES`;
const inputPath = pathToRoms;
const outputPath = `./output`;

init();

function init() {
    renameRoms().then(() => {
        ('Rename complete');
        zipRoms().then(() => console.log('Process complete'));
    });
}

function renameRoms() {
    return readFilesInFolder().then(files => {

        files.forEach(file => {
            console.log('Renaming files...');
            let newName = file
                .replace(/\(U\)/, '') // strip (U)
                .replace(/\[!\]/, '') // strip [!]
                .replace(/(?<=\S)(.\s?)(?=\.zip)/, ''); // strip whitespace

            // only attempt rename if change was made
            if (file !== newName) {
                fs.renameSync(inputPath + '/' + file, outputPath + '/' + newName + '.zip');
            }
        });

        // resolve promise once loop is complete
        return new Promise((resolve, reject) => {
            
            resolve();
        });
    });
}

function zipRoms() {
    return readFilesInFolder().then(files => {

        files.forEach(file => {
            ('Zipping files');
            if (!/.zip/.test(file)) {
                let zip = new zipLib();
                zip.file(file, fs.readFileSync(inputPath + '/' + file));
                let data = zip.generate({ base64:false, compression: 'DEFLATE' });
                fs.writeFileSync(outputPath + `/${file}.zip`, data, 'binary');
            }
        })

        return new Promise((resolve, reject) => {

            resolve();
        });
    })
}

function readFilesInFolder() {
    return new Promise((resolve, reject) => {    
        console.log('Reading files...');
        fs.readdir(inputPath, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        });
    })
}

