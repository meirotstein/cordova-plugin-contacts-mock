[![Built with Gulp](https://raw.github.com/cyparu/artwork/master/builtwith.png)](http://gulpjs.com)
[![Build Status](https://travis-ci.org/meirotstein/cordova-plugin-contacts-mock.svg?branch=master)](https://travis-ci.org/meirotstein/cordova-plugin-contacts-mock)
[![npm version](https://badge.fury.io/js/cordova-plugin-contacts-mock.svg)](https://badge.fury.io/js/cordova-plugin-contacts-mock)

# cordova-plugin-contacts-mock

When developing a cordova based application - such as [ionic](https://ionicframework.com/) - the major development is mostly done in a local browser-based environment such as [ionic serve](https://ionicframework.com/docs/v2/cli/serve/).

It is very fast and comfortable developent environment on the one hand, however it is lack with some native services on the other - this makes the development quite harder.

This library is a mock for the apache cordova contacts [plugin](https://github.com/apache/cordova-plugin-contacts), if offers a similar api and usage as the native plugin, however the contacts data is read and stored in the browser's local storage instead.

By using this library you can write your code and test it with any kind of contacts data you like, and at the end just to verify that it works on the device as expected.

### Installation
```bash
npm install cordova-plugin-contacts-mock --save-dev
```

### Setup

Add the /build/contacts-mock.js script into you app index.html

```html
<script src="path-to-cordova-contacts-plugin-mock/build/contacts-mock.js"></script>
```

As you dont want this script to run on the device itself it is recommended to create a different index.html files for local dev and productive use

### Usage

Usage is the same as described in the [cordova documentation](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-contacts/#navigatorcontacts) and in [$cordovaContacts](http://ngcordova.com/docs/plugins/contacts/)

### Contacts Data
cordova-plugin-contacts-mock is using the browser local storage to read and save the contacts data - the data is saved under the cordova.contacts.mock.data key on the follwing [Contact](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-contacts/#contact) structure:
```javascript
[{
    "id": "123",
    "rawId": "123",
    "displayName": "",
    "name": {
      "givenName": "",
      "formatted": ""
    },
    "nickname": null,
    "phoneNumbers": [
      {
        "id": "1711",
        "pref": false,
        "value": "972+54+7777777",
        "type": "mobile"
      }
    ],
    "emails": [],
    "addresses": [],
    "ims": [],
    "organizations": null,
    "birthday": null,
    "note": "",
    "photos": null,
    "categories": null,
    "urls": null
  }]
```
You can use the browser dev tools to edit it youself or simply [create and save](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-contacts/#save-example) it by code.

### Notes

(1) Contacts **must** be saved in array structure

(2) It was tested on chrome only.. 
