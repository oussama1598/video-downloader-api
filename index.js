'use strict';

<<<<<<< HEAD
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
=======
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
        res.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-length': response.headers['content-length'],
            'Accept-Ranges': 'bytes'
        });
    }).pipe(res);
}

function waitForRes(id, res){
    request.get({url: `https://dl4.video-download.online/vdo/convert?id=${id}`}, function (err, response, body){
        if(body.trim().indexOf("event: finish") > -1){
            download(id, res);
        }
    })
}

function fetch(URL, serverRes) {
    URL = encodeURI(URL);
    https.get(`https://video-download.online/stream/go?link=${URL}&type=video&key=go712957`, function(res) {
        res.setEncoding();
        res.on('data', function(chunk) {
            if (chunk.indexOf("data:") > -1) {
                const data = chunk.trim().replace("data: ", ""),
                    id = url.parse(data, true).query.id;
                if (!id) {
                    serverRes.writeHead(404);
                    serverRes.end("Can't find any stream url");
                }
                waitForRes(id, serverRes);
                res.destroy();
            }
        });
        res.on("error", function (){
        	res.writeHead(404);
        	res.send("Error");
        })
    });
}

const app = http.createServer((req, res) => {
>>>>>>> 4d0031ac2e8c56e91878031f71cf693d6cd3a84a
    const route = url.parse(req.url, true);

    if (route.pathname === "/download") {
        if (route.query.url && route.query.url !== "") {
<<<<<<< HEAD
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
=======
            fetch(route.query.url, res);
>>>>>>> 4d0031ac2e8c56e91878031f71cf693d6cd3a84a
        }
    } else {
        res.end(JSON.stringify({
            AUTHOR: "OussameBar",
            API_NAME: "video-downloader-parser",
            URL: "/download?url=(:video-url)",
            COMMENT: "Sorry but i had to"
        }));
    }
<<<<<<< HEAD
}).listen(process.env.PORT || 5000, () => {
    console.log("Server is up");
=======
});

app.listen(process.env.PORT || 5000, () => {
    console.log("ok");
>>>>>>> 4d0031ac2e8c56e91878031f71cf693d6cd3a84a
})
