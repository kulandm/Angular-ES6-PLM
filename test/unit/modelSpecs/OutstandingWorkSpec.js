System.get('com/autodesk/filters.js');

'use strict';

describe('OutstandingWork', function () {
	var model;
	var $filter, $provide, $q;
	var RESTWrapperService;
	var mockMainData, mockItemData, mockMilestonesData;

	// TODO: This is a rollback because of a failure in Jenkins unit tests, we must revisit this to reduce this functions into one
	function mainRequest(data) {
		var mainDeferred = $q.defer();
		RESTWrapperService.get.withArgs('api/v3/users/PLMAutoTest/outstanding-work', null, null, {skipCache: true, ifModifiedSince: true})
			.returns(mainDeferred.promise);
		mainDeferred.resolve(data);
	}

	function itemRequest(data) {
		var itemDeferred = $q.defer();
		RESTWrapperService.get.withArgs('api/v3/workspaces/7/items/4611', null, null, {skipCache: true, hideError: true})
			.returns(itemDeferred.promise);
		itemDeferred.resolve(data);
	}

	function milestonesRequest(data) {
		var milestonesDeferred = $q.defer();
		RESTWrapperService.get.withArgs('api/v3/workspaces/7/items/4611/views/17', null, null, {hideError: true})
			.returns(milestonesDeferred.promise);
		milestonesDeferred.resolve(data);
	}

	beforeEach(module('plm360','plm360.models','com/autodesk/filters.js', 'plm360.mockData', 'plm360.mockObjects',
		function (_$provide_) {
			$provide = _$provide_;
		}));

	beforeEach(function () {
		inject(function (_MockOutstandingWorkData_, _MockMilestonesData_,_MockMOWItemData_, _MockRESTWrapperService_,
						 _$filter_, _$timeout_, _$httpBackend_, _$q_) {

			$filter = _$filter_;
			$q = _$q_;

			// Mock required requests
			_$httpBackend_.whenGET('lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});
			_$httpBackend_.whenGET('/api/rest/v1/token').respond(200, '');
			_$httpBackend_.whenGET('build/components/plmWrapper/plmWrapper.html').respond('');
			_$httpBackend_.whenGET('components/mainDashboard/mainDashboard.html').respond('');

			RESTWrapperService = _MockRESTWrapperService_();
			$provide.value('RESTWrapperService', RESTWrapperService);
			OutstandingWork.prototype.RESTWrapperService = RESTWrapperService;

			mockMainData = _MockOutstandingWorkData_;
			mockItemData = _MockMOWItemData_;
			mockMilestonesData = _MockMilestonesData_;

			mainRequest(mockMainData);
			itemRequest(mockItemData);
			milestonesRequest(mockMilestonesData);

			model = new OutstandingWork();
			model.fetch('api/v3/users/PLMAutoTest/outstanding-work', false);
			_$timeout_.flush();
		});
	});

	describe('fetch method', function () {

		it('should have an inboxItem', function () {
			expect(model.json.outstandingWork[0]).to.have.property('inboxItem');
			expect(model.json.outstandingWork[0]).to.have.property('lastHistoryStep');
		});

		it('should have added the item urn', function () {
			expect(model.json.outstandingWork[0].inboxItem).to.have.property('item');
			expect(model.json.outstandingWork[0].inboxItem.item.urn).to.equal(mockItemData.urn);
		});

		it('should have added the correct state name', function () {
			expect(model.json.outstandingWork[0].inboxItem).to.have.property('workflowStateName');
			expect(model.json.outstandingWork[0].inboxItem.workflowStateName).to.equal(mockItemData.currentState.title);
		});

		it('should have added the properties corresponding to the workspace', function () {
			var ws = model.json.outstandingWork[0].inboxItem.workspace;
			var expectedId = ws.link.substring(ws.link.lastIndexOf('/') + 1);
			var expectedLabel = ws.title;
			expect(ws).to.be.defined;
			expect(ws.id).to.equal(expectedId);
			expect(ws.label).to.equal(expectedLabel);
		});
	});

	// TODO: We must revisit this to make additional tests and remove inline mock data

	describe('getDisplayableData',function () {

		it('should return the formatted data', function () {
			var ret = model.getDisplayableData($filter, function (k) {
				return k;
			});
			expect(ret.data[0]).to.have.property('milestone');
		});

		it('should return the formatted data with milestone stateDate', function () {
			var ret = model.getDisplayableData($filter, function (k) {
				k.stateDate = 1;
				return k;
			});
			expect(ret.data[0].iconflag).to.not.equal('');
		});

		it('should return empty object if no data', function () {
			var emptyModel = new OutstandingWork();
			emptyModel.json = {
				outstandingWork: []
			};
			var ret = emptyModel.getDisplayableData($filter, function (k) {
				return k;
			});
			expect(ret.data).to.deep.equal([]);
		});

		it('should return object without milestone if milestoneList not defined', function () {

			var emptyModel = new OutstandingWork();
			emptyModel.json = {
				outstandingWork: [{
					inboxItem: {
						id: 49,
						userId: 'PLMAutoTest',
						initiatingUserId: 'PLMAutoTest',
						message: 'Workflow action Transition',
						urn: 'asdf',
						item: {
							id: 608,
							description: 'test5',
							link: '////'
						},
						master: {
							title: 'title',
							urn: ''
						},
						workspace: {
							id: 8,
							label: 'Selenium Suite - Controlled',
							link: '////'
						},
						keyCode: 'TRANSITION_ROLLEDBACK',
						outstandingWork: true,
						userDisplayName: 'PLMAutoTest Selenium1',
						workflowStateName: 'State A',
						timestamp: '2014-04-08T15:54:52.376+08:00',
						delegated: false,
						escalated: false
					}
				}]
			};
			var ret = emptyModel.getDisplayableData($filter, function (k) {
				return k;
			});
			expect(ret.data[0]).to.not.have.property('milestone');
		});

		it('should return object with non-empty iconpublish when escalated is true', function () {
			var emptyModel = new OutstandingWork();
			emptyModel.json = {
				outstandingWork: [{
					inboxItem: {
						id: 49,
						userId: 'PLMAutoTest',
						initiatingUserId: 'PLMAutoTest',
						message: 'Workflow action Transition',
						urn: 'asdf',
						item: {
							id: 608,
							description: 'test5',
							link: '////'
						},
						master: {
							title: 'title',
							urn: '',
							link: '////'
						},
						workspace: {
							id: 8,
							label: 'Selenium Suite - Controlled',
							link: '////'
						},
						keyCode: 'TRANSITION_ROLLEDBACK',
						outstandingWork: true,
						userDisplayName: 'PLMAutoTest Selenium1',
						workflowStateName: 'State A',
						timestamp: '2014-04-08T15:54:52.376+08:00',
						delegated: false,
						escalated: false
					}
				}]
			};
			var ret = emptyModel.getDisplayableData($filter, function (k) {
				return k;
			});
			expect(ret.data[0].iconpublish).to.not.equal('');
		});

		it('should return object with non-empty iconalert when escalated is true', function () {
			var emptyModel = new OutstandingWork();
			emptyModel.json = {
				outstandingWork: [{
					inboxItem: {
						id: 49,
						userId: 'PLMAutoTest',
						initiatingUserId: 'PLMAutoTest',
						message: 'Workflow action Transition',
						urn: 'asdf',
						item: {
							id: 608,
							description: 'test5',
							link: '////'
						},
						master: {
							title: 'title',
							urn: '',
							link: '////'
						},
						workspace: {
							id: 8,
							label: 'Selenium Suite - Controlled',
							link: '////'
						},
						keyCode: 'TRANSITION_ROLLEDBACK',
						outstandingWork: true,
						userDisplayName: 'PLMAutoTest Selenium1',
						workflowStateName: 'State A',
						timestamp: '2014-04-08T15:54:52.376+08:00',
						delegated: false,
						escalated: false
					}
				}]
			};
			var ret = emptyModel.getDisplayableData($filter, function (k) {
				return k;
			});
			expect(ret.data[0].iconalert).to.not.equal('');
		});
	});
});
