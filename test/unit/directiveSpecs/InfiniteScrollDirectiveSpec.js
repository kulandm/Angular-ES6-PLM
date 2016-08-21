'use strict';

/**
 * This spec tests {@link InfiniteScrollDirective}. Note: There is a limitation to correctly test actual scrolling, therefore
 * we will only test the update to the parent scope when scroll event is triggered.
 */
describe('InfiniteScrollDirective', function () {
	var el, scope, scrollUpdate = false, httpBackend, mockLocalizationData;

	beforeEach(module('plm360','plmTemplates'));

	beforeEach(function () {
		mockLocalizationData = {};
	});

	describe('Test with context', function () {
		var _window;

		beforeEach(inject(function ($compile, $rootScope, $window, $httpBackend) {
			scope = $rootScope;
			httpBackend = $httpBackend;

			httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

			scope.doScroll = function () {
				scrollUpdate = true;
			};
			scope.context = angular.element($window);

			_window = angular.element($window);

			el = angular.element(
				'<div infinite-scroll="" update="doScroll" context="context" id="listContainer" style="width: 100px; height: 100px;">' +
					'<div id="list" style="height: 200px;">' +
					'</div>' +
				'</div>'
			);
			$compile(el)(scope);
			scope.$apply();
		}));

		it('trigger update when window vertical scroll is equal to or exceeds window scroll height', function () {
			_window[0].scrollBy(100, 100);
			_window.triggerHandler('scroll');
			expect(scrollUpdate).to.be.true;
		});
	});

	describe('Test without context', function () {
		beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
			scope = $rootScope;
			httpBackend = $httpBackend;

			httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

			scope.doScroll = function () {
				scrollUpdate = true;
			};

			el = angular.element(
				'<div infinite-scroll="" update="doScroll" id="listContainer" style="width: 100px; height: 100px;">' +
					'<div id="list" style="height: 200px;">' +
					'</div>' +
				'</div>'
			);
			$compile(el)(scope);
			scope.$apply();
		}));

		it('trigger update when container element vertical scroll is equal to or exceeds contained element scroll height', function () {
			el[0].scrollTop = 100;
			el.triggerHandler('scroll');
			expect(scrollUpdate).to.be.true;
		});
	});
});
