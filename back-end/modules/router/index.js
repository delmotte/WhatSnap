var callback = require('../callbacks');

module.exports = function (router) {

    // general Callbacks
    router.get('/', function (req, res) {
        return res.json({ok:'laule'});
    });

    // TODO : getImg (url)
    // TODO : login (phone number, contacts) -> return all conversations
    // TODO : signin (phone number, contacts)

    router.post('/login', callback.signin);

	return router;

};