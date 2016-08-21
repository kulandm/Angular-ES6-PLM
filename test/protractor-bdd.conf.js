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
	//chromeDriver: '../node_modules/protractor/selenium/chromedriver',

	// If true, only chromedriver will be started, not a standalone selenium.
	// Tests for browsers other than chrome will not run.
	chromeOnly: false,

	specs: ['./automation/bdd/features/*.feature'],

	// Additional command line options to pass to selenium. For example,
	// if you need to change the browser timeout, use
	// seleniumArgs: ['-browserTimeout=60'],
	//seleniumArgs: [],

	// If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
	// The tests will be run remotely using SauceLabs.
	//sauceUser: null,
	//sauceKey: null,

	// The address of a running selenium server. If specified, Protractor will
	// connect to an already running instance of selenium. This usually looks like
	//seleniumAddress: 'http://localhost:4444/wd/hub',
	//seleniumAddress: null,

	// The timeout for each script run on the browser. This should be longer
	// than the maximum time your application needs to stabilize between tasks.
	allScriptsTimeout: 60000,

	// ----- What tests to run -----
	//
	// Suites that can be run using the `--suite=<name1>[,<name2>,...]` argument.
	// Not specifying the `--suite` argument will run all the suites.
	// suites: {
	// 	view: './automation/view/*Spec.js',
	// 	high: './automation/e2e/high/*Spec.js',
	// 	medium: './automation/e2e/medium/*Spec.js',
	// 	low: './automation/e2e/low/*Spec.js',
	// 	smoke: './automation/e2e/high/ChangeManagementSpec.js',
	// 	bdd: './automation/bdd/features/*.feature'
	// },

	// Patterns to exclude.
	//exclude: [],

	// Alternatively, suites may be used. When run without a commad line parameter,
	// all suites will run. If run with --suite=smoke, only the patterns matched
	// by that suite will run.
	//suites: {
	//  smoke: 'spec/smoketests/*.js',
	//  full: 'spec/*.js'
	//},

	// ----- Capabilities to be passed to the webdriver instance ----
	//
	// For a full list of available capabilities, see
	// https://code.google.com/p/selenium/wiki/DesiredCapabilities
	// and
	// https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
	capabilities: {
		'browserName': 'chrome',
		'platform': 'ANY'
	},

	// If you would like to run more than one instance of webdriver on the same
	// tests, use multiCapabilities, which takes an array of capabilities.
	// If this is specified, capabilities will be ignored.
	//  multiCapabilities: [
	//  {
	//  'browserName': 'chrome'
	//}, {
	//  'browserName': 'firefox'
	//}, {
	//  'browserName': 'phantomjs',
	//      'phantomjs.binary.path': 'node_modules/.bin/phantomjs'
	//}],


	// ----- More information for your tests ----
	//
	// A base URL for your application under test. Calls to protractor.get()
	// with relative paths will be prepended with this.
	//baseUrl: 'http://tabasco.ads.autodesk.com/?customer=SELENIUM_HIG',

	// Selector for the element housing the angular app - this defaults to
	// body, but is necessary if ng-app is on a descendant of <body>
	//rootElement: 'body',

	// A callback function called once protractor is ready and available, and
	// before the specs are executed
	// You can specify a file containing code to run by setting onPrepare to
	// the filename string.
	onPrepare: function() {
		//At this point, global 'protractor' object will be set up, and jasmine
		//will be available. For example, you can add a Jasmine reporter with:
		//    jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
		//        'outputdir/', true, true));
		var fs = require('fs');
		browser.driver.manage().window().setSize(1280, 1024);

		var chai = require('chai');
		var chaiAsPromised = require('chai-as-promised');
		chai.use(chaiAsPromised);

		global.expect = chai.expect;
		var files = fs.readdirSync('./test/automation/bdd/features');
		global.totalTests = files.length;
		global.loggedInUser = null;
		global.acceptedTerms = false;

		if (browser.params.pristineFirst && browser.params.pristineFirst === "true") {
			browser.driver.get(browser.params.plmBaseUrl + '/authentication/backOfficeLoginPage.bo');
			browser.driver.findElement(by.name('j_username')).sendKeys('admin');
			browser.driver.findElement(by.name('j_password')).sendKeys('admin');
			browser.driver.findElement(by.name('submit')).click();

			browser.driver.wait(function () {
				return browser.driver.getCurrentUrl().then(function (url) {
					return /backOffice.bo/.test(url);
				})
			}, 10000);

			return browser.driver.get(browser.params.plmBaseUrl + '/conn/resetToPristine.bo?customerName=' + browser.params.tenant);
		}
	},

	// The params object will be passed directly to the protractor instance,
	// and can be accessed from your test. It is an arbitrary object and can
	// contain anything you may need in your test.
	// This can be changed via the command line as:
	//   --params.login.user 'Joe'
	//params: {
	//  login: {
	//    user: 'Jane',
	//    password: '1234'
	//  }
	//},

	// ----- The test framework -----
	//
	// Jasmine and Cucumber are fully supported as a test and assertion framework.
	// Mocha has limited beta support. You will need to include your own
	// assertion framework if working with mocha.
	framework: 'cucumber',

	// ----- Options to be passed to minijasminenode -----
	//
	// See the full list at https://github.com/juliemr/minijasminenode
	//jasmineNodeOpts: {
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
	//},

	// ----- Options to be passed to mocha -----
	//
	// See the full list at http://visionmedia.github.io/mocha/
	mochaOpts: {
		ui: 'bdd',
		reporter: 'list'
	},

	// ----- Options to be passed to cucumber -----
	cucumberOpts: {
	// Require files before executing the features.
		require: './automation/bdd/features/step_definitions',
	// Only execute the features or scenarios with tags matching @dev.
	// This may be an array of strings to specify multiple tags to include.
	//  tags: '@dev',
	// How to format features (default: progress)
		format: 'summary'
	},

	// ----- The cleanup step -----
	//
	// A callback function called once the tests have finished running and
	// the webdriver instance has been shut down. It is passed the exit code
	// (0 if the tests passed or 1 if not).
	onCleanUp: function() {}
};
