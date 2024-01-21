const fs = require('fs');
const path = require('path');
const src = 'files';
const dst = 'files-copy';
const dirSrc = path.join(__dirname, src);
const dirDst = path.join(__dirname, dst);

fs.mkdir(dirDst, { recursive: true }, () => {});
fs.readdir(dirSrc, (err, files) => {
    if (err) console.log(err.message); else
    files.forEach((file) => fs.copyFile(path.join(dirSrc, file), `${dirDst}/${file}`, () => {}));
});