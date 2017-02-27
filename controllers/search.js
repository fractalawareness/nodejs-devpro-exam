const redis = require("../controllers/redis"),
      client = redis.createClient();
      Crawler = require('./crawler');

function getAction(req, res, next) {
    const item = {
        url: req.query.url,
        level: req.query.level,
        element: req.query.element,
    };
    client.getItem(item, false).then(function(data){
        res.status(200).json({ results: data });
    }).catch(function () {
        let crawler = new Crawler(item)
        crawler.on('error', (err) => {
            next(err);
        });
        crawler.on('finished', (data) => {
            client.storeItem(item, data);
            res.status(200).json({ results: data });
        });
    });
}

function deleteAction(req, res, next) {
    const item = {
        url: req.query.url,
        level: req.query.level,
        element: req.query.element,
    };
    client.getItem(item, true)
        .then(function(data){
            res.status(200).json({ deleted: data });
        })
        .catch(function () {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
}

module.exports = {
    getAction: getAction,
    deleteAction: deleteAction
};
