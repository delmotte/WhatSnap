var database = require('../database');

function arr_diff(a1, a2)
{
    var a=[], diff=[];
    for(var i=0;i<a1.length;i++) a[a1[i]]=true;
    for(var i=0;i<a2.length;i++) {
        if (a[a2[i]]) delete a[a2[i]];
        else a[a2[i]] = true;
    }
    for(var k in a)diff.push(k);
    return diff;
}

module.exports = {

    /**
     * Signin a new user
     * @param req must contains body.phone_number & body.contacts
     * @param res
     * @returns {*}
     */
    signin: function (req, res) {
        if (!req.body.phone_number || !req.body.contacts) return res.json({status:'error', message:'missing param'});
        database.request(function (db) {
            var users = db.collection('users');
            var conversations = db.collection('conversations');

            // finding contacts in the application
            users.find({
                userId: {
                    $in: req.body.contacts
                }
            }).toArray(function (err, result) {
                if (err) {
                    db.close();
                    return res.json({status: 'error', message: 'internal error'});
                }

                var conversationsToAdd = result.map(function (contact) {
                    return {
                        usersId: [contact.userId, req.body.phone_number],
                        messages: []
                    };
                });

                users.insertOne({
                    userId: req.body.phone_number,
                    geolocation: []
                }, function (err) {
                    if (err) return res.json({status: 'error', message: 'internal error'});

                    if (conversationsToAdd.length > 0) {
                        conversations.insertMany(conversationsToAdd, function (err, result) {
                            db.close();
                            if (err) return res.json({status: 'error', message: 'internal error'});
                            res.json({status:'success', message: 'OK', data: {
                                user: {userId: req.body.phone_number},
                                conversations: conversationsToAdd
                            }});
                        });
                    } else {
                        db.close();
                        res.json({status:'success', message: 'OK', data: {
                            user: {userId: req.body.phone_number},
                            conversations: []
                        }});
                    }
                });
            });

        });
    },

    login: function (req, res) {
        if (!req.body.phone_number || !req.body.contacts) return res.json({status:'error', message:'missing param'});
        database.request(function (db) {
            var users = db.collection('users');
            var conversations = db.collection('conversations');

            conversations.find({
                usersId: req.body.phone_number
            }).toArray(function (err, result) {

                db.close();
                if (err) {
                    return res.json({status: 'error', message: 'internal error'});
                }

                res.json({status:'success', message: 'OK', data: {
                    user:{userId:req.body.phone_number},
                    conversations: result
                }});

            });

        });
    }
};