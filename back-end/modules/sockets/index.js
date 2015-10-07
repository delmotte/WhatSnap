var sockets = new Array();
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var siofu = require("socketio-file-upload");
var database = require('../database');

var Files = {};

module.exports = {

    /**
     * Get Socket by ID
     * @param id
     */
    getSocketById: function (id) {
        for (var i in sockets) {
            if (sockets[i].id == id) {
                return sockets[i];
            }
        }
        return null;
    },

    /**
     * Socket CB
     * @param socket
     */
    socketCallback: function (socket) {

        /** login / disconnect **/
        var phone_number = '';
        var last_destination_user = '';

        socket.on('phone_number', function (phone) {
            sockets[phone] = socket;
            phone_number = phone;
        });

        socket.on('disconnect', function () {
            delete sockets[phone_number];
        });

        socket.on('user_destination', function (phone) {
            last_destination_user = phone;
            var date = new Date();
            database.request(function (db) {
                var conversations = db.collection('conversations');
                conversations.find({
                    $and: [
                        { usersId: phone_number },
                        { usersId: last_destination_user }
                    ]
                }).forEach(function (conversation) {
                    conversation.messages.forEach(function (message) {
                        if (message.sendBy == last_destination_user && message.read === false) {
                            message.read = {
                                date: date,
                                place: null
                            };
                        }
                    });
                    db.collection('conversations').save(conversation);
                }, function () {
                    var emitSocket = sockets[last_destination_user];
                    if (emitSocket) {
                        emitSocket.emit('read', {
                            phoneNumber: last_destination_user,
                            date: date,
                            place: null
                        });
                    }
                    db.close();
                });
            });
        });

        /** UPLOAD **/
        var uploader = new siofu();
        uploader.dir = "Temp/";
        uploader.listen(socket);
        uploader.on("complete", function (event) {

            var date = new Date();

            if (phone_number && last_destination_user) {
                database.request(function (db) {
                    var conversations = db.collection('conversations');
                    conversations.updateOne({
                        $and: [
                            { usersId: phone_number },
                            { usersId: last_destination_user }
                        ]
                    }, {
                        $push: {
                            messages: {
                                sendBy: phone_number,
                                image_url: event.file.pathName,
                                sendAt: date,
                                read: false
                            }
                        }
                    }).then(function () {
                        db.close();
                    });
                });
            }

            var destination_socket = sockets[last_destination_user];
            if (destination_socket) {
                destination_socket.emit('new_message', {
                    sendBy: phone_number,
                    image_url: event.file.pathName,
                    sendAt: date
                });
            }

        });



    }
};