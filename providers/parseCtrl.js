const youtubeDl = require("youtube-dl");

module.exports = url => {
    return new Promise((resolve, reject) => {
        youtubeDl(url, ["--get-url"]).on("info", info => {
            resolve(info.url);
        }).on("error", err => {
            reject("Something went wrong! check if this site is supported");
        })
    })
}
