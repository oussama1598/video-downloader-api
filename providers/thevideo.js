'use strict';

const provBase = require("./provBase");

function getUrls(url) {
    return new provBase(url, function(page, ph) {
        return page.evaluate(function() {
            return jwConfig_vars.playlist[0].sources;
        }).then(function(sources) {
            page.close();
            ph.exit();
            return sources.filter(item => item.label == "480p")[0].file;
        });
    })
}

module.exports = {
    getUrls,
    url: "thevideo.me"
}
