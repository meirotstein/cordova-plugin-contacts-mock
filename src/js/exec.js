var LOCAL_STORAGE_KEY = 'cordova.contacts.mock.data';

var get = function() {
    var data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ?
        JSON.parse(data) :
        [];
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

var contains = function(source, target) {
    if(source instanceof Array) {
        return source.includes(target);
    }
    return String(source).indexOf(target) >= 0;
};

var isArray = function(object) {
    return object instanceof Array;
};

var isPlainObject = function(object) {
    return object && typeof object === 'object' && !isArray(object);
};

/**
 * normalize contact according to platform
 * I don't really know what should be the complete normalization rules - what I do know is:
 * (1) The type letter cases should be different from android to other platforms in case where
 * the type was given in uppercase (test: spec 7.4)
 * (2) empty value in array should lead to element deletion (test: contacts.spec.22)
 */
var normalize = function(contact) {
  for(prop in contact) {
      var value = contact[prop];
      if(isArray(value)) {
          contact[prop] = value.filter(function(el){
              if(el.hasOwnProperty('value') && (el.value === undefined || el.value === null || String(el.value) === "")) {
                  return false;
              }
              normalize(el);
              return true;
          });
      } else if(prop === 'type' && value) {
          if(/^[A-Z]+$/.test(value)){
              if(cordova.platformId === 'android') {
                  contact[prop] = value[0] + value.slice(1).toLowerCase();
              } else {
                  contact[prop] = value.toLowerCase();
              }
          }
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
                return c.id === contact.id;
            });
            if(contactIdx > -1) {
                deepExtend(data[contactIdx], contact);
                contact = data[contactIdx];
            } else {
                data[data.length] = contact;
            }
        } else {    //find the closest available id
            var candidateId = 1;
            data.forEach(function(c){
                if(c.id === candidateId) {
                    ++candidateId;
                }
            });
            contact.id = candidateId;
            data[data.length] = contact;
        }
        normalize(contact);
        set(data);
        successCB(contact);
    },

    remove: function (successCB, failCB, args) {
        var data = get();
        var id = args[0] || -1;

        var contactIdx = data.findIndex(function(c){
            return c.id === id;
        });

        if(contactIdx > -1) {
            data.splice(contactIdx, 1);
            set(data);
            successCB();
        } else {
            failCB(ContactError.UNKNOWN_ERROR);
        }
    },
    
    search: function (successCB, failCB, args) {
        var fields = args[0];
        var options = args[1] || {};
        var filterStr = options.filter || "";
        var found = [];

        var isInFields = (fields === "*") ? function() { return true; } : function(field) { return contains(fields, field); };

        var callback = function(c) {

            /**
             * Deep search heuristics (may be a bit different from mobile implementation):
             * -->  property is in search fields
             *      --> property value is primitive
             *          --> check if it contains the filter value
             *      --> property value is Array
             *          --> check if one of the Array objects has a value property which contains the filter value (e.g. phoneNumbers)
             *      --> property value is object
             *          --> check if one of its immediate children contains the filter value (e.g. name)
             * -->  property is not in search fields
             *      --> property value is object
             *          --> recursively search it
             *      --> return false
             *
             * @param {Contact} obj currently searched contact
             * @returns {Boolean}
             */
            function deepSearch(obj) {
                for (var prop in obj) {
                    var value = obj[prop];
                    if (isInFields(prop)) {
                        if (isArray(value)) {
                            return value.find(function (v) {
                                return contains(v.value, filterStr);
                            });
                        } else if(isPlainObject(value)) {
                            for (var _prop in value){
                                if(contains(value[_prop], filterStr)){
                                    return true;
                                }
                            }
                        } else {
                            if(contains(value, filterStr)){
                                return true;
                            }
                        }
                    } else if (isPlainObject(value)) {
                        if(deepSearch(value)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            return deepSearch(c);
        };

        var data = get();

        if(options.multiple) {
            found = data.filter(callback);
        } else {
            found = data.find(callback);
            found = found ? [found] : [];
        }

        successCB(found);
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