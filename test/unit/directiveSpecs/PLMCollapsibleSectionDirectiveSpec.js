// 'use strict';

// describe('plmCollapsible', function () {
// 	var el, scope, httpBackend, mockLocalizationData;

// 	beforeEach( module('plm360', 'plm360.collapsibleSection', 'components/collapsibleSection/plmCollapsibleSection.html', 'partials/textTruncation.html'));

// 	beforeEach(function () {
// 		mockLocalizationData = {};
// 	});

// 	beforeEach(inject( function ($compile, $rootScope, $httpBackend) {
// 		scope = $rootScope;
// 		httpBackend = $httpBackend;

// 		httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

// 		// create and compile directive
// 		el = angular.element('<plm-collapsible collapsed="true" header-title="test panel"><div>collapse panel.</div></plm-collapsible>');
// 		$compile(el)(scope);
// 		scope.$apply();
// 	}));

// 	it('should create collapsible panel in collapsed state.', function () {
// 		expect(el.find('h4').eq(0).html()).to.contain('test panel');
// 		expect(el.find('span').hasClass('icon-bottom')).to.be.true;
// 	});

// 	it('should create collapsible panel in expanded state.', inject(function ($compile) {
// 		el = angular.element('<plm-collapsible collapsed="false" header-title="test panel 2"><div>collapse panel.</div></plm-collapsible>');
// 		$compile(el)(scope);
// 		scope.$apply();

// 		expect(el.find('h4').eq(0).html()).to.contain('test panel 2');
// 		expect(el.find('span').hasClass('icon-bottom')).to.be.false;
// 	}));

// 	it('displays the action icons if any are specified', inject(function ($compile) {
// 		scope.actionIcons = {
// 			refresh: 'icon-Sync'
// 		};

// 		scope.actionHandler = function () {};

// 		el = angular.element('<plm-collapsible collapsed="false" header-title="test panel 2" action-icons="actionIcons" action-handler="actionHandler"><div>collapse panel.</div></plm-collapsible>');
// 		$compile(el)(scope);
// 		scope.$apply();
		
// 		expect(el.find('li').find('span').hasClass('icon-Sync')).to.be.true;
// 	}));

// 	it('invokes the method associated with the action', inject(function ($compile) {
// 		scope.actionIcons = {
// 			refresh: 'icon-Sync'
// 		};

// 		scope.actionHandler = sinon.spy();

// 		el = angular.element('<plm-collapsible collapsed="false" header-title="test panel 2" action-icons="actionIcons" action-handler="actionHandler"><div>collapse panel.</div></plm-collapsible>');
// 		$compile(el)(scope);
// 		scope.$apply();

// 		el.find('li').find('span').eq(0).triggerHandler('click');
// 		expect(scope.actionHandler.called).to.be.true;
// 	}));
// });
