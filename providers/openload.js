'use strict';

const provBase = require("./provBase");

function getUrls(url) {
    return new provBase(url, function(page, ph) {
        return page.evaluate(function() {
            return document.getElementById('streamurl').innerHTML;
        }).then(function(URL) {
            page.close();
            ph.exit();
            if (!URL) return null;
            return `https://openload.co/stream/${URL}?mime=true`;
        });
    })
}

module.exports = {
    getUrls,
    url: "openload.co"
}