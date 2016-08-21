// 'use strict';

// describe('AdjustMaxHeightDirective', function () {
// 	beforeEach(module('plm360'));

// 	describe ('basic tests', function () {
// 		var scope, el, _window, $timeout;

// 		beforeEach(inject(function ($compile, $rootScope, $window, _$timeout_, $httpBackend) {
// 			scope = $rootScope.$new();
// 			$timeout = _$timeout_;

// 			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});

// 			_window = angular.element($window);

// 			el = angular.element('<div adjust-max-height="" trigger-max-height-adjustment="{{triggerOnDemand}}"></div>');
// 			$compile(el)(scope);
// 			scope.$apply();
// 		}));

// 		it('should call the notification method after max height recalculation.', function () {
// 			var adjustmentCalled = false;
// 			scope.onMaxHeightAdjustment = function () {
// 				adjustmentCalled = true;
// 			};

// 			scope.triggerOnDemand = true;
// 			scope.$digest();

// 			expect(adjustmentCalled).to.be.true;
// 		});

// 		it('should recalculate max height on window resize.', function () {
// 			var adjustmentCalled = false;
// 			scope.onMaxHeightAdjustment = function () {
// 				adjustmentCalled = true;
// 			};

// 			_window.triggerHandler('resize');
// 			scope.$digest();

// 			expect(adjustmentCalled).to.be.true;

// 			var documentHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
// 			expect(el[0].style.maxHeight).to.equal((documentHeight * 0.9) + 'px');
// 		});
// 	});

// 	describe ('configured properties tests', function () {
// 		var scope, parentEl, el, _window, $timeout;

// 		beforeEach(inject(function ($compile, $rootScope, $window, _$timeout_, $httpBackend) {
// 			scope = $rootScope.$new();
// 			$timeout = _$timeout_;

// 			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});

// 			_window = angular.element($window);
// 			parentEl = angular.element('<div style="width: 500px; height: 300px;"></div>');

// 			scope.percentage = 0.8;
// 			scope.heightContextEl = parentEl;

// 			el = angular.element('<div adjust-max-height="" trigger-max-height-adjustment="{{triggerOnDemand}}"></div>');
// 			parentEl.append(el);
// 			document.body.appendChild(parentEl[0]);
// 			$compile(el)(scope);
// 			scope.$apply();
// 		}));

// 		it('should recalculate max height on context element resize with given percentage.', function () {
// 			var adjustmentCalled = false;
// 			scope.percentage = .8;
// 			scope.onMaxHeightAdjustment = function () {
// 				adjustmentCalled = true;
// 			};

// 			parentEl.triggerHandler('resize');
// 			scope.$digest();

// 			expect(adjustmentCalled).to.be.true;

// 			var topPosition = el[0].getBoundingClientRect().top;

// 			expect(el[0].style.maxHeight).to.equal(240 - topPosition + 'px');
// 		});
// 	});
// });
