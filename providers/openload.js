'use strict';

const provBase = require("./provBase");
const urlParser = require("url");

function buildIp(ip) {
    let str = "";
    ip = ip.split(".");
    ip[2] = ip[3] = 0;

    for (let num in ip) {
        num = parseInt(num);
        const dot = num !== ip.length - 1 ? "." : "";
        str += `${ip[num]}${dot}`;
    }
    return str;
}

function replaceIp(ip, url) {
    var str2 = urlParser.parse(url).pathname.split("~")[2];
    return url.replace(str2, ip);
}


function getUrls(url, ip) {
    return new provBase(url, function(page, ph) {
        return page.evaluate(function() {
            return document.getElementById('streamurl').innerHTML;
        }).then(function(URL) {
            page.close();
            ph.exit();
            if (!URL) return null;
            return { url: `https://openload.co/stream/${replaceIp(buildIp(ip), URL)}?mime=true` };
        });
    })
}

module.exports = {
    getUrls,
    url: "openload.co",
    headers: {}
}
