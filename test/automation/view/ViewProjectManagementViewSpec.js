/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewProjectManagementViewSpec
 *
 * @description This is the view tests for the Project Management view.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var projectManagementPage = require('../pages/ViewProjectManagementPage');

function ViewProjectManagementViewSpec() {

	ViewProjectManagementViewSpec.super_.call(this);
	var that = this;

	describe('ViewProjectManagementView', function () {
		this.timeout(300000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					projectManagementPage.go();
					projectManagementPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
				});
			});
		});

		after(function () {
//			auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('displays the tableData component with the required columns', function () {
			this._runnable.ssName = 'ViewProjectManagementView-tableDataPresent';

			expect(projectManagementPage.isTableDataDisplayed()).to.eventually.be.true;
			expect(projectManagementPage.tableHeaderFields.get(0).getText()).to.eventually.contain('#');
			expect(projectManagementPage.tableHeaderFields.get(1).getText()).to.eventually.equal('');
			expect(projectManagementPage.tableHeaderFields.get(2).getText()).to.eventually.contain('ITEM DESCRIPTOR');
			expect(projectManagementPage.tableHeaderFields.get(3).getText()).to.eventually.contain('START DATE');
			expect(projectManagementPage.tableHeaderFields.get(4).getText()).to.eventually.contain('END DATE');
			expect(projectManagementPage.tableHeaderFields.get(5).getText()).to.eventually.contain('DURATION');
			expect(projectManagementPage.tableHeaderFields.get(6).getText()).to.eventually.contain('PRE');
			expect(projectManagementPage.tableHeaderFields.get(7).getText()).to.eventually.contain('STATUS');
			expect(projectManagementPage.tableHeaderFields.get(8).getText()).to.eventually.contain('% COMPLETE');
		});

		it('displays the gantt chart component with the required columns', function () {
			this._runnable.ssName = 'ViewProjectManagementView-ganttDataPresent';

			expect(projectManagementPage.isGanttChartDisplayed()).to.eventually.be.true;
		});

		it('expands project and milestone types of nodes', function () {
			// Unfortunately no item in the tenant has WFP nodes, so this test
			// only expands a milestone
			this._runnable.ssName = 'ViewProjectManagementView-tableNodeExpansion';

			expect(projectManagementPage.tableRows.count()).to.eventually.equal(4);

			// Expand the first expandable row
			projectManagementPage.tableRowExpanders.get(0).click();
			expect(projectManagementPage.tableRows.count()).to.eventually.equal(8);
		});

		it('collapses expanded nodes', function () {
			this._runnable.ssName = 'ViewProjectManagementView-tableNodeCollapse';

			expect(projectManagementPage.tableRows.count()).to.eventually.equal(8);

			// Expand the first expandable row
			projectManagementPage.tableRowExpanders.get(0).click();
			expect(projectManagementPage.tableRows.count()).to.eventually.equal(4);
		});

		it('displays the gantt chart with proper granularity based on duration', function () {
			this._runnable.ssName = 'ganttChartGranularity';

			expect(projectManagementPage.ganttChartHeader.get(0).getText()).to.eventually.contain('2013');
		});

		it('displays the drop-down for granularity', function () {
			this._runnable.ssName = 'ganttChartGranularityDropdown';

			expect(projectManagementPage.isGranularityDropdownDisplayed()).to.eventually.be.true;
			expect(projectManagementPage.granularityDropdownValue.get(0).getText()).to.eventually.contain('MONTH');
		});

		it('displays resepective icons for WFP and WFM type', function () {
			// Unfortunately no item in the tenant has WFP nodes, so this test
			// only checks for milestone
			this._runnable.ssName = 'displayTypeIcon';

			expect(projectManagementPage.tableRows.get(1).element(by.css('.md-alarm-on')).isPresent()).to.eventually.be.true;
		});

		// Run shared tests
		that.testWorkspacesMenu(projectManagementPage, 'ViewProjectManagementView');
	});
}

util.inherits(ViewProjectManagementViewSpec, SharedSpec);

module.exports = new ViewProjectManagementViewSpec();
