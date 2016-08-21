'use strict';

describe.skip('ViewSourcingsController', function () {
	var ctrl;
	var eventService;
	var mockSourcingsObj;
	var q;
	var timeout;
	var state = {
		params: {
			itemId: 6881
		},
		href: function () {}
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
		inject(function ($controller,
			$httpBackend,
			$rootScope,
			MockModelsManager,
			EventService,
			PLMPermissions,
			MockViewSourcingsData,
			MockSourcingsObj,
			MockLocalizationData,
			uiGridConstants,
			$q,
			$timeout,
			_) {

			$rootScope.bundle = MockLocalizationData;
			eventService = EventService;

			mockSourcingsObj = new MockSourcingsObj();

			mockSourcingsObj.getFullList.returns(_.map(MockViewSourcingsData, function (item) {
				return {
					json: angular.copy(item)
				};
			}));

			mockSourcingsObj.getQuotes.returns({
				'api/v3/workspaces/9/items/3908/sourcings/44/quotes': {
					json: [{
						__self__: '/api/v3/workspaces/123456789L/items/123456789L/sourcings/44/quotes/48',
						urn: 'urn:adsk.plm:tenant.workspace.item.sourcing.quote:SELENIUM.123456789L.123456789L.44.48',
						minAmount: 1,
						maxAmount: 2,
						leadTime: 2,
						leadTimeMultiplier: 1,
						unitPrice: 0.75,
						quote_comments: 'Added by JLVR',
						defaultQuote: true,
						comments: 'Added by JLVR'
					}, {
						__self__: '/api/v3/workspaces/123456789L/items/123456789L/sourcings/44/quotes/49',
						urn: 'urn:adsk.plm:tenant.workspace.item.sourcing.quote:SELENIUM.123456789L.123456789L.44.49',
						minAmount: 2,
						maxAmount: 3,
						leadTime: 4,
						leadTimeMultiplier: 1,
						unitPrice: 0.74,
						quote_comments: 'Added by JLVR',
						defaultQuote: false,
						comments: 'Added by JLVR'
					}]
				},
				'api/v3/workspaces/9/items/3908/sourcings/45/quotes': {
					json: [{
						__self__: '/api/v3/workspaces/123456789L/items/123456789L/sourcings/45/quotes/50',
						urn: 'urn:adsk.plm:tenant.workspace.item.sourcing.quote:SELENIUM.123456789L.123456789L.45.50',
						minAmount: 2,
						maxAmount: 3,
						leadTime: 2,
						leadTimeMultiplier: 1,
						unitPrice: 0.88,
						quote_comments: 'Added by JLVR',
						defaultQuote: false,
						comments: 'Added by JLVR'
					}]
				}
			});

			mockSourcingsObj.getSupplierTransitions.returns({
				'/api/v3/workspaces/16/items/3900': {
					transitions: [{
						fromState: {
							title: 'Create'
						}
					}]
				},
				'/api/v3/workspaces/16/items/3901': {
					transitions: [{
						fromState: {
							title: 'Active'
						}
					}]
				}
			});

			q = $q;
			timeout = $timeout;

			ctrl = $controller('ViewSourcingController', {
				$scope: $rootScope.$new(),
				$rootScope: $rootScope,
				$state: state,
				$stateParams: state.params,
				ModelsManager: new MockModelsManager(),
				EventService: eventService,
				PLMPermissions: PLMPermissions,
				uiGridConstants: uiGridConstants,
				_: _
			});

		});
	});

	it('displays the only column in the Supplier list mode', function () {
		expect(ctrl.suppliersTableData.columns.length).to.equal(1);
		expect(ctrl.suppliersTableData.columns[0].displayName).to.equal('Supplier');
	});

	it('displays the appropriates values for each row of the Suppliers list ', function () {

		eventService.send('sourcings:6881:done', mockSourcingsObj.getFullList());

		expect(ctrl.suppliersTableData.rows.length).to.equal(2);
		expect(ctrl.suppliersTableData.rows[0].title.val).to.equal('PERM-SUPPLIER-1');
		expect(ctrl.suppliersTableData.rows[1].title.val).to.equal('PERM-SUPPLIER-2');
	});

	it('displays the appropriates values for each attribute of the selected supplier', function () {

		eventService.send('sourcings:6881:done', mockSourcingsObj.getFullList());

		expect(ctrl.selectedSourcing.supplier.title).to.equal('PERM-SUPPLIER-1');
		expect(ctrl.selectedSourcing.supplierPartNumber).to.equal('1000');
		expect(ctrl.selectedSourcing.manufacturer).to.equal('Mfr_1');
		expect(ctrl.selectedSourcing.manufacturerPartNumber).to.equal('10001000');
		expect(ctrl.selectedSourcing.sourcingComment).to.equal('Added by JLVR');

	});

	it('displays the columns titles in the quotes table', function () {

		expect(ctrl.quotesTableData.columns.length).to.equal(5);

		expect(ctrl.quotesTableData.columns[0].displayName).to.equal('Min');
		expect(ctrl.quotesTableData.columns[1].displayName).to.equal('Max');
		expect(ctrl.quotesTableData.columns[2].displayName).to.equal('Lead Time (Days)');
		expect(ctrl.quotesTableData.columns[3].displayName).to.equal('Unit Cost');
		expect(ctrl.quotesTableData.columns[4].displayName).to.equal('Comments');
	});

	it('displays the appropriates values for each row of the quotes list of the supplier selected by default, the first one', function () {

		eventService.send('sourcings:6881:done', mockSourcingsObj.getFullList());
		eventService.send('sourcingQuotes:6881:done',
			mockSourcingsObj.getQuotes()[ctrl.selectedSourcing.quotes.__self__]);

		expect(ctrl.quotesTableData.rows.length).to.equal(2);

		expect(ctrl.quotesTableData.rows[0].minAmount.val).to.equal(1);
		expect(ctrl.quotesTableData.rows[0].maxAmount.val).to.equal(2);
		expect(ctrl.quotesTableData.rows[0].leadTime.val).to.equal(2);
		expect(ctrl.quotesTableData.rows[0].unitPrice.val).to.equal(0.75);
		expect(ctrl.quotesTableData.rows[0].comments.val).to.equal('Added by JLVR');

		expect(ctrl.quotesTableData.rows[1].minAmount.val).to.equal(2);
		expect(ctrl.quotesTableData.rows[1].maxAmount.val).to.equal(3);
		expect(ctrl.quotesTableData.rows[1].leadTime.val).to.equal(4);
		expect(ctrl.quotesTableData.rows[1].unitPrice.val).to.equal(0.74);
		expect(ctrl.quotesTableData.rows[1].comments.val).to.equal('Added by JLVR');

	});

	it('select the second supplier and displays the proper values', function () {

		eventService.send('sourcings:6881:done', mockSourcingsObj.getFullList());

		ctrl.selectSupplier({
			row: {
				entity: {
					title: {id: '/api/v3/workspaces/16/items/3901'}
				}
			}
		});

		expect(ctrl.selectedSourcing.supplier.title).to.equal('PERM-SUPPLIER-2');
		expect(ctrl.selectedSourcing.supplierPartNumber).to.equal('2000');
		expect(ctrl.selectedSourcing.manufacturer).to.equal('Mfr_2');
		expect(ctrl.selectedSourcing.manufacturerPartNumber).to.equal('10011001');
		expect(ctrl.selectedSourcing.sourcingComment).to.equal('Added by JLVR');

	});

	it('select the second supplier and displays the proper values for the only row of its quotes list', function () {

		eventService.send('sourcings:6881:done', mockSourcingsObj.getFullList());

		ctrl.selectSupplier({
			row: {
				entity: {
					title: {id: '/api/v3/workspaces/16/items/3901'}
				}
			}
		});

		eventService.send('sourcingQuotes:6881:done',
			mockSourcingsObj.getQuotes()[ctrl.selectedSourcing.quotes.__self__]);

		expect(ctrl.quotesTableData.rows.length).to.equal(1);

		expect(ctrl.quotesTableData.rows[0].minAmount.val).to.equal(2);
		expect(ctrl.quotesTableData.rows[0].maxAmount.val).to.equal(3);
		expect(ctrl.quotesTableData.rows[0].leadTime.val).to.equal(2);
		expect(ctrl.quotesTableData.rows[0].unitPrice.val).to.equal(0.88);
		expect(ctrl.quotesTableData.rows[0].comments.val).to.equal('Added by JLVR');
	});

	it('retrieves the correct resourceId from a link', function () {

		expect(ctrl.retrieveResourceIdFromSelfLink('/api/v3/workspaces/16/items/3900'))
			.to.equal('16@3900');
		expect(ctrl.retrieveResourceIdFromSelfLink('/api/v3/workspaces/107/items/9902'))
			.to.equal('107@9902');
		expect(ctrl.retrieveResourceIdFromSelfLink('/api/v3/workspaces/18001800/items/100000000'))
			.to.equal('18001800@100000000');

		expect(ctrl.retrieveResourceIdFromSelfLink('/api/v3/workspaces')).to.be.null;
		expect(ctrl.retrieveResourceIdFromSelfLink('/api/v3/workspaces/wrong/items/wrong')).to.be.null;
		expect(ctrl.retrieveResourceIdFromSelfLink('//////')).to.be.null;
		expect(ctrl.retrieveResourceIdFromSelfLink('')).to.be.null;
		expect(ctrl.retrieveResourceIdFromSelfLink(undefined)).to.be.null;
		expect(ctrl.retrieveResourceIdFromSelfLink(null)).to.be.null;

	});

	it('display the proper value for the default supplier state', function () {
		eventService.send('sourcings:6881:done', mockSourcingsObj.getFullList());

		eventService.send('itemTransitions:16@3900:done',
			mockSourcingsObj.getSupplierTransitions()[ctrl.selectedSourcing.supplier.link]);

		expect(ctrl.selectedSourcing.state).to.equal('Create');

	});

	it('select the second supplier and displays the proper value for the supplier state', function () {
		eventService.send('sourcings:6881:done', mockSourcingsObj.getFullList());

		ctrl.selectSupplier({
			row: {
				entity: {
					title: {id: '/api/v3/workspaces/16/items/3901'}
				}
			}
		});

		eventService.send('itemTransitions:16@3901:done',
			mockSourcingsObj.getSupplierTransitions()[ctrl.selectedSourcing.supplier.link]);

		expect(ctrl.selectedSourcing.state).to.equal('Active');

	});
});
