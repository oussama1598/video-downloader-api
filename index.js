'use strict';

const request = require('request');
const cors = require('cors');
const express = require('express');
const app = express();
const providers = require('./providers/providers');

// enable the api to be used for evryone (enabling cors)
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        AUTHOR: "oussama1598",
        API_NAME: "video-downloader-parser",
        URL: "/download?url=(:video-url)",
        SUPPORTED_SITES: providers.list()
    })
})

app.get("/download", (req, res) => {
    if (!req.query.url) return res.sendStatus(404);
    providers.parse(req.query.url).then(URL => {
        res.json({
            success: true,
            streamUrl: URL
        })
    }).catch(err => {
        res.json({
            success: false,
            error: err,
            streamUrl: null
        });
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is up");
})
