const phantom = require("phantom");

module.exports = function(url, fn) {
	this.page = null;
	this.ph = null

    return phantom.create().then(ph => {
    	this.ph = ph;
        return ph.createPage();
    }).then(page => {
        this.page = page;
        return page.open(url);
    }).then(status => {
        return this.page.property('content')
    }).then(content => {
    	return fn(this.page, this.ph);
    });
}
