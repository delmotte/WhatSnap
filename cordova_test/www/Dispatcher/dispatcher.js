var Dispatcher = (function () {
    var id = 0;
    var registeredComponents = new Array();
    return {
        register: function (event_name, component) {
            component.id = id;
            component.event_name = event_name;
            id++;
            registeredComponents.push(component);
            return component.id;
        },
        destroy: function (component) {
            for (var i in registeredComponents) {
                if (registeredComponents[i].id == component.id) {
                    registeredComponents.splice(i, 1);
                    break;
                }
            }
        },
        emit: function (eventname, data) {
            for (var i in registeredComponents) {
                if (registeredComponents[i].event_name === eventname)
                registeredComponents[i].receive(data);
            }
        }
    };
})();