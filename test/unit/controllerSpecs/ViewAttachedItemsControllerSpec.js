'use strict';

describe('ViewAttachedItemsController', () => {

	let $rootScope;
	let $scope;
	let ctrl;
	let flyoutClosed = null;
	let mockAttachmentsObj;
	let FileOverviewService;
	let WipApiService;
	let App;
	let RESTWrapperService;
	let $state;
	let UrnParser;

	beforeEach(module(
		'plm360',
		'com/autodesk/fileOverview.js',
		'com/autodesk/WipApiService.js'
	));

	beforeEach(() => {
		inject(($controller, _$rootScope_, $q, _$state_, _App_, _FileOverviewService_, _WipApiService_, _RESTWrapperService_, _UrnParser_) => {
			$rootScope = _$rootScope_;
			$scope = $rootScope.$new();
			FileOverviewService = _FileOverviewService_;
			WipApiService = _WipApiService_;
			App = _App_;
			RESTWrapperService = _RESTWrapperService_;
			UrnParser = _UrnParser_;
			$state = _$state_;

			mockAttachmentsObj = {
				value: {
					count: 1,
					itemId: '2323',
					workspaceId: '9',
					itemUrn: 'someUrn'
				}
			};

			sinon.spy(FileOverviewService, 'setHost');
			sinon.spy(WipApiService, 'setHost');
			sinon.spy($state, 'go');
			sinon.stub(RESTWrapperService, 'get');
			sinon.stub(UrnParser, 'encode');

			UrnParser.encode.returns('someEncodedUrn');

			RESTWrapperService.get.returns($q.resolve({
				items: [{
					links: {
						link: {
							href: 'http://a360.url'
						}
					}
				}],
				value: 'https://some.api.autodesk.com/wipdata-serv-qa'
			}));

			ctrl = $controller('ViewAttachedItemsController', {
				$rootScope: $rootScope,
				$scope: $scope,
				attachmentsObj: mockAttachmentsObj,
				$flyoutInstance: {
					opened: $q.when(''),
					close: function () {
						flyoutClosed = true;
					},
					cancel: function () {
						flyoutClosed = true;
					}
				},
				WipApiService: WipApiService,
				FileOverviewService: FileOverviewService,
				RESTWrapperService: RESTWrapperService,
				App: App,
				UrnParser: UrnParser,
				$state: $state
			});
		});
	});

	it('sets the A360 url in the FileOverviewService', inject($rootScope => {
		$rootScope.$apply();
		expect(FileOverviewService.setHost).to.have.been.calledWith('http://a360.url');
	}));

	it('sets the WipApiService url in the FileOverviewService', inject($rootScope => {
		$rootScope.$apply();
		expect(WipApiService.setHost).to.have.been.calledWith('https://some.api.autodesk.com/wipdata-serv-qa');
	}));

	it('cancelSelection should close flyout', () => {
		flyoutClosed = false;
		ctrl.cancelSelection();
		expect(flyoutClosed).to.be.true;
	});

	it('goToAttachment should call $state.go with attachments', () => {
		ctrl.goToAttachment();
		expect($state.go).to.have.been.calledWith('attachments');
	});
});