'use strict';

describe('ViewProjectManagementController', function () {
	let ctrl;
	let EventService;
	let PermissionService;
	let mockProjectManagementObj;
	let mockLocationObj;
	let mockItemObj;
	let $state = {
		params: {
			workspaceId: 42,
			itemId: 42
		},
		href: function () {},
		go: function () {}
	};
	let $scope;
	let $timeout;
	let $q;
	let mockFlyoutService = {
		open: sinon.spy()
	};

	// Load the modules used by the controller
	beforeEach(module(
		'com/autodesk/EventService.js',
		'plm360',
		'plm360.models',
		'plm360.mockData',
		'plm360.mockObjects',
		'plm360.permissions'
	));

	// Setup for each test
	beforeEach(function () {
		inject(function (
			$controller,
			$httpBackend,
			$rootScope,
			_$timeout_,
			_$q_,
			_EventService_,
			_PermissionService_,
			PLMPermissions,
			MockModelsManager,
			MockViewProjectManagementData,
			MockProjectItemsObj,
			MockLocationObj,
			MockItemObj,
			MockLocalizationData
		) {
			$rootScope.bundle = MockLocalizationData;
			$scope = $rootScope.$new();
			$timeout = _$timeout_;
			$q = _$q_;
			EventService = _EventService_;
			PermissionService = _PermissionService_;

			$httpBackend.when('GET', 'translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.expect('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');

			mockProjectManagementObj = new MockProjectItemsObj();
			mockProjectManagementObj.getFullList.returns(MockViewProjectManagementData);
			mockLocationObj = new MockLocationObj();
			mockItemObj = new MockItemObj();

			mockLocationObj.search.returns({
				itemId: '42',
				tab: '',
				view: '',
				mode: ''
			});

			ctrl = $controller('ViewProjectManagementController', {
				$scope: $scope,
				$rootScope: $rootScope,
				$state: $state,
				$stateParams: $state.params,
				$location: mockLocationObj,
				ModelsManager: new MockModelsManager(),
				EventService: EventService,
				PermissionService: PermissionService,
				PLMPermissions: PLMPermissions,
				FlyoutService: mockFlyoutService
			});
		});
	});

	it('displays the appropriate columns in VIEW mode', function () {
		expect(ctrl.tableData.columns[0].displayName).to.equal('#');
		expect(ctrl.tableData.columns[1].displayName).to.equal('');
		expect(ctrl.tableData.columns[2].displayName).to.equal('Item Descriptor');
		expect(ctrl.tableData.columns[3].displayName).to.equal('Start Date');
		expect(ctrl.tableData.columns[4].displayName).to.equal('End Date');
		expect(ctrl.tableData.columns[5].displayName).to.equal('Duration');
		expect(ctrl.tableData.columns[6].displayName).to.equal('Pre');
	});

	it('parses the data and adds the necessary properties', function () {
		EventService.send('projectItems:42:done', mockProjectManagementObj);

		_.each(ctrl.tableData.rows, function (row) {
			expect(row.rowId).to.be.a('number');
		});

		expect(ctrl.tableData.rows[0]).to.include.keys('href');
		expect(ctrl.tableData.rows[1]).to.include.keys('href');
		expect(ctrl.tableData.rows[2]).to.include.keys('href');
		expect(ctrl.tableData.rows[3]).to.include.keys('href');
		expect(ctrl.tableData.rows[4]).to.include.keys('href');
		expect(ctrl.tableData.rows[5]).to.include.keys('href');
		expect(ctrl.tableData.rows[6]).to.include.keys('href');
		expect(ctrl.tableData.rows[7]).not.to.include.keys('href');
		expect(ctrl.tableData.rows[8]).not.to.include.keys('href');
		expect(ctrl.tableData.rows[9]).to.include.keys('href');
		expect(ctrl.tableData.rows[10]).not.to.include.keys('href');
	});

	it('redirects to item details view when there is no view project management permission', function () {
		sinon.spy($state, 'go');
		sinon.stub(PermissionService, 'checkPermissionByItem');
		PermissionService.checkPermissionByItem.returns($q.when(false));

		EventService.send('itemInstance:42:done', mockItemObj);
		$timeout.flush();

		expect($state.go).to.have.been.calledWith('details');
	});

	it('shows the flyout when the Add button is clicked', function () {
		ctrl.triggerAdd({});

		let spyCall = mockFlyoutService.open.getCall(0);
		expect(spyCall.args[0].controller).to.equal('AddLinkableItemsController');
		expect(spyCall.args[0].controllerAs).to.equal('addLinkableItemsCtrl');
		expect(spyCall.args[0].scope.linkableItemsOptions).to.deep.equal({
			itemsType: 'projectItems',
			associationEvent: 'associateProjectItem'
		});
	});

	it('shows the gantt chart', function () {
		EventService.send('projectItems:42:done', mockProjectManagementObj);

		expect(ctrl.ganttChartData).to.have.length(12);
		expect(ctrl.ganttChartData[0].title).to.equal('SQ000001 - Autodesk');
		expect(ctrl.ganttChartData[0].tasks).to.have.length(1);
	});

	it('shows the gantt chart with proper granularity', function () {
		EventService.send('projectItems:42:done', mockProjectManagementObj);

		expect(ctrl.ganttChartScale).to.equal('quarter');
	});

	it('uses jsPlumb to draw the predecessors', function () {
		// Mock out jsPlumb and its connect method (we just want to make sure
		// it gets called)
		window.jsPlumb = {
			connect: sinon.stub(),
			detachEveryConnection: sinon.stub()
		};
		let stubConnect = window.jsPlumb.connect;

		EventService.send('projectItems:42:done', mockProjectManagementObj);
		ctrl.drawPredecessors();

		expect(stubConnect.callCount).to.equal(4);

		// Check that all calls were made with the proper arguments
		for (let i = 0; i < stubConnect.callCount; i++) {
			expect(stubConnect.getCall(i).args[0]).to.include.keys('source', 'target');
			expect(stubConnect.getCall(i).args[1]).to.equal(ctrl.jsPlumbConnectionConfig);
		}
	});

	it('shows amber colour for an item with warning status', function () {
		EventService.send('projectItems:42:done', mockProjectManagementObj);

		expect(ctrl.ganttChartData[11].tasks[0].progress.classes).to.include('project-item-type-wfm project-item-status-warning');
		expect(ctrl.ganttChartData[0].tasks[0].progress.classes).to.not.include('project-item-type-wfm project-item-status-warning');
	});

	it('shows green colour for an item with good status', function () {
		EventService.send('projectItems:42:done', mockProjectManagementObj);

		expect(ctrl.ganttChartData[0].tasks[0].progress.classes).to.include('project-item-type-wf project-item-status-good');
		expect(ctrl.ganttChartData[1].tasks[0].progress.classes).to.include('project-item-type-wfp project-item-status-good');
	});

	it('shows red colour for an item with critical status', function () {
		EventService.send('projectItems:42:done', mockProjectManagementObj);

		expect(ctrl.ganttChartData[6].tasks[0].progress.classes).to.include('project-item-type-wfm project-item-status-critical');
		expect(ctrl.ganttChartData[7].tasks[0].progress.classes).to.include('project-item-type-fft project-item-status-critical');
	});

	it('fills color according to completion rate', function () {
		EventService.send('projectItems:42:done', mockProjectManagementObj);

		// It should not include percentage sign
		expect(ctrl.ganttChartData[3].tasks[0].progress.percent).to.equal('25');
		expect(ctrl.ganttChartData[11].tasks[0].classes).to.include('project-item-status-tinted-warning project-item-type-wfm');
		expect(ctrl.ganttChartData[1].tasks[0].classes).to.include('project-item-status-tinted-good project-item-type-wfp');
		expect(ctrl.ganttChartData[7].tasks[0].classes).to.include('project-item-status-tinted-critical project-item-type-fft');
	});
});
