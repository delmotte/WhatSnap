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
     * Init the app just one time
     * @returns {boolean}
     */
    function init() {
        var valueToReturn = initialized;
        if (!initialized) {

            socket = io.connect('http://134.59.214.62:7070');

            // receive a new message
            socket.on('new_message', function (message) {
                for (var i in _conversations) {
                    if (_conversations[i].usersId.indexOf(message.sendBy) > -1) {
                        _conversations[i].messages.push({
                            sendBy: message.sendBy,
                            image_url: message.image_url,
                            sendAt: message.sendAt
                        });
                        Dispatcher.emit('NEW_MESSAGE', _conversations[i]);
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
            window.plugins.sim.getSimInfo(function (sim) {
                _sim = sim;
                navigator.contactsPhoneNumbers.list(function(contacts) {
                    _contacts = contacts.map(function (contact) {
                        return {
                            phoneNumber: contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].normalizedNumber : null,
                            name: contact.displayName
                        };
                    });
                    Dispatcher.emit('INITIALISATION_DONE');
                }, function() {
                    Dispatcher.emit('NO_CONTACT_LIST', {});
                });
            }, function () {
                Dispatcher.emit('NO_SIM_DETECTED', {});
            });
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
        var conversation = {};
        for (var i in _conversations) {
            if (_conversations[i]._id = conversationId) {
                var index = _conversations[i].usersId.indexOf(_sim.phoneNumber);
                var tab = _conversations[i].usersId.splice(index, 1);
                userId = tab[0];
                conversation = _conversations[i];
                socket.emit('user_destination', userId);
                break;
            }
        }
        return conversation;
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