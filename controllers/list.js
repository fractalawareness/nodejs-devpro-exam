const fs      = require('fs');
const config = require('config');
function getAction(req, res, next) {
    let readable = fs.createReadStream(config.history.filePath);
    readable.pipe(res);
}

module.exports = {
    getAction: getAction,
};
