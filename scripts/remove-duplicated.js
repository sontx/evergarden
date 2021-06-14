const fs = require("fs");
const path = require("path");

const dataDir = path.resolve("data-fixed");

const files = fs.readdirSync(dataDir);
const analyzedFiles = [];
files.forEach(file => {
    const pattern = file.substr(0, file.indexOf("-["));
    const found = analyzedFiles.find(item => item.pattern === pattern);
    if (found) {
        found.files.push(path.resolve(dataDir, file));
    } else {
        analyzedFiles.push({
            pattern,
            files: [path.resolve(dataDir, file)]
        });
    }
});

const duplicatedFiles = analyzedFiles.filter(item => item.files.length > 1);
console.log(duplicatedFiles.length)
duplicatedFiles.forEach(duplicatedFile => {
    const {pattern, files} = duplicatedFile;
    console.log(`PRUNE ${pattern}`);
    const sizes = files.map(file => {
        const stats = fs.statSync(file);
        return stats.size;
    });
    const maxSize = Math.max.apply(Math, sizes);
    const keepFileIndex = sizes.indexOf(maxSize);
    files.splice(keepFileIndex, 1);
    files.forEach(file => {
        fs.unlinkSync(file);
        console.log(`Deleted ${file}`)
    })
})