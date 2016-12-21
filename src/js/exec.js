var LOCAL_STORAGE_KEY = 'ionic.contacts.mock.data';

var get = function() {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || [];
};

var set = function(data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

var deepExtend = function(destination, source) {
    for (var property in source) {
        if (typeof source[property] === "object" &&
            source[property] !== null ) {
            destination[property] = destination[property] || {};
            arguments.callee(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
};

var actions = {
    save: function(successCB, failCB, args) {
        var data = get();
        var contact = args.length ? args[0] : {};
        var contactIdx = -1;
        if(contact.id) {    //update if exists
            contactIdx = data.findIndex(function(c){
                c.id === contact.id;
            });
            if(contactIdx >= 0) {
                deepExtend(contact, data[contactIdx]);
            }
        } else {    //find the closest available id
            var candidateId = 1;
            data.forEach(function(c){
                if(c.id === candidateId) {
                    ++candidateId;
                }
            });
            contact.id = candidateId;
        }
        contactIdx = contactIdx >= 0 ? contactIdx : data.length;
        data[contactIdx] = contact;
        set(data);
        successCB(contact);
    }
};

/**
 * Mocks the cordova.exec implementation
 * @param {Function} successCB
 * @param {Function} failCB
 * @param {String} service
 * @param {String} action
 * @param {Array} args
 */
var exec = function(successCB, failCB, service, action, args) {
    if(typeof actions[action] === 'function') {
        return actions[action].call(this, successCB, failCB, args)
    }
    throw new Error('Contacts Mock: ' + action + ' is not implemented!');
};

module.exports = exec;