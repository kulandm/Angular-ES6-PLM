'use strict';

describe('httpInterceptor', function () {
	var mockAuthenticationService, mockGlobalSettings, mockTokenService, q, timeout, d, rootScope, _, mockADSKHttpInterceptor, provide;

	beforeEach(module('plm360'));
	beforeEach(module('plm.httpInterceptor'));
	beforeEach(module('plm360.mockObjects'));
	beforeEach(module('plm360.mockData'));

	beforeEach(function () {

		module(function ($provide) {
			provide = $provide;
		});

		inject(function ($q, $timeout, $rootScope, _, MockAuthenticationService, MockTokenService, MockADSKHttpInterceptor, MockGlobalSettings) {
			// get angular dependencies
			q = $q;
			timeout = $timeout;
			_ = _;
			rootScope = $rootScope;

			// get mock objects dependencies
			mockAuthenticationService = new MockAuthenticationService();
			mockTokenService = new MockTokenService();
			mockADSKHttpInterceptor = new MockADSKHttpInterceptor();

			// get mock data dependencies
			mockGlobalSettings = MockGlobalSettings;

			// now use the mock objects
			provide.value('TokenService',mockTokenService);
			provide.value('AuthenticationService',mockAuthenticationService);
			provide.value('ADSKHttpInterceptor', mockADSKHttpInterceptor);
		});
	});

	describe('request',function () {
		it('should delete the originalElement from the config', inject(function (httpInterceptor) {
			var conf = {
				data: {
					originalElement: 'element'
				},
				url: ''
			};
			httpInterceptor.request(conf);
			expect(conf.data.originalElement).to.equal(undefined);
		}));
	});

	describe('requestError',function () {
		it('should reject with rejection error', inject(function (httpInterceptor) {
			var rejection = {
				config: {
					url: ''
				}
			};
			httpInterceptor.requestError(rejection).then(function (cb, err, progress) {
				expect(err).to.equal({});
			});
		}));
	});

	describe('response',function () {
		it('should return response', inject(function (httpInterceptor) {
			var response = {
				config: {
					url: ''
				}
			};
			var ret = httpInterceptor.response(response);
			expect(ret).to.equal(response);
		}));
	});

	describe('responseError',function () {
		it('should unset token, remove item from sessionStorage, ask for relogin, and reject with rejection error if status is 401', inject(function (httpInterceptor) {
			var rejection = {
				status: 401,
				config: {
					url: ''
				}
			};
			var storageItemValue = 'storageItem';
			sessionStorage.setItem('FHEWOI)$_%T$#',storageItemValue);
			expect(mockAuthenticationService.key).to.equal(1);
			expect(mockTokenService.tok).to.equal(1);

			httpInterceptor.responseError(rejection).then(function (cb, err, progress) {
				expect(sessionStorage.getItem('FHEWOI)$_%T$#')).to.equal(undefined);
				expect(mockAuthenticationService.key).to.equal(2);
			expect(mockTokenService.tok).to.equal(2);
			});
		}));

		it('should unset token, remove item from sessionStorage, ask for relogin, and reject with rejection error if status is 500', inject(function (httpInterceptor) {
			var rejection = {
				status: 500,
				config: {
					url: ''
				}
			};
			var storageItemValue = 'storageItem';
			sessionStorage.setItem('FHEWOI)$_%T$#',storageItemValue);
			expect(mockAuthenticationService.key).to.equal(1);
			expect(mockTokenService.tok).to.equal(1);

			httpInterceptor.responseError(rejection).then(function (cb, err, progress) {
				expect(sessionStorage.getItem('FHEWOI)$_%T$#')).to.equal(undefined);
				expect(mockAuthenticationService.key).to.equal(2);
			expect(mockTokenService.tok).to.equal(2);
			});
		}));

		it('should unset token, remove item from sessionStorage, ask for relogin, and reject with rejection error if status is 503', inject(function (httpInterceptor) {
			var rejection = {
				status: 503,
				config: {
					url: ''
				}
			};
			var storageItemValue = 'storageItem';
			sessionStorage.setItem('FHEWOI)$_%T$#',storageItemValue);
			expect(mockAuthenticationService.key).to.equal(1);
			expect(mockTokenService.tok).to.equal(1);

			httpInterceptor.responseError(rejection).then(function (cb, err, progress) {
				expect(sessionStorage.getItem('FHEWOI)$_%T$#')).to.equal(undefined);
				expect(mockAuthenticationService.key).to.equal(2);
			expect(mockTokenService.tok).to.equal(2);
			});
		}));
	});
});
