var sockets = new Array();
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var uniqid = require('uniqid');
var siofu = require("socketio-file-upload");

// TODO : send photo
// TODO : receive photo

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

        socket.on('phone_number', function (phone) {
            sockets[phone] = socket;
            phone_number = phone;
        });

        socket.on('disconnect', function () {
            delete sockets[phone_number];
        });

        /** UPLOAD **/
        var uploader = new siofu();
        uploader.dir = "Temp/";
        uploader.listen(socket);
        uploader.on("complete", function (event) {
            console.log(event.file.pathName);
            // TODO : write the new message in the database

            // TODO : send notification to connected user
        });

    }
};