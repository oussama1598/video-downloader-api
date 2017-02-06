'use strict';

const provBase = require("./provBase");

function getUrls(url) {
    return new provBase(url, function(page, ph) {
        return page.evaluate(function() {
            const sources = [];
            $("source").each(function() {
                sources.push({
                    quality: $(this).attr("data-res"),
                    file: "http:" + $(this).attr("src")
                })
            });
            return sources;
        }).then(function(sources) {
            page.close();
            ph.exit();
            return sources.filter(item => item.quality == "480p")[0].file;
        });
    })
}

module.exports = {
    getUrls,
    url: "uptostream.com",
    headers: {
        Referer: "https://uptostream.com/"
    }
}
