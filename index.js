'use strict';

const https = require('https');
const http = require('http');
const request = require('request');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');

function download(id, res) {
    request.post({
        url: 'https://dl4.video-download.online/vdo/download/1.mp4',
        form: { id }
    }).on('response', function(response) {
        console.log(response.statusCode) // 200
        res.writeHead(200, { 'Content-Type': 'video/mp4' });
    }).pipe(res);
}

function fetch(URL, serverRes) {
    URL = encodeURI(URL);
    https.get(`https://video-download.online/stream/go?link=${URL}&type=video&key=go712957`, function(res) {
        res.setEncoding();
        res.on('data', function(chunk) {
            if (chunk.indexOf("data:") > -1) {
                const data = chunk.trim().replace("data: ", ""),
                    id = url.parse(data, true).query.id;
                if (!id) { serverRes.writeHead(404);
                    serverRes.end(); }
                //download(id, serverRes);
                res.destroy();
            }
        });
    });
}

const app = http.createServer((req, res) => {
    const route = url.parse(req.url, true);

    if (route.pathname === "/download") {
        if (route.query.url && route.query.url !== "") {
            fetch(route.query.url, res);
        }
    } else {
        res.end(JSON.stringify({
            AUTHOR: "OussameBar",
            API_NAME: "video-downloader-parser",
            URL: "/download?url=(:video-url)",
            COMMENT: "Sorry but i had to"
        }));
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("ok");
})
