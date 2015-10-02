var uniqid = require('uniqid');
var sockets = new Array();

// TODO : send photo
// TODO : receive photo

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

        // on alloue à chaque utilisateur un id
        var id = uniqid();
        console.log('+1 user');

        // on stock sa socket dans un tableau pour l'utiliser dans d'autres module
        sockets[id] = socket;

        // mise en place de l'authentification de chaque utilisateur
        socket.emit('your-id', id);

        socket.on('disconnect', function () {
            delete sockets[id];
            console.log('-1 user');
        });

    }
};