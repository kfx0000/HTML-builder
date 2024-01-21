const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const srcAssetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
const compDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const indexPath = path.join(distDir, 'index.html');
const stylePath = path.join(distDir, 'style.css');

function copyDir(src, dst) {
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err.message); else
        files.forEach((file) => {
            const filePath = path.join(src, file.name);
            if (file.isDirectory()) {
                fs.mkdir(path.join(dst, file.name), { recursive: true }, () => {});
                copyDir(filePath, path.join(dst, file.name));
            } else {
                fs.copyFile(filePath, path.join(dst, file.name), () => {});
            }
        });
    });
}

fs.mkdir(distDir, { recursive: true }, () => {});
fs.mkdir(distAssetsDir, { recursive: true }, () => {});
copyDir(srcAssetsDir, distAssetsDir);

const streamTemplate = fs.createReadStream(templatePath, 'utf-8');
streamTemplate.on('data', (data) => {
    let dataTemplate = data.toString();
    fs.readdir(compDir, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err.message); else
        files.forEach((file) => {
            if (file.isFile()) {
                const filePath = path.join(compDir, file.name);
                if (path.extname(filePath) === '.html') {
                    const templateName = `{{${file.name.replace(path.extname(filePath), '')}}}`;
                    const compReadStream = fs.createReadStream(filePath, 'utf-8');
                    compReadStream.on('data', (chunk) => {
                        dataTemplate = dataTemplate.replaceAll(templateName, chunk);
                        fs.writeFile(indexPath, dataTemplate, () => {});
                    });
                }
            }
        });
    });
});

const streamStyle = fs.createWriteStream(stylePath);
fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err.message); else
    files.forEach((file) => {
        if (file.isFile()) {
            const filePath = path.join(stylesDir, file.name);
            if (path.extname(filePath) === '.css') {
                const streamToRead = fs.createReadStream(filePath);
                streamToRead.on('data', (data) => streamStyle.write(data));
            }
        }
    });
});