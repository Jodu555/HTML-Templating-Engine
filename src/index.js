const fs = require('fs');
const path = require('path');

const fileParser = (data) => {
    data.split('\r\n').forEach(line => {
        line.split(' ').forEach(word => {
            word = word.trim();
            if (word.includes('$$')) {
                const key = word.replace('$$', '').split('"')[0]
                const target = word.split('"')[1]
                if (key == 'include') {
                    console.log('Try to include' + target);
                }
                console.log({ word, key, target });

            }
        });
    });

    return data;
}


module.exports = (opts) => {
    const tmpPath = opts.path;
    return (req, res, next) => {
        let searchPath = req.path;
        if (searchPath.endsWith('/'))
            searchPath += 'index.html'

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