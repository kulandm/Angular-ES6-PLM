// 'use strict';

// describe('StickyElementDirective',function(){
// 	var el, scope, $compile, $httpBackend, mockLocalizationData;

// 	beforeEach(module('plm360'));

// 	beforeEach(function () {
// 		mockLocalizationData = {};
// 	});

// 	beforeEach(inject(function (_$compile_, $rootScope, _$httpBackend_) {
// 		scope = $rootScope;
// 		$compile = _$compile_;
// 		$httpBackend = _$httpBackend_;
			
// 		$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

// 		el = angular.element('<div sticky-element="120"></div>');
// 		$compile(el)(scope);
// 		scope.$apply();
// 	}));

// 	it('should add stick element at the top',function () {
// 		expect(el.hasClass('sticky')).to.equal(true);
// 		expect(el.css('top')).to.equal('120px');
// 	});

// 	it('should move the stick element to the bottom',function () {
// 	 	el.attr('sticky-element', "-40");
// 		// compile to ensure to reflect stick-element attribute changes.
// 		$compile(el)(scope);
		
// 		expect(el.hasClass('sticky')).to.equal(true);
// 		expect(el.css('bottom')).to.equal('40px');
// 	 });
// });