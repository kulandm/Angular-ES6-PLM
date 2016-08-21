var fs = require('fs');
var logger = require('../util/Logger');

function saveScreenshot(data, filename){
	var stream = fs.createWriteStream(filename);
	stream.write(new Buffer(data, 'base64'));
	stream.end();
}

var Screenshot = {
	takeScreenshot:function(){
		browser.takeScreenshot().then(function(png){
			saveScreenshot(png, 'ss'+(new Date()).getTime()+'.png');
			logger.info('Screenshot saved.');
		},function(){
			logger.err('Screenshot failed.');
		});
	}
};

module.exports = Screenshot;