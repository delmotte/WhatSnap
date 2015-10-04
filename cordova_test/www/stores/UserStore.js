var UserStore = (function () {

    var _sim = {},
        _contacts = [],
        _conversations = [],
        initialized = false;

    function init() {
        if (!initialized) {

            // TODO : socket connection

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

    return {
        init: init,
        matchConversationWithName: matchConversationWithName,
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