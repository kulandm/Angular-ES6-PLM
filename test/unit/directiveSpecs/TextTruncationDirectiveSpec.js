'use strict';

describe('TextTruncationDirective', function () {
	var el, $q, $timeout, $rootScope, $httpBackend, mockLocalizationData;
	var str = 'Test Content';

	beforeEach(module('plm360','plmTemplates'));

	beforeEach(function () {
		mockLocalizationData = {};
	});

	beforeEach(inject(function ($compile, _$rootScope_, _$q_, _$timeout_, _$httpBackend_) {
		$q = _$q_;
		$timeout = _$timeout_;
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;

		$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

		var scope = $rootScope.$new(true);  // Setup an isolated scope.

		// create and compile directive
		el = angular.element('<div text-truncation>' + str + '</div>');
		$compile(el)(scope);
		scope.$digest();
	}));

	it('should add class to element', function () {
		expect($(el).hasClass('text-truncation')).to.be.true;
	});

	it('should transclude content inside both truncated and untruncated container', function () {
		expect($(el).find('.truncated').html()).to.equal('<span class="ng-scope">' + str + '</span>');
		expect($(el).find('.untruncated').html()).to.equal('<span class="ng-scope">' + str + '</span>');
	});

	it('should update pendingDisplayFullText scope variable', function () {
		// NOTE: to fully test this, we need a view test that causes {@link scope#controlFullTextDisplay} method to be called when
		// user performs an action.
		var directiveScope = el.isolateScope();
		directiveScope.$apply();

		directiveScope.controlFullTextDisplay(true, 250);
		$timeout.flush();

		expect(directiveScope.pendingDisplayFullText).to.be.true;
	});
});
