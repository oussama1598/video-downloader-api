'use strict';

const phantom = require("phantom");
const url = require('url');
const request = require('request');
const express = require('express');
const cors = require('cors');
const rangeParser = require("range-parser");
const app = express();

// express options
app.use(cors());


// to be removed from here
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

function stream(URL, req, res) {
    const range = req.headers.range,
        headers = range ? { range } : {};

    req.connection.setTimeout(3600000);
    res.setHeader('Accept-Ranges', 'bytes');
    request.get(URL, { headers }).pipe(res);
}
//

app.get("/", (req, res) => {
    res.json({
        AUTHOR: "oussama1598",
        API_NAME: "video-downloader-parser",
        URL: "/download?url=(:video-url)"
    })
})

app.get("/download", (req, res) => {
    if (!req.query.url) return res.sendStatus(404);

    getUrl(req.query.url).then(URL => {
        if (!URL) return res.sendStatus(404);

        res.redirect(`/stream?url=${URL}`);
    }).catch(err => {
        res.sendStatus(404);
    })
})

app.get("/stream", (req, res) => {
    if (!req.query.url) return res.sendStatus(404);

    stream(req.query.url, req, res);
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is up");
})
