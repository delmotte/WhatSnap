var callback = require('../callbacks');
var fs = require('fs');

module.exports = function (router) {

    router.get('/file/:url', function (req, res) {
        try {
            var img = fs.readFileSync('./Temp/' + req.params.url);
            res.writeHead(200);
            res.end(img, 'binary');
        } catch (err) {
            res.sendStatus(404);
        }

    });

    router.post('/signin', callback.signin);
    router.post('/login', callback.login);

	return router;

};