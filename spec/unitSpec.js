//Mock local storage
if (!global.localStorage) {
    global.localStorage = (function() {

        var mockData = "";

        return {
            getItem: function() {
                return mockData;
            },
            setItem: function(key, value) {
                mockData = value;
            }
        }
    })();
}

//Mock window and cordova objects
if (!global.window) {
    global.window = {};
}

if (!global.cordova) {
    global.cordova = {
        platformId: 'android'
    };
}

require('../build/contacts-mock');

//copy mocked window props to global so it will mimic browser behaviour
for(prop in global.window) {
    global[prop] = global.window[prop];
}

//require and execute original cordova-plugin-contacts tests
var cordovaPluginTests = require('../node_modules/cordova-plugin-contacts/tests/tests.js');

describe("Hello World Server", function() {
    cordovaPluginTests.defineAutoTests();
});