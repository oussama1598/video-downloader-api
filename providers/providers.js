'use strict';

const validUrl = require('valid-url');
const parseCtrl = require("./parseCtrl");
let provs;

module.exports = provs = {
    providers: [],
    add: function(arr) {
        arr.forEach(name => {
            this.providers.push(name);
        })
    },
    parse: function(url, ip) {
        if (!validUrl.isUri(url)) return Promise.reject();
        return parseCtrl(url);
    },
    list: function() {
        return this.providers.map(item => item.name);
    }
}

provs.add(["uptostream", "openload"]);
