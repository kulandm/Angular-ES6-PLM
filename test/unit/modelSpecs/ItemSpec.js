'use strict';

describe('Item', function () {
	var app;
	var underscore, q, provide, mockRESTWrapperService, timeout;
	var dateFieldData;
	var data = {
		id: 1,
		itemDescriptor: 'ddd',
		version: '[REV:A]',
		name: 'name',
		originalElement: {
			sections: [{
				fields: [{
					type: 'FIELD',
					id: 'ID',
					value: 'val'
				}, {
					type: 'MATRIX',
					layout: [{
						columns: [{
							fields: [{
								id: 'ID',
								value: 'val'
							}]
						}]
					}]
				}, {
					type: 'NONE'
				}]
			}]
		}
	};
	var wsObj = {
		getId: function () {
			return 1;
		},
		getFullList: function () {
			return {
				itemSections: [{
					id: 1,
					name: '23423',
					description: '23432',
					collapsable: true,
					layout: {
						elements: [{
							type: 'FIELD',
							id: 'ID',
							value: 'val'
						}, {
							type: 'MATRIX',
							id: 'refid',
							layout: [{
								columns: [{
									fields: [{
										id: 'ID2',
										value: 'val2'
									}]
								}]
							}]
						}],
						matrices: [{
							ref: 'refid',
							fieldDefinitionIds: ['ID2'],
							rowDisplayNames: ['row name'],
							columnDisplayNames: ['col name']
						}]
					}
				}]
			};
		},
		getSectionsMeta: function () {
			return q.when('');
		},
		getSectionsMetadata: function () {
			return [{
					link: '',
					definition: {
						name: 'test section',
						description: 'test description',
						collapsable: true,
						fields: [{
							type: 'FIELD',
							fieldType: 'FIELD',
							link: ''
						}]
					}
			}];
		}
	};

	beforeEach(module('plm360','plm360.models', 'plm360.mockObjects', 'plm360.mockData'));

	beforeEach(function () {
		app = new Item();
		app.json = data;
		app.transitions = {
			link: 'api/rest/v1/workspaces/[workspaceId]/items/' + app.json.id + '/workflows/transitions'
		};

		app.revisions = {
			link: 'api/v3/workspaces/[workspaceId]/items/' + app.json.id + '/versions'
		};

		app.changelog = {
			link: 'api/v2/workspaces/[workspaceId]/items/' + app.json.id + '/logs'
		};

		app.gridmeta = {
			link: 'api/v3/workspaces/[workspaceId]/items/' + app.json.id + '/views/13/fields'
		};

		app.grid = {
			link: 'api/v3/workspaces/[workspaceId]/items/' + app.json.id + '/views/13/view-data'
		};

		app.affectedItems = {
			link: 'api/v3/workspaces/[workspaceId]/items/' + app.json.id + '/affected-items'
		};

		app.linkableItems = {
			link: 'api/v3/workspaces/[workspaceId]/items/' + app.json.id + '/linkable-items'
		};
		module(function ($provide) {
			provide = $provide;
		});
		inject(function (_, $q, MockRESTWrapperService, $timeout, $httpBackend, MockDateFieldData) {
			underscore = _;
			q = $q;
			mockRESTWrapperService = new MockRESTWrapperService();
			dateFieldData = MockDateFieldData;
			provide.value('RESTWrapperService', mockRESTWrapperService);
			timeout = $timeout;

			// setup mock http backend
			$httpBackend.expect('GET', 'templates/appHeader.html').respond(200, '');
			$httpBackend.when('GET', 'components/mainDashboard/mainDashboard.html').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});
			$httpBackend.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond('');

		});
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});

	describe('getItemDescriptor', function () {
		it('should return the item descriptor', function () {
			expect(app.getItemDescriptor()).to.equal(data.itemDescriptor);
		});
	});

	describe('getItemVersion', function () {
		it('should return the item version', function () {
			expect(app.getItemVersion()).to.equal(data.version);
		});
	});

	describe('setWorkspaceObj', function () {
		it('should set workspace obj', function () {
			app.setWorkspaceObj({});
			expect(app.workspaceObj).to.deep.equal({});
		});
	});

	describe('getWorkspaceObj', function () {
		it('should return a copy of the workspace object', function () {
			app.setWorkspaceObj({
				test: 1
			});
			expect(app.getWorkspaceObj()).to.deep.equal({
				test: 1
			});
		});
	});

	describe('getTransitionsLink', function () {
		it('should return transitions link', function () {
			app.setWorkspaceObj(wsObj);
			expect(app.getTransitionsLink()).to.equal(app.transitions.link.replace('[workspaceId]', 1));
		});
	});

	describe('getChangeLogLink', function () {
		it('should return changelog link', function () {
			app.setWorkspaceObj(wsObj);
			expect(app.getChangeLogLink()).to.equal(app.changelog.link.replace('[workspaceId]', 1));
		});
	});

	describe('getGridLink', function () {
		it('should return grid link', function () {
			app.setWorkspaceObj(wsObj);
			expect(app.getGridLink()).to.equal(app.grid.link.replace('[workspaceId]', 1));
		});
	});

	describe('getAffectedItemsLink', function () {
		it('returns affected items link', function () {
			app.setWorkspaceObj(wsObj);
			expect(app.getAffectedItemsLink()).to.equal(app.affectedItems.link.replace('[workspaceId]', 1));
		});
	});

	describe('getGridMetaLink', function () {
		it('should return gridmeta link', function () {
			app.setWorkspaceObj(wsObj);
			expect(app.getGridMetaLink()).to.equal(app.gridmeta.link.replace('[workspaceId]', 1));
		});
	});

	describe('getRevisionsLink', function () {
		it('should return revisions link', function () {
			app.setWorkspaceObj(wsObj);
			expect(app.getRevisionsLink()).to.equal(app.revisions.link.replace('[workspaceId]', 1));
		});
	});

	describe('getItemDetailsOptionsData', function () {
		it('returns whatever RESTWrapperService returns for getting data of current selected item', function () {
			var called = false;
			mockRESTWrapperService.get.returns(true);
			app.setWorkspaceObj(wsObj);
			expect(app.getItemDetailsOptionsData()).to.have.property('$$state');
		});
	});

	describe('setBookmark', function () {
		it('should call put if flag set to true', function () {
			var called = '';
			mockRESTWrapperService.put.returns('put');
			expect(app.setBookmark(true)).to.have.property('$$state');
		});
		it('should call delete if flag set to false', function () {
			var called = '';
			mockRESTWrapperService.delete.returns('delete');
			expect(app.setBookmark(false)).to.have.property('$$state');
		});
	});

	describe('setArchive', function () {
		it('should call with delete equal true if flag set to true', function () {
			mockRESTWrapperService.patch.returns({});
			app.setWorkspaceObj(wsObj);
			expect(app.setArchive(true)).to.have.property('$$state');
		});
		it('should call delete equal false if flag set to false', function () {
			mockRESTWrapperService.patch.returns({});
			app.setWorkspaceObj(wsObj);
			expect(app.setArchive(false)).to.have.property('$$state');
		});
	});

	describe('performTransition', function () {
		it('should call rest put with empty header with user impersonation', function () {
			mockRESTWrapperService.put.returns({});
			app.setWorkspaceObj(wsObj);
			expect(app.performTransition(1, '', {link: 'api/v3/user/test1'})).to.have.property('$$state');
		});
		it('should call rest put with header without user impersonation', function () {
			mockRESTWrapperService.put.returns({});
			app.setWorkspaceObj(wsObj);
			expect(app.performTransition(1, '')).to.have.property('$$state');
		});
	});

	describe('saveNew', function () {
		it('should call rest post with formatted data', function () {
			mockRESTWrapperService.post.returns({});
			app.setWorkspaceObj(wsObj);
			var res = app.saveNew([{
				fields: [{
					__self__: 'link 1',
					value: 'value'
				}, {
					__self__: 'link 2',
					value: 'value 2'
				}]
			}]);
			expect(res).to.have.property('$$state');
		});
	});

	describe('save', function () {
		it('should call rest put with formatted data', function () {
			mockRESTWrapperService.put.returns(q.when({
				json: {
					restangularEtag: ''
				}
			}));
			app.setWorkspaceObj(wsObj);
			var res = app.save([{
				fields: [{
					type: 'FIELD',
					id: 'ID',
					value: 'val',
					metadata: {}
				}]
			}]);
			expect(res).to.have.property('$$state');
		});
	});

	describe('prepareFieldForEndpoint method', () => {

		it('should build a proper value for Date type fields', () => {
			var field = angular.copy(dateFieldData.data);
			field.value = new Date(2015, 10, 19); // 10: November
			expect(app.prepareFieldForEndpoint(field)).to.equal('2015-11-19');
		});
	});
});
