/**
 * Store all the user data for the app
 * @type {{init, matchConversationWithName, enterConversation, getSim, getContacts, getConversations}}
 */
var UserStore = (function () {

    var _sim = {},
        _contacts = [],
        _conversations = [],
        socket = null,
        initialized = false;

    /**
     * Init the app
     * @returns {boolean}
     */
    function init() {
        var valueToReturn = initialized;
        if (!initialized) {

            socket = io.connect('http://localhost:7070');

            // receive a new message
            socket.on('new_message', function (message) {
                console.log('new message', message);
                for (var i in _conversations) {
                    if (_conversations[i].usersId.indexOf(message.sendBy) > -1) {
                        _conversations[i].messages.push({
                            sendBy: message.sendBy,
                            image_url: message.image_url,
                            sendAt: message.sendAt
                        });
                        Dispatcher.emit('NEW_MESSAGE');
                        break;
                    }
                }
            });

            // receive that a conversation has been read by another user
            socket.on('read', function (object) {
                for (var i in _conversations) {
                    if (_conversations[i].usersId.indexOf(object.phoneNumber) > -1) {
                        for (var j in _conversations[i].messages) {
                            if (_conversations[i].messages[j].sendBy == _sim.phoneNumber) {
                                _conversations[i].messages[j].read = {
                                    date: object.date,
                                    place: object.place
                                };
                                Dispatcher.emit('READ');
                                break;
                            }
                        }
                        break;
                    }
                }
            });

            initialized = true;
            _sim = {phoneNumber: "+33678469859"};
            _contacts = [{phoneNumber:"+33786625527", name: 'Jean-Yves DELMOTTE'}];
            socket.emit('phone_number', _sim.phoneNumber);
            Dispatcher.emit('INITIALISATION_DONE');
        }
        return valueToReturn;
    }

    /**
     * find name that match the server conversations
     * @param conversations
     */
    function matchConversationWithName(conversations) {
        _conversations = conversations;
        for (var i in _conversations) {
            for (var j in _contacts) {
                if ( _conversations[i].usersId.indexOf(_contacts[j].phoneNumber) > -1) {
                    _conversations[i].name = _contacts[j].name;
                }
            }
        }
    }

    /**
     * emit to the server that we enter in a conversation and that we have read the message
     * of the conversation
     * @param conversationId
     * @returns {string}
     */
    function enterConversation(conversationId) {
        var userId = null;
        var userName = '';
        for (var i in _conversations) {
            if (_conversations[i]._id = conversationId) {
                var index = _conversations[i].usersId.indexOf(_sim.phoneNumber);
                var tab = _conversations[i].usersId.splice(index, 1);
                userId = tab[0];
                userName = _conversations[i].name;
                socket.emit('user_destination', userId);
                break;
            }
        }
        return userName;
    }

    return {
        init: init,
        matchConversationWithName: matchConversationWithName,
        enterConversation: enterConversation,
        getSim: function () {
            return _sim;
        },
        getContacts: function () {
            return _contacts;
        },
        getConversations: function () {
            return _conversations;
        }
    };

})();