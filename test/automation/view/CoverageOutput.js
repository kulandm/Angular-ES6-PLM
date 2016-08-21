/*
* this file is purely for outputing the coverage report for e2e tests
*/
'use strict';

var fs = require('fs');

describe('Output the code coverage objects', function () {
	it('should output the coverage object.', function () {
		browser.driver.executeScript('return __coverage__;').then(function (val) {
			fs.writeFileSync('coverage/e2e/coverageE2E.json', JSON.stringify(val));
		});
	});
});
