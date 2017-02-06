'use strict';

const request = require('request');
const express = require('express');
const cors = require('cors');
const app = express();
const apicache = require('apicache');
const cache = apicache.middleware;
const providers = require("./providers/providers");

// express options 

app.use(cors());

function stream(URL, headers, req, res) {
    const range = req.headers.range;
    if (range) headers['range'] = range;

    req.connection.setTimeout(3600000);
    res.setHeader('Accept-Ranges', 'bytes');
    request.get(URL, { headers }).pipe(res);
}

app.get("/", (req, res) => {
    console.log(req.headers)
    res.json({
        AUTHOR: "oussama1598",
        API_NAME: "video-downloader-parser",
        URL: "/download?url=(:video-url)",
        SUPPORTED_SITES: providers.list()
    })
})

app.get("/download", cache("1 day"), (req, res) => {
    if (!req.query.url) return res.sendStatus(404);

    providers.parse(req.query.url).then(URL => {
        res.json({
            success: true,
            streamUrl: URL ? `http://video-downloader.herokuapp.com/stream?url=${URL}` : null
        })
    }).catch(err => {
        res.json({
            success: false,
            streamUrl: null
        });
    })
})

app.get("/stream", (req, res) => {
    if (!req.query.url) return res.sendStatus(404);
    const prov = providers.find(req.query.url);
    stream(req.query.url, prov.headers, req, res);
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is up");
})
