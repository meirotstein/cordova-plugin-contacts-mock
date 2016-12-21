(function(window) {

    window.navigator = window.navigator || {};

    window.navigator.contacts = require('../../lib/contacts.js');
    window.navigator.contacts.OVERRIDEN_BY_CONTACTS_MOCK = true;

    window.Contact = require('../../lib/Contact.js');
    window.ContactField = require('../../lib/ContactField.js');
    window.ContactAddress = require('../../lib/ContactAddress.js');
    window.ContactError = require('../../lib/ContactError.js');
    window.ContactFieldType = require('../../lib/ContactFieldType.js');
    window.ContactFindOptions = require('../../lib/ContactFindOptions.js');
    window.ContactName = require('../../lib/ContactName.js');
    window.ContactOrganization = require('../../lib/ContactOrganization.js');


})(window);