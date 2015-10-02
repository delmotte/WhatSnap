var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/whatsnap';

module.exports = {
    init: function (cb) {
        this.request(function (db) {
            db.collection('users').createIndex(
                { userId: 1 },
                { unique: true },
                function() {
                    cb();
                }
            );
        });
    },
    request: function (cb) {
        MongoClient.connect(url, function (err, db) {
            if (err) return err;
            cb(db);
        });
    }
};