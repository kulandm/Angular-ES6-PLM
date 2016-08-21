// 'use strict';

// describe('MultiselectWidgetDirective', function () {
// 	var el, scope, $compile, mockLocalizationService, locationInitDeferredObj;

// 	function getBundle() {
// 		return {
// 			text: {
// 				noMatches: 'No matches',
// 				clearSelectedItems: 'Clear selected items'
// 			},
// 			widget: {
// 				moreResults : 'more results. Continue typing to refine further.'
// 			}
// 		};
// 	}

// 	function getCategories() {
// 		return [{
// 			displayName: 'category 1',
// 			id: '1'
// 		}, {
// 			displayName: 'category 2',
// 			id: '2'
// 		}];
// 	}

// 	beforeEach(module(
// 		'plm360',
// 		'plm360.typeahead',
// 		'partials/multiselectWidget.html',
// 		'components/typeahead/typeaheadWidget.html'
// 	));

// 	beforeEach(function () {
// 		mockLocalizationService = sinon.stub({
// 			init: function () {}
// 		});

// 		module(function ($provide) {
// 			$provide.value('LocalizationService', mockLocalizationService);
// 		});
// 	});

// 	describe('test multi select with categories', function () {
// 		beforeEach(inject(function ($q, _$compile_, $rootScope) {
// 			scope = $rootScope.$new();
// 			$compile = _$compile_;

// 			$rootScope.bundle = getBundle();
// 			scope.categories = getCategories();

// 			var listSize = 8;
// 			scope.multiSelectData = [];
// 			for (var i = 0; i < listSize; i++) {
// 				scope.multiSelectData.push({
// 					displayName: 'display name ' + (i + 1),
// 					id: i + 1,
// 					selected: false,
// 					category: i % 2 === 0 ? '1' : '2'
// 				});
// 			}

// 			locationInitDeferredObj = $q.defer();
// 			mockLocalizationService.init.returns(locationInitDeferredObj.promise);
// 			locationInitDeferredObj.resolve();

// 			// create and compile directive
// 			el = angular.element('<multiselect-widget data="multiSelectData" categories="categories" max-displayed="5" type="checkbox" wrapper-display="update" ><multiselect-widget />');
// 			$compile(el)(scope);
// 			scope.$apply();
// 		}));

// 		it('should display categories', function () {
// 			expect(el.find('h4')).to.have.length(2);
// 		});
// 	});

// 	describe('test single select without categories', function () {
// 		beforeEach(inject(function ($q, _$compile_, $rootScope) {
// 			scope = $rootScope.$new();
// 			$compile = _$compile_;

// 			$rootScope.bundle = getBundle();

// 			var listSize = 8;
// 			scope.multiSelectData = [];
// 			for (var i = 0; i < listSize; i++) {
// 				scope.multiSelectData.push({
// 					displayName: 'display name ' + (i + 1),
// 					id: i + 1,
// 					selected: false
// 				});
// 			}
// 			scope.update = null;

// 			locationInitDeferredObj = $q.defer();
// 			mockLocalizationService.init.returns(locationInitDeferredObj.promise);
// 			locationInitDeferredObj.resolve();

// 			// create and compile directive
// 			el = angular.element('<multiselect-widget data="multiSelectData" max-displayed="5" type="checkbox" wrapper-display="update" ><multiselect-widget />');
// 			$compile(el)(scope);
// 			scope.$apply();
// 		}));

// 		it('should display list until max-display limit with warning if list size is greater than configured max limit', function () {
// 			// In order to ensure that the widget gets the localized literals we need to test the widget when localizationService init promise
// 			// is resolved.
// 			locationInitDeferredObj.promise.then(function () {
// 				expect(el.find('label')).to.have.length(5);

// 				expect($(el).find('#multiselect-warning').eq(0).hasClass('ng-hide')).to.be.false;
// 				expect($(el).find('#multiselect-warning').eq(0).text()).to.have.string('more results. Continue typing to refine further.');

// 				var ngModelController = el.find('input').eq(0).controller('ngModel');
// 				ngModelController.$setViewValue('test');
// 				scope.$digest();

// 				expect(el.find('label')).to.have.length(0);
// 				expect($(el).find('#multiselect-warning').eq(0).text()).to.have.string('No matches');

// 			});
// 		});

// 		it('should display emply list with a warning if type-ahead text does not match any list item', function () {
// 			// In order to ensure that the widget gets the localized literals we need to test the widget when localizationService init promise
// 			// is resolved.
// 			locationInitDeferredObj.promise.then(function () {
// 				var ngModelController = el.find('input').eq(0).controller('ngModel');
// 				ngModelController.$setViewValue('test');
// 				scope.$digest();

// 				expect(el.find('label')).to.have.length(0);
// 				expect($(el).find('#multiselect-warning').eq(0).text()).to.have.string('No matches');

// 			});
// 		});

// 		it('should select items and reorganize the list when done button is clicked', function () {
// 			// Note, since we are using jqLite (which is a subset of jQuery), we can't use advance selectors.
// 			var secondItem = el.find('input').eq(2);
// 			var fourthItem = el.find('input').eq(4);

// 			var ngModelController = secondItem.controller('ngModel');
// 			ngModelController.$setViewValue(true);

// 			ngModelController = fourthItem.controller('ngModel');
// 			ngModelController.$setViewValue(true);

// 			expect(scope.multiSelectData[1].selected).to.be.false;
// 			expect(scope.multiSelectData[3].selected).to.be.false;

// 			expect(secondItem.parent().text()).to.have.string('display name 2');
// 			expect(fourthItem.parent().text()).to.have.string('display name 4');

// 			el.find('button').eq(0).triggerHandler('click');

// 			expect(scope.multiSelectData[1].selected).to.be.true;
// 			expect(scope.multiSelectData[3].selected).to.be.true;

// 			secondItem = el.find('input').eq(2);
// 			fourthItem = el.find('input').eq(4);

// 			expect(secondItem.parent().text()).to.not.have.string('display name 2');
// 			expect(fourthItem.parent().text()).to.not.have.string('display name 4');

// 			locationInitDeferredObj.promise.then(function () {
// 				expect($(el).find('#clearAllSelected').eq(0).text()).to.have.string('Clear selected items');
// 			});
// 		});
// 	});
// });
