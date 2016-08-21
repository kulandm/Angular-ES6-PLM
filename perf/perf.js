var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var util = require('util');

var previousFilesObj = {};

var currentBuild = parseInt(process.env.BUILD_NUMBER);
//currentBuild = 1652; // TEMPORARY
var fileList = [];

//console.log(currentBuild)

//process.exit(1);

for (var i = -1; i > -5; i--) {
	fileList.push('../../' + (currentBuild + i) + '/artifact/reports/viewReport.xml');
}

var async = require('async');
function loadPreviousXmlFiles() {
	async.eachSeries(fileList,	function (filename, callback) {
		fs.readFile(filename, 'utf8', function (error, content) {
			console.log('File reading for ' + filename + ' error: ' + error);
			if (!error) {
				parser.parseString(content, (error, result) => {
					console.log('Parsing of ' + filename + 'went wrong. Error: ' + error);
					if (!error) {
						previousFilesObj[filename.substring(filename.indexOf('/') + 1, filename.lastIndexOf('/'))] = result;
					}
				});
				
			}

			// Calling callback makes it go to the next item
			callback(error);
		});
	}, function (error) { // Final callback after each item has been iterated over
		console.log('----------------');
		console.log('final obj', previousFilesObj);
	});
}
loadPreviousXmlFiles();

fs.readFile('./reports/viewReport.xml', 'utf8', (err,data) => {
	parser.parseString(data, (err, result) => {
		
		// console.log(util.inspect(result, false, null));
		// console.log('Done');
		// http://plm360jenkins.ecs.ads.autodesk.com:9090/view/09-NextPLM/view/Habanero%20(ci%20branch)/job/nextplm-rc-viewtests/ws/reports/
		// http://plm360jenkins.ecs.ads.autodesk.com:9090/view/09-NextPLM/view/Habanero%20(ci%20branch)/job/nextplm-rc-viewtests/1650/artifact/reports/
		
		var htmlSuiteBody = '<table cellspacing="2" cellpadding="2" border="1">';
		var htmlSuiteFooter = '</table>';
		
		for (var testsuite in result.testsuites) {
			if (testsuite === 'testsuite') {
				for (var singleTestsuite in result.testsuites[testsuite]) {
					testSuiteName = result.testsuites[testsuite][singleTestsuite].$.name;
					testSuiteTestQuantity = parseInt(result.testsuites[testsuite][singleTestsuite].$.tests);
					testSuiteFailures = parseInt(result.testsuites[testsuite][singleTestsuite].$.failures);
					testSuiteSkipped = parseInt(result.testsuites[testsuite][singleTestsuite].$.skipped);
					testSuiteTimestamp = result.testsuites[testsuite][singleTestsuite].$.timestamp;
					testSuiteTime = parseFloat(result.testsuites[testsuite][singleTestsuite].$.time);
					
					var testSuiteHeader = `<tr>
						<th></th>
						<th><span class='testsuite-name'>${testSuiteName}</span></th>
					</tr>`;
					var testSuiteRowInfo = `<tr>
						<td class="label">Passed:</td>
						<td>${testSuiteTestQuantity}</td>
					</tr>`;
					
					var testSuiteRowTime;
					if (testSuiteFailures > 0) {
						testSuiteRowTime = `<tr>
							<td class="label">Time:</td>
							<td>${testSuiteFailures} failure(s)</td>
						</tr>`;
					} else {
						testSuiteRowTime = `<tr>
							<td class="label">Time:</td>
							<td>${testSuiteTime}s</td>
						</tr>`;
					}							
					
					var testSuiteRowSkipped = `<tr>
						<td class="label">Skipped:</td>
						<td>${testSuiteSkipped}</td>
					</tr>`;
				
					htmlSuiteBody += testSuiteHeader + testSuiteRowInfo + testSuiteRowTime + testSuiteRowSkipped;
				}
			}
		}
		
		htmlSuiteBody += htmlSuiteFooter; 
		
		// To be further customized
		var baseHTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>View Tests Report (UI)</title><link rel="stylesheet" href="css/styles.css?v=1.0"></head><body>${htmlSuiteBody}</body></html>`;
		fs.writeFile('./reports/viewReport.html', baseHTML, (err) => {
			if (err) {
				return console.log('Error saving report:', err);
			}
			console.log('Report saved successfully.');
		}); 
		
	});
});