'use strict';

describe('FusionHeaderController', () => {
	let headerCtrl;
	let mockScope, mockTemplateCache, mockFlyoutService, mockLocation, mockHTTP, mockApp, $q, $scope;

	let HeaderCtrlClass = System.get('com/autodesk/components/fusionHeader/fusionHeader.controller.js').default;

	beforeEach(inject(function ($http, _$q_, $rootScope) {
		mockHTTP = $http;
		$q = _$q_;
		$scope = $rootScope;
	}));

	beforeEach(() => {
		mockScope = {};
		mockApp = sinon.stub().returns({
			hubs: {
				link: 'api/v3/hubs?edition=business'
			}
		});
		mockTemplateCache = {
			put: sinon.stub()
		};
		mockHTTP = {
			get: sinon.stub().returns($q.when({
				items: [{name: 'Dummy Hub Name'}]
			}))
		};
		mockFlyoutService = {
			open: sinon.stub()
		};
		mockLocation = {
			search: sinon.stub().returns({})
		};

		headerCtrl = new HeaderCtrlClass(mockScope, mockTemplateCache, mockLocation, mockFlyoutService, mockHTTP, mockApp);
	});

	describe('[INIT]', () => {
		it('Should put a templates in cache', () => {
			expect(mockTemplateCache.put).to.have.been.called;
		});

		it('checks if the hub name is proper', () => {
			$scope.$digest();
			expect(headerCtrl.hubName).to.equal('Dummy Hub Name');
		});
	});

	describe('[METHOD] addSvgIconsToCache', () => {
		beforeEach(() => {
			mockTemplateCache.put.reset();
		});

		it('Should put a template named fusion-header-help-icon-template', () => {
			expect(mockTemplateCache.put).to.not.have.been.called;
			headerCtrl.addSvgIconsToCache();
			expect(mockTemplateCache.put).to.have.callCount(5);
			expect(mockTemplateCache.put).to.have.been.calledWith('fusion-header-help-icon-template', sinon.match.any);
		});

		it('Should put a template named fusion-header-community-icon-template', () => {
			expect(mockTemplateCache.put).to.not.have.been.called;
			headerCtrl.addSvgIconsToCache();
			expect(mockTemplateCache.put).to.have.callCount(5);
			expect(mockTemplateCache.put).to.have.been.calledWith('fusion-header-community-icon-template', sinon.match.any);
		});

		it('Should put a template named fusion-header-admin-email-icon-template', () => {
			expect(mockTemplateCache.put).to.not.have.been.called;
			headerCtrl.addSvgIconsToCache();
			expect(mockTemplateCache.put).to.have.callCount(5);
			expect(mockTemplateCache.put).to.have.been.calledWith('fusion-header-admin-email-icon-template', sinon.match.any);
		});

		it('Should put a template named fusion-header-vignettes-icon-template', () => {
			expect(mockTemplateCache.put).to.not.have.been.called;
			headerCtrl.addSvgIconsToCache();
			expect(mockTemplateCache.put).to.have.callCount(5);
			expect(mockTemplateCache.put).to.have.been.calledWith('fusion-header-vignettes-icon-template', sinon.match.any);
		});

		it('Should put a template named fusion-header-walkthrough-icon-template', () => {
			expect(mockTemplateCache.put).to.not.have.been.called;
			headerCtrl.addSvgIconsToCache();
			expect(mockTemplateCache.put).to.have.callCount(5);
			expect(mockTemplateCache.put).to.have.been.calledWith('fusion-header-walkthrough-icon-template', sinon.match.any);
		});
	});

	describe('[METHOD] openHelpFlyout', () => {
		it('Should call open flyout with the correct anchor', () => {
			let event = {
				currentTarget: 'someElement'
			};
			let angularElementStub = sinon.stub(angular, 'element');
			angularElementStub.withArgs(event.currentTarget).returns('someAngularElement');
			expect(mockFlyoutService.open).to.not.have.been.called;
			headerCtrl.openHelpFlyout(event);
			expect(mockFlyoutService.open).to.have.been.calledOnce;
			expect(mockFlyoutService.open.args[0][0].anchorEl).to.equal('someAngularElement');
			angularElementStub.restore();
		});
	});
});
