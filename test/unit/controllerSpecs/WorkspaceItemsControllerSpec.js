System.get('com/autodesk/filters.js');

'use strict';

(function () {
	describe('WorkspaceItemsController', function () {
		var ctrl;
		var mockWorkspaceItemsData, mockLocalizationData, mockWorkspaceItemsService;
		var mockWorkspaceViewsService = {};
		var mockUserProfileData = sinon.stub({
			getDateFormat: function () {}
		});
		var mockWorkspaceItemsTableData;

		var mockWorkspaceViewData = [{
			name: 'view 1',
			id: 2
		}, {
			isDefaultView: true,
			name: 'default view 1',
			id: 1
		}];

		var mockWorkspaceViewsData = {
			result:{
				reportName: 'My Default View',
				outputType: null,
				logicClause: '',
				advancedFilterString: '',
				reportID: 1,
				reportOwnerUserID: 'PLMAutoTest',
				reportOwnerUserDisplayName: 'PLMAutoTest Selenium1',
				createdDate: 1406057302950,
				modifiedDate: 1406057302950,
				workspaceID: 7,
				workspaceShortName: 'Selenium Suite - Controlled',
				reportDescription: '',
				reportAccess: 'P',
				displayGrouped: false,
				showTabNames: false,
				suppressDuplicateRecords: false,
				groupingReport: false,
				workspaceViewReport: true,
				defaultWorkspaceViewReport: true,
				reportOnDeletedItems: 'NON_DELETED_ONLY',
				displayFieldsList: [{
					decoratedField: null,
					fieldID: 'DESCRIPTOR',
					fieldTypeID: 15,
					datePart: null,
					aggregation: null,
					fieldInaccessibleOrOrphaned: false,
					computed: false,
					displayOrder: 0
				}, {
					decoratedField: null,
					fieldID: 'WF_CURRENT_STATE',
					fieldTypeID: 1,
					datePart: null,
					aggregation: null,
					fieldInaccessibleOrOrphaned: false,
					computed: false,
					displayOrder: 1
				}],
				sortFieldsList:[{
					decoratedField: null,
					fieldID: 'DESCRIPTOR',
					fieldTypeID: 15,
					datePart: null,
					aggregation: null,
					fieldInaccessibleOrOrphaned: false,
					computed: false,
					listOrder: 0,
					sortDescending: true
				}],
				filtersFieldsList: [],
				reportCharts: [],
				users: [],
				groups: [],
				qontextGroups: [],
				showUnreleased: false,
				showLatestRelease: false,
				showWorking: false,
				showSuperceded: false,
				topRows: 0,
				hasOrphanFields: false,
				reportGroupingFields: [],
				groupingFieldList: [],
				containsRunTimeFilters: false,
				allReportFields: [{
					decoratedField: null,
					fieldID: 'DESCRIPTOR',
					fieldTypeID: 15,
					datePart: null,
					aggregation: null,
					fieldInaccessibleOrOrphaned: false,
					computed: false,
					displayOrder: 0
				},{
					decoratedField: null,
					fieldID: 'WF_CURRENT_STATE',
					fieldTypeID: 1,
					datePart: null,
					aggregation: null,
					fieldInaccessibleOrOrphaned: false,
					computed: false,
					displayOrder: 1
				},{
					decoratedField: null,
					fieldID: 'DESCRIPTOR',
					fieldTypeID: 15,
					datePart: null,
					aggregation: null,
					fieldInaccessibleOrOrphaned: false,
					computed: false,
					listOrder: 0,
					sortDescending: true
				}]
			},
			exceptions: null
		};

		var mockWorkspaceDefaultViewData = {
			id: 1,
			name: 'default view 1'
		};

		var mockWorkspaceData = {
			workspace: {
				displayName: 'This workspace'
			}
		};

		var mockWorkspaceViewsFields = {
			originalElement: {
				english: 'comment'
			}
		};

		var $controllerConstructor, mockModelsManager, mockWorkspaceObj, mockViewsObj, mockItemsObj, mockUserObj, scope, q, timeout, eventService, state, d, log, underscore, win, mockWorkspaceTableau, mockWorkspacesTableauConfigurationData;
		var provide;

		beforeEach(module(
			'com/autodesk/UnderscoreService.js',
			'com/autodesk/EventService.js',
			'plm360',
			'plm360.workspaceItems',
			'plm360.models',
			'com/autodesk/filters.js',
			'plm360.mockObjects',
			'plm360.mockData'
		));

		/**
		 * Setup for each test cases
		 */
		beforeEach(function () {

			/**
			 * Mock services
			 */
			mockWorkspaceItemsService = sinon.stub({
				getWorkspaceItems: function () {},
				getSortedWorkspaceItems: function () {}
			});

			module(function ($provide) {
				provide = $provide;
			});

			/**
			 * Inject the angular dependencies of the controller
			 * Save these in variables so they can be used in the test cases
			 */
			inject(function ($controller, $rootScope, $q, $timeout, $log, $window, _, MockStateObj, $httpBackend,
							 EventService, MockWorkspaceItemsData, MockWorkspaceItemsTableData, MockModelsManager,
							 MockItemsObj, MockWorkspaceObj, MockViewsObj, MockUserObj, MockWorkspacesTableauAllData, 
							 MockWorkspacesTableauConfigurationData) {
				q = $q;
				state = MockStateObj();
				timeout = $timeout;
				scope = $rootScope;
				underscore = _;
				log = $log;
				win = $window;
				eventService = EventService;
				$controllerConstructor = $controller;
				$httpBackend.expectGET('components/mainDashboard/mainDashboard.html').respond(200, '');
				$httpBackend.whenGET('lib/plm-localization/dist/translations/localizationBundleGeneral.json').respond(200, '');
				$httpBackend.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond('');

				mockModelsManager = new MockModelsManager();
				mockItemsObj = new MockItemsObj();
				mockWorkspaceObj = new MockWorkspaceObj();
				mockViewsObj = new MockViewsObj();
				mockUserObj = new MockUserObj();
				mockWorkspaceItemsData = MockWorkspaceItemsData;
				mockWorkspaceItemsTableData = MockWorkspaceItemsTableData;
				mockWorkspaceTableau = MockWorkspacesTableauAllData;
				mockWorkspacesTableauConfigurationData = MockWorkspacesTableauConfigurationData;

				provide.value('ModelsManager', mockModelsManager);

				mockWorkspaceViewsService.getViewData = function () {
					d = q.defer();
					return d.promise;
				};
			});

			ctrl = $controllerConstructor('WorkspaceItemsController', {
				$scope: scope,
				$log: log,
				$state: state,
				$stateParams: {
					workspaceId: 1
				},
				$window: win,
				WorkspaceViewsFields: mockWorkspaceViewsFields,
				defaultViewObj: mockWorkspaceDefaultViewData,
				LocalizationData: mockLocalizationData,
				WorkspaceViewsService: mockWorkspaceViewsService,
				ModelsManager: mockModelsManager,
				EventService: eventService,
				_: underscore
			});
		});

		describe('init', function () {
			it('should initialize the controller', function () {

				/**
				 * Initialize the controller with our parameters of dependencies
				 */
				mockWorkspaceObj.json = {
					sectionsMeta: {
						definition: {
							fields: [{
								link: '',
								fieldMetadata: {
									type: {
										link: ''
									}
								}
							}]
						}
					}
				};
				mockWorkspaceObj.getFullList.returns(mockWorkspaceData);
				mockWorkspaceObj.getDisplayName.returns('This workspace');
				mockWorkspaceObj.getSectionsMeta.returns(q.all(''));
				mockModelsManager.getItems.returns(q.all(mockWorkspaceViewsData));
				mockModelsManager.getView.returns(mockWorkspaceViewData);

				mockWorkspaceItemsService.getSortedWorkspaceItems.returns(q.all(mockWorkspaceItemsData));

				/**
				 * Call the function we want to test, in this case, the init function
				 */
				scope.init();

				eventService.send('workspaceInstance:1:done', mockWorkspaceObj);
				eventService.send('items:1:done', mockItemsObj);
				eventService.send('currentUser:currentUser:done', mockUserObj);
				eventService.send('workspaceTableau:1:getAllTableauDone', angular.copy(mockWorkspaceTableau));
				eventService.send('workspaceTableau:1@1:getTableauDone', angular.copy(mockWorkspaceTableau.tableaus[0]));

				scope.$digest();

				var doTests = function () {
					if (!scope.workspaceMetadata) {
						setTimeout(function () {
							doTests();
						}, 10);
						return;
					}

					/**
					 * The actual test cases for the function (init)
					 */
					expect(scope.viewName).to.equal('default view 1');
					expect(scope.viewId).to.equal(1);
					expect(scope.views).to.have.length(2);
					expect(scope.workspaceName).to.equal('This workspace');
					expect(scope.tableData.rows).to.have.length(2);
					expect(scope.tableData.columns).to.have.length(2);
				};
			});
		});

		describe('[METHOD] parseWorkspaceItems', function () {

			beforeEach(function () {
				scope.tableData = {columns: [], rows: []};
				scope.pageNumber = 0;

				var tableauConfig = angular.copy(mockWorkspacesTableauConfigurationData);

				scope.parseWorkspaceItems(mockWorkspaceItemsData, 10, tableauConfig);
			});

			it('should use the itemsLinkRenderer template for the cell containing an image', function () {
				expect(scope.tableData.columns[0].cellTemplate).to.equal('itemsLinkRenderer');
			});

			it('should use the itemsOtherRenderer template for the cell containing text', function () {
				expect(scope.tableData.columns[1].cellTemplate).to.equal('itemsOtherRenderer');
			});

			it('should handle two same field ID from different tabs', function () {
				expect(scope.tableData.columns[2].field).to.contain('47-1-NOT_UNIQUE');
				expect(scope.tableData.columns[3].field).to.contain('47-7-NOT_UNIQUE');
				expect(scope.tableData.columns[2].displayName).to.equal('NOT_UNIQUE on item details');
				expect(scope.tableData.columns[3].displayName).to.equal('NOT_UNIQUE on BOM');
			});
		});

		describe('[triggerAddItem method]', function () {

			beforeEach(function () {
				scope.init();
			});

			it('should exist the method and the related permission flag as false', function () {
				expect(scope.triggerAddItem).to.be.defined;
				expect(scope.hasAddItemsPermission).to.be.false;
			});

			it('should check the falsy flag and NOT execute the state change', function () {
				scope.triggerAddItem();
				expect(scope.hasAddItemsPermission).to.be.false;
				expect(state.go).to.not.have.been.called;
			});

			it('should check the truthy flag to execute the state change', function () {
				scope.hasAddItemsPermission = true;
				scope.triggerAddItem();
				expect(state.go).to.have.been.calledWith('add-item');
			});
		});

		describe('[METHOD] getTableauToDisplay', function () {
			var tableau;

			it('should initialize the controller with the defualt view',function () {
				tableau = scope.getTableauToDisplay(mockWorkspaceTableau);

				expect(mockWorkspaceTableau.tableaus.length).to.equal(3);

				expect(tableau).to.not.be.undefined;
				expect(tableau.title).to.equal('My Default View');

			});

			it('should initialize the controller with the first view in alphabetical order',function () {
				var mockWithoutDefault = angular.copy(mockWorkspaceTableau);
				expect(mockWithoutDefault.tableaus[1].type).to.not.be.undefined;
				delete mockWithoutDefault.tableaus[1].type;
				expect(mockWithoutDefault.tableaus[1].type).to.be.undefined;

				tableau = scope.getTableauToDisplay(mockWithoutDefault);

				expect(mockWithoutDefault.tableaus.length).to.equal(3);

				expect(tableau).to.be.ok;
				expect(tableau.title).to.equal('A NOT Default View');

			});
		});
	});
}());
