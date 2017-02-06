const providers = require("./providers/providers");
/*
thevideo.getUrls("https://thevideo.me/embed-bmentumto7ez-850x520.html").then(url => {
    console.log(url);
});
*/

providers.parse("https://thevideo.me/embed-bmentumto7ez-850x520.html").then(url => {
    console.log(url);
});
