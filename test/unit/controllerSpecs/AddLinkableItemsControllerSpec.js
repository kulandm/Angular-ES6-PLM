System.get('com/autodesk/filters.js');

'use strict';
/* TODO: need more test cases to test infinite scrolling and server sorting.*/
describe('AddLinkableItemsController', function () {
	var $q = null;
	var scope = null;
	var eventService = null;
	var mockLocationObj = null;
	var mockModelsManager = null;
	var mockItemObj = null;
	var mockRelatedWorkspacesObj = null;
	var mockRESTWrapperService = null;
	var ctrl = null;
	var flyoutClosed = null;

	beforeEach(module('com/autodesk/UnderscoreService.js','com/autodesk/EventService.js','plm360', 'plm360.permissions',
		'plm360.models','com/autodesk/filters.js','plm360.mockObjects','plm360.mockData'));

	beforeEach(module(function ($urlRouterProvider, $provide) {
		// Because of ui-router, we have to use httpBackend to ignore the request for mainDashboard, plm-wrapper etc calls.
		// This is not at all related to controller unit testing. One way of handling this, is to use 'deferIntercept' method
		// of the $urlRouterProvide.
		$urlRouterProvider.deferIntercept();

		// Angular-locale-bundle will call to fetch localization bundle json. This is also not related to controller testing,
		// as we will add mockLocalizationData to the rootScope (if needed). Stubbing out these services will allow us not
		// to use httpBackend server at all.
		$provide.value('localeBundleFactory', sinon.stub({}));
		$provide.value('LocalizationService', sinon.stub({}));
	}));

	/**
	 * Setup for each test cases
	 */
	beforeEach(function () {

		inject(function ($controller,
			$rootScope,
			_$q_,
			_,
			$filter,
			EventService,
			MockModelsManager,
			MockItemObj,
			MockLocationObj,
			MockLocalizationData,
			MockRelatedWorkspaces,
			MockRESTWrapperService,
			MockRelatedWorkspacesObj) {

			// get angular dependencies
			$q = _$q_;
			scope = $rootScope;
			eventService = EventService;

			// get mock objectrs dependencies
			mockModelsManager = new MockModelsManager();
			mockItemObj = new MockItemObj();
			mockRelatedWorkspacesObj = new MockRelatedWorkspacesObj();
			mockRESTWrapperService = new MockRESTWrapperService();
			mockLocationObj = new MockLocationObj();

			mockLocationObj.search.returns({
				itemId: 100,
				tab: '',
				view: '',
				mode: ''
			});

			mockRelatedWorkspacesObj.getFullList.returns(MockRelatedWorkspaces);

			scope.bundle = MockLocalizationData;
			scope.linkableItemsOptions = {
				itemsType: 'affectedItems',
				associationEvent: 'associateAffectedItem'
			};

			// initialization
			flyoutClosed = false;
			var linkableObj = new LinkableItems();
			linkableObj.json = getMockLinkedItems(1, 100);
			angular.forEach(linkableObj.json.items, function (linkableItem, index) {
				linkableObj.json.items[index] = new LinkableItem(linkableItem);
			});
			ctrl = $controller('AddLinkableItemsController', {
				$scope: scope,
				$flyoutInstance: {
					opened: $q.when(''),
					close: function () {
						flyoutClosed = true;
					},
					cancel: function () {
						flyoutClosed = true;
					}
				},
				ModelsManager: mockModelsManager,
				$location: mockLocationObj,
				$q: $q,
				EventService: eventService,
				relatedWorkspaces: []
			});

			LinkableItem.prototype.RESTWrapperService = mockRESTWrapperService;
		});
	});

	after(function () {
		var eventService = null;
		var mockLocationObj = null;
		var mockModelsManager = null;
		var mockItemObj = null;
		var mockRelatedWorkspacesObj = null;
		var mockRESTWrapperService = null;
		var ctrl = null;
		var flyoutClosed = null;
	});

	function getMockLinkedItems(pageOffset, itemQuantity, totalItems) {
		var list = [];
		var total = totalItems || 2000;
		for (var i = 0; i < total; i++) {
			var obj = {
				item: {
					link: '/api/v2/workspaces/9/items/' + i + 1,
					title: 'TEST TITLE -' + i + 1
				},
				workspace: {
					link: 'v2/workspaces/9',
					title: 'TEST Workspace'
				},
				selected: false,
				isSelected: function () {
					return this.selected;
				},
				setSelection: function () {
					this.selected = !this.selected;
				},
				getItemLink: function () {
					return this.item.link;
				},
				getItemTitle: function () {
					return this.item.title;
				}
			};

			if (i % 10 !== 0) {
				obj.lifecycle = {
					link: 'v3/workspaces/9/workflows/93943434343/states/0',
					title: 'Production'
				};
			}

			list.push(obj);
		}

		var res = list.slice(pageOffset, pageOffset + itemQuantity);

		return {
			'linkable-items': {
				count: totalItems
			},
			offset: pageOffset,
			limit: itemQuantity,
			isNext: function () {
				return pageOffset + itemQuantity < totalItems;
			},
			getNextLink: function () {
				return 'dummy-link';
			},
			getLength: function () {
				return itemQuantity;
			},
			getFullList: function () {
				return res;
			},
			getTotalCount: function () {
				return totalItems;
			},
			items: res
		};
	}

	describe('basic tests', function () {
		it('should initialize the controller', function () {
			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			scope.$digest();
			expect(ctrl.listData).to.have.length(100);
			expect(ctrl.totalItemCount).to.be.equal(2000);
			expect(ctrl.linkableItemsObj.isNext()).to.be.true;
		});

		it('should load more elements on scroll', function () {
			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			scope.$digest();

			expect(ctrl.listData).to.have.length(100);
			expect(ctrl.totalItemCount).to.be.equal(2000);
			expect(ctrl.linkableItemsObj.isNext()).to.be.true;

			ctrl.doScroll();

			eventService.send('linkableItems:100:done', getMockLinkedItems(100, 100, 2000));

			expect(ctrl.listData).to.have.length(200);
			expect(ctrl.totalItemCount).to.be.equal(2000);
		});

		it('should filter list on search', function () {
			var linkableObj = new LinkableItems();
			linkableObj.json = getMockLinkedItems(0, 50, 50);
			angular.forEach(linkableObj.json.items, function (linkableItem, index) {
				linkableObj.json.items[index] = new LinkableItem(linkableItem);
			});
			mockModelsManager.getExistingLinkedItems.returns($q.when(linkableObj));

			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			scope.$digest();

			expect(ctrl.listData).to.have.length(100);
			expect(ctrl.totalItemCount).to.be.equal(2000);
			expect(ctrl.linkableItemsObj.isNext()).to.be.true;

			ctrl.doSearch('testing');

			eventService.send('linkableItems:100:done', linkableObj.json);
			scope.$digest();

			expect(ctrl.listData).to.have.length(50);
			expect(ctrl.totalItemCount).to.be.equal(50);
			expect(ctrl.linkableItemsObj.isNext()).to.be.false;

			// Check that the getExistingLinkedItems method was called correctly
			var spyCall = mockModelsManager.getExistingLinkedItems.getCall(0);
			expect(spyCall.args[0]).to.equal(100);
			expect(spyCall.args[1]).to.equal('affectedItems');
			expect(spyCall.args[2]).to.include.keys('search', 'offset', 'limit', 'relatedWorkspaceId');
			expect(spyCall.args[2].search).to.equal('testing');
		});

		it('should filter list on filter option change', function () {
			var linkableObj = new LinkableItems();
			linkableObj.json = getMockLinkedItems(0, 50, 50);
			angular.forEach(linkableObj.json.items, function (linkableItem, index) {
				linkableObj.json.items[index] = new LinkableItem(linkableItem);
			});
			mockModelsManager.getExistingLinkedItems.returns($q.when(linkableObj));
			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			scope.$digest();

			expect(ctrl.listData).to.have.length(100);
			// expect(scope.totalItemCount).to.be.equal(2000);
			expect(ctrl.linkableItemsObj.isNext()).to.be.true;

			ctrl.optionChanged('v2/workspaces/9');

			eventService.send('linkableItems:100:done', linkableObj.json);
			scope.$digest();

			expect(ctrl.listData).to.have.length(50);
			expect(ctrl.totalItemCount).to.be.equal(50);
			expect(ctrl.linkableItemsObj.isNext()).to.be.false;

			// Check that the getExistingLinkedItems method was called correctly
			var spyCall = mockModelsManager.getExistingLinkedItems.getCall(0);
			expect(spyCall.args[0]).to.equal(100);
			expect(spyCall.args[1]).to.equal('affectedItems');
			expect(spyCall.args[2]).to.include.keys('search', 'offset', 'limit', 'relatedWorkspaceId');
			expect(spyCall.args[2].relatedWorkspaceId).to.equal('9');
		});

		it('should clear selection', function () {
			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			scope.$digest();

			expect(ctrl.listData).to.have.length(100);
			expect(ctrl.totalItemCount).to.be.equal(2000);
			expect(ctrl.linkableItemsObj.isNext()).to.be.true;

			ctrl.listData[5].setSelection(!ctrl.listData[5].isSelected());
			ctrl.listData[8].setSelection(!ctrl.listData[8].isSelected());

			ctrl.toggleSelection(ctrl.listData[5]);
			ctrl.toggleSelection(ctrl.listData[8]);

			expect(ctrl.selectedItemIdList).to.have.length(2);

			ctrl.clearSelection();

			expect(ctrl.selectedItemIdList).to.have.length(0);
		});
	});

	describe('select/deselect item tests', function () {
		it('should filter list on search', function () {

			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			scope.$digest();

			expect(ctrl.listData).to.have.length(100);
			expect(ctrl.totalItemCount).to.be.equal(2000);
			expect(ctrl.linkableItemsObj.isNext()).to.be.true;

			ctrl.listData[5].setSelection(!ctrl.listData[5].isSelected());
			ctrl.listData[8].setSelection(!ctrl.listData[8].isSelected());

			ctrl.toggleSelection(ctrl.listData[5]);
			ctrl.toggleSelection(ctrl.listData[8]);

			expect(ctrl.selectedItemIdList).to.have.length(2);

			ctrl.listData[5].setSelection(!ctrl.listData[5].isSelected());
			ctrl.toggleSelection(ctrl.listData[5]);

			expect(ctrl.selectedItemIdList).to.have.length(1);
		});

		it('should filter list on search but preserve selection.', function () {
			var linkableObj = new LinkableItems();
			linkableObj.json = getMockLinkedItems(0, 50, 50);
			angular.forEach(linkableObj.json.items, function (linkableItem, index) {
				linkableObj.json.items[index] = new LinkableItem(linkableItem);
			});
			mockModelsManager.getExistingLinkedItems.returns($q.when(linkableObj));

			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			scope.$digest();

			expect(ctrl.listData).to.have.length(100);
			expect(ctrl.totalItemCount).to.be.equal(2000);
			expect(ctrl.linkableItemsObj.isNext()).to.be.true;

			ctrl.listData[5].setSelection(!ctrl.listData[5].isSelected());
			ctrl.listData[8].setSelection(!ctrl.listData[8].isSelected());

			ctrl.toggleSelection(ctrl.listData[5]);
			ctrl.toggleSelection(ctrl.listData[8]);

			expect(ctrl.selectedItemIdList).to.have.length(2);

			ctrl.doSearch('testing');

			eventService.send('linkableItems:100:done', linkableObj.json);
			scope.$digest();

			expect(ctrl.listData).to.have.length(50);
			expect(ctrl.totalItemCount).to.be.equal(50);
			expect(ctrl.linkableItemsObj.isNext()).to.be.false;

			expect(ctrl.selectedItemIdList).to.have.length(2);
		});
	});

	describe('submit/cancel selection', function () {
		it('should close the flyout (basic)', function () {
			expect(flyoutClosed).to.be.false;

			mockRESTWrapperService.allSettled.returns($q.when({}));

			mockModelsManager.getItem.returns($q.when({
				associateAffectedItem: function () {
					return $q.when({});
				}
			}));

			ctrl.submitSelection();

			_.each(ctrl.selectedItemIdList, function (selectedItem) {
				var selectedItemId = selectedItem.ref.getItemLink().substring(selectedItem.ref.getItemLink().lastIndexOf('/') + 1);
				eventService.send('itemInstance:' + selectedItemId + ':associationDone', true);
			});
			scope.$digest();

			expect(flyoutClosed).to.be.true;
		});

		it('should close the flyout with selection', function () {
			expect(flyoutClosed).to.be.false;

			var mockItem = sinon.stub({
				associateAffectedItem: function () {},
				workspaceObj: {
					getId: function () {}
				}
			});

			eventService.send('relatedWorkspaces:1:done', mockRelatedWorkspacesObj);
			eventService.send('linkableItems:100:done', getMockLinkedItems(0, 100, 2000));
			eventService.send('itemInstance:100:done', mockItem);
			scope.$digest();

			ctrl.listData[5].setSelection(!ctrl.listData[5].isSelected());
			ctrl.listData[8].setSelection(!ctrl.listData[8].isSelected());
			ctrl.toggleSelection(ctrl.listData[5]);
			ctrl.toggleSelection(ctrl.listData[8]);

			mockItem.associateAffectedItem.returns($q.when({}));

			ctrl.submitSelection();

			_.each(ctrl.selectedItemIdList, function (selectedItem) {
				var selectedItemId = selectedItem.ref.getItemLink().substring(selectedItem.ref.getItemLink().lastIndexOf('/') + 1);
				eventService.send('itemInstance:' + selectedItemId + ':associationDone', true);
			});
			scope.$digest();

			expect(flyoutClosed).to.be.true;
		});

		it('should cancel the flyout', function () {
			expect(flyoutClosed).to.be.false;

			ctrl.cancelSelection();

			expect(flyoutClosed).to.be.true;
		});
	});
});
