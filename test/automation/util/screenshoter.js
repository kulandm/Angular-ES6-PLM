/**
 * @ngdoc object
 * @name ViewTestsUtil.screenshoter
 *
 * @description This is the helper for taking screenshots.
 *
 * ##Dependencies
 *
 */
var fs = require('fs');

var Screenshoter = function () {
    this.writeSS = function (name) {
        browser.takeScreenshot().then(function (data) {
            var stream = fs.createWriteStream('./test/automation/screenshots/' + name + '.png');

            stream.write(new Buffer(data, 'base64'));
            stream.end();
        });
    };
};

module.exports = new Screenshoter();
