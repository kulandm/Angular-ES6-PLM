// 'use strict';

// /**
//  * The general idea to test {@link TypeaheadWidgetDirective} is to change typedVal and see the effects on the
//  * {@link scope#filteredItemList} property. The directive creates the new scope that is inherited from our scope and
//  * there is a bi-directional binding ("=") between typedVal and filteredItemList.
//  */
// describe('TypeaheadWidgetDirective', function() {

// 	var mockLocalizationData;

// 	beforeEach(module('plm360', 'plm360.models', 'plm360.typeahead', 'components/typeahead/typeaheadWidget.html','plm360.filters'));

// 	describe('local filter tests', function () {
// 		var el, scope;

// 		beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
// 			scope = $rootScope;
// 			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});

// 			scope.itemList = [{
// 				id: 'item1'
// 			}, {
// 				id: 'item2'
// 			}];

// 			scope.bundle = {
// 				text: {
// 					search: 'Search'
// 				}
// 			};

// 			scope.filterDropdownData = {
// 				selectedItemId: 0,
// 				itemList: [
// 					{
// 						link: '/api/v2/workspaces/8',
// 						title: 'Items and BOMs',
// 						type: '/workflowItems'
// 					},
// 					{
// 						link: '/api/v2/workspaces/47',
// 						title: 'Products',
// 						type: '/workflowItems'
// 					}
// 				]
// 			};

// 			scope.filteredItemList = scope.itemList;
// 			scope.typedVal = '';

// 			el = angular.element('<typeahead-widget data="itemList" matched="filteredItemList" filter="id" case-sensitive="false" typed-val="typedVal" filter-dropdown-data="filterDropdownData"></typeahead-widget>');
// 			$compile(el)(scope);
// 			scope.$apply();
// 		}));

// 		it('filter the list to have single item', function () {
// 			var ngModelController = el.find('input').eq(0).controller('ngModel');
// 			ngModelController.$setViewValue('item1');
// 			scope.$digest();
// 			expect(scope.filteredItemList).to.have.length(1);
// 		});

// 		it('filter the list to have no items', function () {
// 			var ngModelController = el.find('input').eq(0).controller('ngModel');
// 			ngModelController.$setViewValue('item4');
// 			scope.$digest();
// 			expect(scope.filteredItemList).to.have.length(0);
// 		});
// 	});

// 	describe('remote filter tests', function () {
// 		var el, scope, $timeout;

// 		beforeEach(inject(function ($compile, $rootScope, $httpBackend, _$timeout_) {
// 			scope = $rootScope;
// 			$timeout = _$timeout_;
// 			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});

// 			scope.itemList = [{
// 				id: 'item1'
// 			}, {
// 				id: 'item2'
// 			}];

// 			scope.bundle = {
// 				text: {
// 					seach: 'Search'
// 				}
// 			};

// 			scope.filterDropdownData = {
// 				selectedItemId: 0,
// 				itemList: [
// 					{
// 						link: '/api/v2/workspaces/8',
// 						title: 'Items and BOMs',
// 						type: '/workflowItems'
// 					},
// 					{
// 						link: '/api/v2/workspaces/47',
// 						title: 'Products',
// 						type: '/workflowItems'
// 					}
// 				]
// 			};

// 			scope.filteredItemList = scope.itemList;
// 			scope.typedVal = '';

// 			scope.filter = function (value) {
// 				scope.itemList.pop();
// 			};

// 			el = angular.element('<typeahead-widget data="itemList" matched="filteredItemList" typed-val="typedVal" remote-filter="filter(value)" is-remote="true" wait-time="1000" filter-dropdown-data="filterDropdownData"></typeahead-widget>');
// 			$compile(el)(scope);
// 			scope.$apply();
// 		}));

// 		it('filter the list to have single item', function () {
// 			var ngModelController = el.find('input').eq(0).controller('ngModel');
// 			ngModelController.$setViewValue('item1');
// 			scope.$digest();
// 			$timeout.flush();
// 			expect(scope.itemList).to.have.length(1);
// 		});
// 	});
// });