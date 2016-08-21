'use strict';

/**
 * Task for css linter through stylelint
 * @param  {Object} grunt The grunt instance
 * @see https://github.com/stylelint/stylelint/
 *
 * Extra rules added:
 * - https://github.com/stylelint/stylelint/tree/master/src/rules/selector-pseudo-element-colon-notation
  */
module.exports = function (grunt) {
	return grunt.registerTask('csslint', 'CSS Linter with reporter', function () {
		let fs = require('fs'),
		http = require('http'),
		ejs = require('ejs'),
		path = require('path'),
		stylelint = require('stylelint'),
		def = this.async(),
		options = this.options({
			files: 'app/scss/*.scss',
			syntax: 'scss',
			template: 'template.ejs',
			rules: require(process.cwd() + '/' + '.stylelintrc.json'),
			output: 'reports/csslinter.html'
		});

		stylelint.lint({
			config: options.rules,
			files: options.files,
			formatter: 'json',
			syntax: options.syntax
		}).then(function (data) {
			let reportOutput = ejs.render(fs.readFileSync(options.template, 'UTF8'), {
				title: 'SCSS Lint results',
				results: data.results
			});
			fs.writeFile(options.output, reportOutput , function (result) {
				var reportLink = 'file:///' + process.cwd() + '/' + options.output;

				if (result) {
					console.log('Error writing css lint report: ' + result);
					grunt.fail.warn({message: 'Error writing css lint report: ' + result});
				} else {
					var errorFound = false;
					var i = 0;
					while (!errorFound && (i < data.results.length - 1)) {
						errorFound = (data.results[i].warnings.length > 0);
						i++;
					}
					if (errorFound) {
						grunt.fail.warn({message: 'Errors were found, see at ' + reportLink});
					} else {
						console.log('Report done see at ' + reportLink);
					}
				}
				def();
			});
		}).catch(function (error) {
			console.error('Error');
			console.error(error.stack);
		});
	});
};