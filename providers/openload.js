'use strict';

const provBase = require("./provBase");

function getUrls(url) {
    return new provBase(url, function(page, ph) {
        return page.evaluate(function() {
            return document.getElementById('streamurl').innerHTML;
        }).then(function(URL) {
            page.close();
            ph.exit();
            if (!URL) return {URL: null, stream: null};
            return {URL: `https://openload.co/stream/${URL}?mime=true`, stream: true};
        });
    })
}

module.exports = {
    getUrls,
    url: "openload.co",
    stream: true
}
