const fs = require('fs');
const path = require('path');

let tmpPath = '';
let includePath = '';

const fileParser = (data) => {
    let output = '';
    data.split('\r\n').forEach(line => {
        line.split(' ').forEach(word => {
            word = word.trim();
            if (word.includes('$$')) {
                const key = word.replace('$$', '').split('"')[0]
                const target = word.split('"')[1]
                if (key == 'include') {
                    const inclData = fs.readFileSync(path.join(tmpPath, target), 'utf-8');
                    output += inclData;
                }
                console.log({ word, key, target });
            } else {
                output += word + ' ';
            }
        });
    });

    return output;
}


module.exports = (opts) => {
    opts.path == undefined ? tmpPath = process.cwd() : tmpPath = opts.path;
    opts.includePath == undefined ? includePath = tmpPath : includePath = opts.includePath;

    return (req, res, next) => {
        let searchPath = req.path;
        if (searchPath.endsWith('/'))
            searchPath += 'index.html';

        const reqFile = path.join(tmpPath, searchPath);

        console.log({
            path: searchPath,
            url: req.url,
            method: req.method,
            hostname: req.hostname,
            exists: fs.existsSync(reqFile),
            reqFile,
            searchPath
        });

        if (fs.existsSync(reqFile)) {
            const data = fs.readFileSync(reqFile, 'utf-8');
            res.send(fileParser(data));
        } else {
            next();
        }
    }
};