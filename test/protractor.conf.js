var http = require('http');
exports.config = {
	// ----- How to setup Selenium -----
	//
	// There are three ways to specify how to use Selenium. Specify one of the
	// following:
	//
	// 1. seleniumServerJar - to start Selenium Standalone locally.
	// 2. seleniumAddress - to connect to a Selenium server which is already
	//    running.
	// 3. sauceUser/sauceKey - to use remote Selenium servers via SauceLabs.
	//
	// If the chromeOnly option is specified, no Selenium server will be started,
	// and chromeDriver will be used directly (from the location specified in
	// chromeDriver)

	// The location of the selenium standalone server .jar file, relative
	// to the location of this config. If no other method of starting selenium
	// is found, this will default to
	// node_modules/protractor/selenium/selenium-server...
	seleniumServerJar: null,

	// The port to start the selenium server on, or null if the server should
	// find its own unused port.
	seleniumPort: null,

	// Chromedriver location is used to help the selenium standalone server
	// find chromedriver. This will be passed to the selenium jar as
	// the system property webdriver.chrome.driver. If null, selenium will
	// attempt to find chromedriver using PATH.
	// chromeDriver: '../node_modules/protractor/selenium/chromedriver',

	// If true, only chromedriver will be started, not a standalone selenium.
	// Tests for browsers other than chrome will not run.
	chromeOnly: false,

	// Additional command line options to pass to selenium. For example,
	// if you need to change the browser timeout, use
	// seleniumArgs: ['-browserTimeout=60'],
	// seleniumArgs: [],

	// If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
	// The tests will be run remotely using SauceLabs.
	// sauceUser: null,
	// sauceKey: null,

	// The address of a running selenium server. If specified, Protractor will
	// connect to an already running instance of selenium. This usually looks like
	// seleniumAddress: 'http://localhost:4444/wd/hub',
	seleniumAddress: null,

	// The timeout for each script run on the browser. This should be longer
	// than the maximum time your application needs to stabilize between tasks.
	allScriptsTimeout: 90000,

	// ----- What tests to run -----
	//
	// Suites that can be run using the `--suite=<name1>[,<name2>,...]` argument.
	// Not specifying the `--suite` argument will run all the suites.
	suites: {
		view: ['./automation/view/*Spec.js', './automation/view/AttachmentsSpecLoader.js'],
		high: [
			'./automation/e2e/high/WipAttachmentTabSpec.js',
			'./automation/e2e/high/AffectedItemsSpec.js',
			'./automation/e2e/high/FilteredPicklistFieldsSpec.js',
			'./automation/e2e/high/ReleaseItemPinningPolicyWorkflowSpec.js'
		],
		highStable: [
			'./automation/e2e/high/AddAffectedItemsSpec.js',
			'./automation/e2e/high/AddRelatedBomSpec.js',
			'./automation/e2e/high/AttachmentTabSpec.js',
			'./automation/e2e/high/BulkEditAndReleaseItemsSpec.js',
			'./automation/e2e/high/ChangeManagementSpec.js',
			'./automation/e2e/high/EditAffectedItemsSpec.js',
			'./automation/e2e/high/SaveActionEtagVaildationSpec.js',
			'./automation/e2e/high/WorkspaceAdminTabNamesSpec.js'
		],
		medium: './automation/e2e/medium/*Spec.js',
		low: './automation/e2e/low/*Spec.js',
		smoke: './automation/e2e/high/ChangeManagementSpec.js',
		perf: './automation/perf/*Spec.js'
	},

	// Patterns to exclude.
	exclude: [
		'./automation/view/ViewAttachmentsViewSpec.js',
		'./automation/view/ViewWipAttachmentsViewSpec.js',
		'./automation/view/ViewWipAttachmentsEditSpec.js'
	],

	// Alternatively, suites may be used. When run without a commad line parameter,
	// all suites will run. If run with --suite=smoke, only the patterns matched
	// by that suite will run.
	// suites: {
	//  smoke: 'spec/smoketests/*.js',
	//  full: 'spec/*.js'
	// },

	// ----- Capabilities to be passed to the webdriver instance ----
	//
	// For a full list of available capabilities, see
	// https://code.google.com/p/selenium/wiki/DesiredCapabilities
	// and
	// https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
	capabilities: {
		browserName: 'chrome',
		platform: 'ANY'
	},

	// If you would like to run more than one instance of webdriver on the same
	// tests, use multiCapabilities, which takes an array of capabilities.
	// If this is specified, capabilities will be ignored.
	//  multiCapabilities: [
	//  {
	//  'browserName': 'chrome'
	// }, {
	//  'browserName': 'firefox'
	// }, {
	//  'browserName': 'phantomjs',
	//      'phantomjs.binary.path': 'node_modules/.bin/phantomjs'
	// }],

	// ----- More information for your tests ----
	//
	// A base URL for your application under test. Calls to protractor.get()
	// with relative paths will be prepended with this.
	// baseUrl: 'http://tabasco.ads.autodesk.com/?customer=SELENIUM_HIG',

	// Selector for the element housing the angular app - this defaults to
	// body, but is necessary if ng-app is on a descendant of <body>
	// rootElement: 'body',

	// A callback function called once protractor is ready and available, and
	// before the specs are executed
	// You can specify a file containing code to run by setting onPrepare to
	// the filename string.
	onPrepare: function () {
		// At this point, global 'protractor' object will be set up, and jasmine
		// will be available. For example, you can add a Jasmine reporter with:
		// jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
		//     'outputdir/', true, true));
		var fs = require('fs');
		browser.driver.manage().window().setSize(1280, 1024);

		var chai = require('chai');
		var chaiAsPromised = require('chai-as-promised');
		chai.use(chaiAsPromised);

		global.expect = chai.expect;
		var files = fs.readdirSync('./test/automation/view/');
		global.totalTests = files.length;
		global.loggedInUser = null;

		/**
		* Function to add a global protractor locator to match element names with regex
		* Example usage:
		* element(by.namePattern('input[type="text"]', 'urn:adsk.plm:tenant.workspace.view.field:.*SERIAL_NUMBER$')).sendKeys("123");
		**/
		By.addLocator("namePattern", function fieldIdInUrnHandler(elementSelector, regexExpression, parentElement, rootSelector){
			'use strict';

			let domScope = parentElement || document;
			let selectedElements = domScope.querySelectorAll(elementSelector);
			let matches = Array.prototype.filter.call(selectedElements, function(elem) {
				let nameAttr = elem.getAttribute('name');
				if(!nameAttr) return false;
				if(regexExpression === null || regexExpression === '') return true; //return all as match
				let regex = new RegExp(regexExpression);
				return regex.test(nameAttr);
			});
			return matches;
		});


		/**
		 * Function to disable angular animation during unit tests.
		 * Components such as $mdToast or $mdDialog may cause some
		 * race conditions during unit tests.
		 */
		var disableNgAnimate = function () {
			angular.module('disableNgAnimate', []).run(['$animate', function ($animate) {
				$animate.enabled(false);
			}]);
		};

		browser.addMockModule('disableNgAnimate', disableNgAnimate);

		var pristineFirst = function () {
			browser.driver.get(browser.params.plmBaseUrl + '/authentication/backOfficeLoginPage.bo');
			browser.driver.findElement(by.name('j_username')).sendKeys('admin');
			browser.driver.findElement(by.name('j_password')).sendKeys('admin');
			browser.driver.findElement(by.name('submit')).click();

			browser.driver.wait(function () {
				return browser.driver.getCurrentUrl().then(function (url) {
					return /backOffice.bo/.test(url);
				});
			}, 10000);

			return browser.driver.get(browser.params.plmBaseUrl + '/conn/resetToPristine.bo?customerName=' + browser.params.tenant);
		};

		// TODO: Insert better name for this
		var login = function () {
			var deferred = protractor.promise.defer();

			var auth = require('./automation/util/Auth');
			var helper = require('./automation/util/Helper');

			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					helper.isFeatureEnabled('wip.attachment').then(function (isFeatureEnabled) {
						global.isWipEnabled = isFeatureEnabled;
						deferred.fulfill();
					});
				});
			});

			return deferred.promise;
		};

		if (browser.params.pristineFirst && (browser.params.pristineFirst === 'true' || browser.params.pristineFirst === true)) {
			return pristineFirst().then(function () {
				return login();
			});
		} else {
			return login();
		}
	},

	// The params object will be passed directly to the protractor instance,
	// and can be accessed from your test. It is an arbitrary object and can
	// contain anything you may need in your test.
	// This can be changed via the command line as:
	//   --params.login.user 'Joe'
	// params: {
	//  login: {
	//    user: 'Jane',
	//    password: '1234'
	//  }
	// },

	params: {
		acceptedAgreement: false
	},

	// ----- The test framework -----
	//
	// Jasmine and Cucumber are fully supported as a test and assertion framework.
	// Mocha has limited beta support. You will need to include your own
	// assertion framework if working with mocha.
	framework: 'mocha',

	// ----- Options to be passed to minijasminenode -----
	//
	// See the full list at https://github.com/juliemr/minijasminenode
	// jasmineNodeOpts: {
	// onComplete will be called just before the driver quits.
	//  onComplete: null,
	// If true, display spec names.
	//  isVerbose: false,
	// If true, print colors to the terminal.
	//  showColors: true,
	// If true, include stack traces in failures.
	//  includeStackTrace: true,
	// Default time to wait in ms before a test fails.
	//  defaultTimeoutInterval: 30000
	// },

	// ----- Options to be passed to mocha -----
	//
	// See the full list at http://visionmedia.github.io/mocha/
	mochaOpts: {
		ui: 'bdd',
		// reporter: 'xunit-file'
		reporter: 'mocha-jenkins-reporter',
		reporterOptions: {
			junit_report_name: 'View Tests Report (UI)',
			junit_report_path: 'reports/viewReport.xml',
			junit_report_stack: 1
		}
	},

	// ----- Options to be passed to cucumber -----
	// cucumberOpts: {
	// Require files before executing the features.
	//  require: 'cucumber/stepDefinitions.js',
	// Only execute the features or scenarios with tags matching @dev.
	// This may be an array of strings to specify multiple tags to include.
	//  tags: '@dev',
	// How to format features (default: progress)
	//  format: 'summary'
	// },

	// ----- The cleanup step -----
	//
	// A callback function called once the tests have finished running and
	// the webdriver instance has been shut down. It is passed the exit code
	// (0 if the tests passed or 1 if not).
	onCleanUp: function() {},

	// NOTES (by Giliar):
	// * This is work-in-progress. To be done:
	// ** Move the code below to a separate plugin
	// ** Prettify the CSS + HTML
	// ** Add the ability to read multiple files (just so we can generate a pretty HTML graph)
	// ** Add build number to current report (reading from environment vars)
	onComplete: function (status) {
		// var fs = require('fs');
		// var xml2js = require('xml2js');
		// var parser = new xml2js.Parser();
		// var util = require('util');

		// var previousFilesObj = {};

		// var currentBuild = parseInt(process.env.BUILD_NUMBER);
		// currentBuild = 1652; // TEMPORARY
		// var fileList = [];

		// for (var i = -1; i > -5; i--) {
		// 	fileList.push('../' + (currentBuild + i) + '/viewReport.xml');
		// }

		// var async = require('async');
		// function loadPreviousXmlFiles() {
		// 	async.eachSeries(fileList,	function (filename, callback) {
		// 		fs.readFile(filename, 'utf8', function (error, content) {
		// 			console.log('File reading for ' + filename + ' error: ' + error);
		// 			if (!error) {
		// 				parser.parseString(content, (error, result) => {
		// 					console.log('Parsing of ' + filename + 'went wrong. Error: ' + error);
		// 					if (!error) {
		// 						previousFilesObj[filename.substring(filename.indexOf('/') + 1, filename.lastIndexOf('/'))] = result;
		// 					}
		// 				});

		// 			}

		// 			// Calling callback makes it go to the next item
		// 			callback(error);
		// 		});
		// 	}, function (error) { // Final callback after each item has been iterated over
		// 		console.log('----------------');
		// 		console.log('final obj', previousFilesObj);
		// 	});
		// }
		// loadPreviousXmlFiles();

		// fs.readFile('./reports/viewReport.xml', 'utf8', (err,data) => {
		// 	parser.parseString(data, (err, result) => {

		// 		// console.log(util.inspect(result, false, null));
		// 		// console.log('Done');
		// 		// http://plm360jenkins.ecs.ads.autodesk.com:9090/view/09-NextPLM/view/Habanero%20(ci%20branch)/job/nextplm-rc-viewtests/ws/reports/
		// 		// http://plm360jenkins.ecs.ads.autodesk.com:9090/view/09-NextPLM/view/Habanero%20(ci%20branch)/job/nextplm-rc-viewtests/1650/artifact/reports/

		// 		var htmlSuiteBody = '<table cellspacing="2" cellpadding="2" border="1">';
		// 		var htmlSuiteFooter = '</table>';

		// 		for (var testsuite in result.testsuites) {
		// 			if (testsuite === 'testsuite') {
		// 				for (var singleTestsuite in result.testsuites[testsuite]) {
		// 					testSuiteName = result.testsuites[testsuite][singleTestsuite].$.name;
		// 					testSuiteTestQuantity = parseInt(result.testsuites[testsuite][singleTestsuite].$.tests);
		// 					testSuiteFailures = parseInt(result.testsuites[testsuite][singleTestsuite].$.failures);
		// 					testSuiteSkipped = parseInt(result.testsuites[testsuite][singleTestsuite].$.skipped);
		// 					testSuiteTimestamp = result.testsuites[testsuite][singleTestsuite].$.timestamp;
		// 					testSuiteTime = parseFloat(result.testsuites[testsuite][singleTestsuite].$.time);

		// 					var testSuiteHeader = `<tr>
		// 						<th></th>
		// 						<th><span class='testsuite-name'>${testSuiteName}</span></th>
		// 					</tr>`;
		// 					var testSuiteRowInfo = `<tr>
		// 						<td class="label">Passed:</td>
		// 						<td>${testSuiteTestQuantity}</td>
		// 					</tr>`;

		// 					var testSuiteRowTime;
		// 					if (testSuiteFailures > 0) {
		// 						testSuiteRowTime = `<tr>
		// 							<td class="label">Time:</td>
		// 							<td>${testSuiteFailures} failure(s)</td>
		// 						</tr>`;
		// 					} else {
		// 						testSuiteRowTime = `<tr>
		// 							<td class="label">Time:</td>
		// 							<td>${testSuiteTime}s</td>
		// 						</tr>`;
		// 					}

		// 					var testSuiteRowSkipped = `<tr>
		// 						<td class="label">Skipped:</td>
		// 						<td>${testSuiteSkipped}</td>
		// 					</tr>`;

		// 					htmlSuiteBody += testSuiteHeader + testSuiteRowInfo + testSuiteRowTime + testSuiteRowSkipped;
		// 				}
		// 			}
		// 		}

		// 		htmlSuiteBody += htmlSuiteFooter;

		// 		// To be further customized
		// 		var baseHTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>View Tests Report (UI)</title><link rel="stylesheet" href="css/styles.css?v=1.0"></head><body>${htmlSuiteBody}</body></html>`;
		// 		fs.writeFile('./reports/viewReport.html', baseHTML, (err) => {
		// 			if (err) {
		// 				return console.log('Error saving report:', err);
		// 			}
		// 			console.log('Report saved successfully.');
		// 		});

		// 	});
		// });
	}
};
