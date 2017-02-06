'use strict';

const urlParser = require("url");
let porvs;

module.exports = provs = {
    providers: [],
    add: function(arr) {
        arr.forEach(item => {
            this.providers.push({
                name: item,
                require: require(`./${item}`)
            });
        })
    },
    get: function(name) {
        const prov = this.providers.filter(item => item.name === name);
        return prov[0].require || null;
    },
    parse: function(url) {
        const parsedUrl = urlParser.parse(url),
            prov = this.providers.filter(prov => prov.require.url === parsedUrl.host.replace("www.", ""));

        if (prov[0]) return prov[0].require.getUrls(url);

        return Promise.reject();
    },
    list: function() {
        return this.providers.map(item => item.name);
    }
}

provs.add(["thevideo", "openload"]);
