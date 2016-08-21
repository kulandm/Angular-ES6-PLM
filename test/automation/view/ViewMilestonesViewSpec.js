/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewMilestonesViewSpec
 *
 * @description This is the view tests for the Workspace Item Milestones.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var viewMilestonesPage = require('../pages/ViewMilestonesPage');
var MainDashboardPage = require('../pages/MainDashboardPage');

function ViewMilestonesViewSpec() {

	AbstractItemViewPage = new AbstractItemViewPage();
	viewMilestonesPage = new viewMilestonesPage();
	
	var that = this;

	describe.skip('[ViewMilestonesView]', function () {

		this.timeout(60000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewMilestonesPage.go();
					viewMilestonesPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});
		
		it('displays the tableData component with the required columns', function () {
			this._runnable.ssName = 'ViewMilestonesView-tableDataPresent';

			expect(viewMilestonesPage.isTableDataDisplayed()).to.eventually.be.true;
			expect(viewMilestonesPage.tableHeaderFields.get(0).getText()).to.eventually.contain('WORKFLOW STATE');
			expect(viewMilestonesPage.tableHeaderFields.get(1).getText()).to.eventually.contain('MILESTONE EVENT');
			expect(viewMilestonesPage.tableHeaderFields.get(2).getText()).to.eventually.contain('TARGET DATE');
			expect(viewMilestonesPage.tableHeaderFields.get(3).getText()).to.eventually.contain('STATUS');
			expect(viewMilestonesPage.tableHeaderFields.get(4).getText()).to.eventually.contain('+/- DAYS FROM TARGET DATE');
			expect(viewMilestonesPage.tableHeaderFields.get(5).getText()).to.eventually.contain('WARNING DAYS BEFORE');
			expect(viewMilestonesPage.tableHeaderFields.get(6).getText()).to.eventually.contain('WORKFLOW PROGRESS (%)');
		});

		it('should sort items when clicked on the header column', function () {
			this._runnable.ssName = 'ViewMilestonesView-sorting';

			// Perform sort only when there is more than one workspace item
			viewMilestonesPage.getRelatedItemsCount().then(function (ItemsCount) {
				if (ItemsCount > 1) {
					// Get the first item name
					viewMilestonesPage.getFirstRelatedItemText().then(function (firstItem) {
						var beforeSort = firstItem;
						// Perform the sort
						viewMilestonesPage.sortRelationshipsItems().then(function (value) {
							viewMilestonesPage.getFirstRelatedItemText().then(function (text) {
									expect(text).to.not.equal(beforeSort);
								});
						});
					});
				}
			});
		});

		it('Item should be start in state "Kickoff"', function () {
			this._runnable.ssName = 'ViewMilestonesView-Kickoff';

			expect(viewMilestonesPage.countDoneForTransition(0)).to.eventually.equal(1);
			expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(1);
			expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(7);				
		});
		
		describe('[Perform Workflow Actions]', function () {
			var transitions = [
				'Start Requirements Definition',
				'Set to Under Development',
				'Start EVT',
				'Start DVT',
				'Start Control Run',
				'Start Pilot Run',
				'Start Production'
				];

			var i = 0;
			
			beforeEach(function () {
				var deferred = protractor.promise.defer();
				AbstractItemViewPage.performWorkflowAction(transitions[i], 'Any Comments').then(function (result) {
					expect(result).to.be.true;
					deferred.fulfill();
				});
				return deferred.promise;
			});
			
			afterEach(function () {
				i++;
			});

			it('Item should be transitioned to state "Start Requirements Definition" and status has been changed', function () {
				this._runnable.ssName = 'ViewMilestonesView-StartRequirementDefinition';

				expect(viewMilestonesPage.countDoneForTransition(1)).to.eventually.equal(1);
				expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(2);
				expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(6);				
			});

			it('Item should be transitioned to state "Set to Under Development" and status has been changed', function () {
				this._runnable.ssName = 'ViewMilestonesView-UnderDevelopment';

				expect(viewMilestonesPage.countDoneForTransition(2)).to.eventually.equal(1);
				expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(3);
				expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(5);				
			});
			
			it('Item should be transitioned to state "Start EVT"  and status has been changed', function () {
				this._runnable.ssName = 'ViewMilestonesView-StartEVT';

				expect(viewMilestonesPage.countDoneForTransition(3)).to.eventually.equal(1);
				expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(4);
				expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(4);				
			});

			it('Item should be transitioned to state "Start DVT"  and status has been changed', function () {
				this._runnable.ssName = 'ViewMilestonesView-StartDVT';

				expect(viewMilestonesPage.countDoneForTransition(4)).to.eventually.equal(1);
				expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(5);
				expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(3);				
			});

			it('Item should be transitioned to state "Start Control Run"  and status has been changed', function () {
				this._runnable.ssName = 'ViewMilestonesView-StartControlRun';

				expect(viewMilestonesPage.countDoneForTransition(5)).to.eventually.equal(1);
				expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(6);
				expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(2);
			});

			it('Item should be transitioned to state "Start Pilot Run"  and status has been changed', function () {
				this._runnable.ssName = 'ViewMilestonesView-StartPilotRun';

				expect(viewMilestonesPage.countDoneForTransition(6)).to.eventually.equal(1);
				expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(7);
				expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(1);
			});

			it('Item should be transitioned to state "Start Production"  and status has been changed', function () {
				this._runnable.ssName = 'ViewMilestonesView-StartProduction';

				expect(viewMilestonesPage.countDoneForTransition(7)).to.eventually.equal(1);
				expect(viewMilestonesPage.countTransitionedItems()).to.eventually.equal(8);
				expect(viewMilestonesPage.countNotTransitionedItems()).to.eventually.equal(0);
			});
		});

		describe('[Navigate to Dashboard]', function () {
			before(function () {
				var deferred = protractor.promise.defer();
				MainDashboardPage.go();
				MainDashboardPage.waitForEvents().then(function (result) {
					expect(result).to.be.true;
					deferred.fulfill();
				});
				return deferred.promise;
			});

			it('should display the item in the dashboard', function () {
				this._runnable.ssName = 'ViewMilestonesView-isItemDisplayedInDashboard';

				MainDashboardPage.getOutstandingWorkItemsName().then(function (arrayNames) {
					expect (arrayNames).to.be.an('array');
					expect (arrayNames.toString()).to.not.contain('test BOM');
				});
			});
		});
	});
}

module.exports = new ViewMilestonesViewSpec();
