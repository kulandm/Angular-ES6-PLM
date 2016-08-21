'use strict';

describe('Picklist model', function () {

	var picklist, RESTWrapperService, provide;
	var $q, $timeout;

	beforeEach(module('plm360.models', 'plm360.mockObjects', function ($provide) {
		provide = $provide;
	}));

	beforeEach(inject(function (MockRESTWrapperService, _$q_, _$timeout_) {
		RESTWrapperService = MockRESTWrapperService();
		provide.value('RESTWrapperService', RESTWrapperService);

		Picklist.prototype.RESTWrapperService = RESTWrapperService;

		picklist = new Picklist();
		$q = _$q_;
		$timeout = _$timeout_;
	}));

	describe('[fetchOptions]', function () {

		it('should have fetchOptions as a prototype method', function () {
			expect(picklist.fetchOptions).to.be.defined;
		});

		it('should send the request to the workspace options endpoint', function () {

			var link = 'api/v3/workspaces/8/views/1/fields/LEVEL_3/options';
			var requestParams = {
				CLASS_DESCRIPTION: '121 - POWER TRANSMISSION - GEAR -',
				CLASS_NUMBER: '121',
				DIM_TYPE_1: 'Description',
				LEVEL_1: 'POWER TRANSMISSION',
				LEVEL_2: 'GEAR'
			};

			var deferred = $q.defer();
			RESTWrapperService.get.withArgs(link, null, requestParams, {skipCache: true})
				.returns(deferred.promise);
			deferred.resolve({});

			picklist.fetchOptions(link, requestParams);

			expect(RESTWrapperService.get).to.have.been.calledWith(link, null, requestParams, {skipCache: true});
		});

		it('should send the request to the options endpoint', function () {

			var link = 'api/v3/workspaces/8/items/2839/views/1/fields/LEVEL_3/options';
			var requestParams = {
				CLASS_DESCRIPTION: '121 - POWER TRANSMISSION - GEAR -',
				CLASS_NUMBER: '121',
				DIM_TYPE_1: 'Description',
				LEVEL_1: 'POWER TRANSMISSION',
				LEVEL_2: 'GEAR'
			};

			var deferred = $q.defer();
			RESTWrapperService.get.withArgs(link, null, requestParams, {skipCache: true})
				.returns(deferred.promise);
			deferred.resolve({});

			picklist.fetchOptions(link, requestParams);

			expect(RESTWrapperService.get).to.have.been.calledWith(link, null, requestParams, {skipCache: true});
		});
	});

	describe('[fetchSelection]', function () {

		it('should have fetchSelection as a prototype method', function () {
			expect(picklist.fetchSelection).to.be.defined;
		});

		it('should send the request to the selection endpoint', function () {

			var link = 'api/v3/workspaces/8/items/2839/views/1/fields/LEVEL_1/selection';
			var requestParams = {LEVEL_1: 'BOM'};

			var deferred = $q.defer();
			RESTWrapperService.get.withArgs(link, null, requestParams, {skipCache: true})
				.returns(deferred.promise);
			deferred.resolve({});

			picklist.fetchOptions(link, requestParams);

			expect(RESTWrapperService.get).to.have.been.calledWith(link, null, requestParams, {skipCache: true});
		});
	});

});
