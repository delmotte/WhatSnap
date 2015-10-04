var UserStore = (function () {

    var _sim = {},
        _contacts = [],
        _conversations = [],
        socket = null;
        initialized = false;

    function init() {
        var valueToReturn = initialized;
        if (!initialized) {

            socket = io.connect('http://localhost:7070');

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

            initialized = true;
            _sim = {phoneNumber: "+33678469859"};
            _contacts = [{phoneNumber:"+33786625527", name: 'Jean-Yves DELMOTTE'}];
            socket.emit('phone_number', _sim.phoneNumber);
            Dispatcher.emit('INITIALISATION_DONE');
        }
        return valueToReturn;
    }

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