var assert = require('assert');
var callback = require('../modules/callbacks');
var database = require('../modules/database');

describe('User Callback Test', function () {

    var user = {
        phone_number: '0808080808',
        contacts: []
    };

    var user2 = {
        phone_number: '0909090909',
        contacts: [user.phone_number]
    };

    var user3 = {
        phone_number: '1010101010',
        contacts: [user.phone_number, user2.phone_number]
    };

    before(function (done) {
        database.init(function () {
           done();
        });
    });

    it('Should sign in the new user', function (done) {
        callback.signin({
            body: user
        }, {json: function (response) {
            assert.equal('success', response.status);
            assert.equal(user.phone_number, response.data.user.userId);
            assert.equal(0, response.data.conversations.length);
            done();
        }});
    });

    it ('should log in the new user', function (done) {
        callback.login({body:user}, {json: function (response) {
            assert.equal('success', response.status);
            assert.equal(0, response.data.conversations.length);
            done();
        }});
    });

    it ('should sign in the new user 2', function (done) {
        callback.signin({
            body: user2
        }, {json: function (response) {
            assert.equal('success', response.status);
            assert.equal(user2.phone_number, response.data.user.userId);
            assert.equal(1, response.data.conversations.length);
            done();
        }});
    });

    it ('should sign in the new user 3', function (done) {
        callback.signin({
            body: user3
        }, {json: function (response) {
            assert.equal('success', response.status);
            assert.equal(user3.phone_number, response.data.user.userId);
            assert.equal(2, response.data.conversations.length);
            done();
        }});
    });

    it ('should log in the new user (again)', function (done) {
        callback.login({body:user}, {json: function (response) {
            assert.equal('success', response.status);
            assert.equal(2, response.data.conversations.length);
            done();
        }});
    });

    it ('should log in the new user 2', function (done) {
        callback.login({body: user2}, {json: function (response) {
            assert.equal('success', response.status);
            assert.equal(2, response.data.conversations.length);
            done();
        }});
    });

    after(function (done) {
        database.request(function (db) {
            db.collection('users').deleteMany({
                $or: [
                    { userId: user.phone_number},
                    { userId: user2.phone_number}
                ]
            }, function (err, result) {
                if (err) throw err;
                if (result.result.n !== 2) {
                    console.log('Error deleting user', result.result.n);
                }
                db.collection('conversations').deleteMany({
                    $or: [
                        {usersId: user.phone_number},
                        {usersId: user2.phone_number}
                    ]
                }, function (err, result) {
                    if (err) throw err;
                    done();
                });
            });
        })
    });

});