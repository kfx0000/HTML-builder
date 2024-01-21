const fs = require('fs');
const path = require('path');
const src = 'styles';
const bundle = 'bundle.css';
const bundleDir = 'project-dist';
const srcPath = path.join(__dirname, src);
const bundlePath = path.join(__dirname, bundleDir, bundle);
const streamBundle = fs.createWriteStream(bundlePath);

fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err.message); else
    files.forEach((file) => {
        if (file.isFile()) {
            const filePath = path.join(srcPath, file.name);
            if (path.extname(filePath) === '.css') {
                const streamToRead = fs.createReadStream(filePath);
                streamToRead.on('data', (data) => streamBundle.write(data));      
            }
        }
    });
});