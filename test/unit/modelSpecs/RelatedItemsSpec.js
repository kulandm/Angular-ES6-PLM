/* global inject,RelatedItems,sinon */
'use strict';

describe('RelatedItems', function () {
	var relatedItems;
	var q;
	var provide;
	var timeout;
	var data = {
		id: 42
	};
	var restWrapperService;

	beforeEach(module('plm360', 'plm360.models', 'plm360.mockObjects'));

	beforeEach(function () {

		module(function ($provide) {
			provide = $provide;
		});

		inject(function (_, $q, RESTWrapperService, $timeout, $httpBackend) {
			q = $q;
			timeout = $timeout;
			restWrapperService = RESTWrapperService;

			$httpBackend.expect('GET', '/api/rest/v1/token').respond(200, '');
			$httpBackend.when('GET', 'templates/appHeader.html').respond(200, '');
			$httpBackend.when('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
			$httpBackend.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});
		});

		relatedItems = new RelatedItems();
		relatedItems.json = data;
	});

	describe('getFullList', function () {
		it('returns whatever the json property contains', function () {
			expect(relatedItems.getFullList()).to.deep.equal(data);
		});
	});

	describe('save items', function () {
		it('saves existing items', function () {
			sinon.spy(restWrapperService, 'put');

			relatedItems.saveExistingItem({
				__self__: '/api/v3/42',
				item: {
					title: 'Some Title'
				},
				direction: 'something',
				descriptionField: {
					value: 'A description'
				}
			});

			expect(restWrapperService.put.callCount).to.equal(1);
		});

		it('saves newly added items', function () {
			sinon.spy(restWrapperService, 'post');

			relatedItems.saveAddedItem({
				__self__: '/api/v3/42',
				item: {
					title: 'Some Title'
				},
				directionField: {
					value: {
						selected: 'bi'
					}
				},
				descriptionField: {
					value: ''
				},
				associateItem: {
					workspaceId: 42,
					itemId: 42
				}
			});

			expect(restWrapperService.post.callCount).to.equal(1);
		});

		it('saves all related items successfully', function () {
			relatedItems.save([]).then(function (results) {
				expect(results.length).to.equal(0);
			});

			relatedItems.save([{
				__self__: 'test url',
				directive: 'test',
				descriptionField: {
					value: 'test value'
				},
				item: {
					title: 'test title'
				}
			}]).then(function (results) {
				expect(results.length).to.equal(1);
				expect(results[0].success).to.be.true;
			});
		});
	});
});
