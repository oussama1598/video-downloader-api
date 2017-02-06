'use strict';

const phantom = require("phantom");
const http = require('http');
const url = require('url');
let _ph, _page, _outObj;

function getUrl(provUrl) {
    return phantom.create().then(ph => {
        _ph = ph;
        return _ph.createPage();
    }).then(page => {
        _page = page;
        return _page.open(provUrl);
    }).then(status => {
        return _page.property('content')
    }).then(content => {
        return _page.evaluate(function() {
            return document.getElementById('streamurl').innerHTML;
        }).then(function(URL) {
            _page.close();
            _ph.exit();

            if (!URL) return null;
            return `https://openload.co/stream/${URL}?mime=true`;
        });
    });
}

http.createServer((req, res) => {
    const route = url.parse(req.url, true);

    if (route.pathname === "/download") {
        if (route.query.url && route.query.url !== "") {
            getUrl(route.query.url).then(URL => {
                if (!URL) {
                    res.writeHead(404);
                    res.end("Can't find any stream url");
                }

                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    streamUrl: URL
                }))
            }).catch(err => {
                res.writeHead(404);
                res.end("Can't find any stream url");
            })
        }
    } else {
        res.end(JSON.stringify({
            AUTHOR: "OussameBar",
            API_NAME: "video-downloader-parser",
            URL: "/download?url=(:video-url)",
            COMMENT: "Sorry but i had to"
        }));
    }
}).listen(process.env.PORT || 5000, () => {
    console.log("Server is up");
})
