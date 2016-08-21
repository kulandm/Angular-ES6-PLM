'use strict';

describe('Workspace', function () {
	var app;
	var mockPicklistOptions;
	var mockPicklistMeta;
	var mockPicklistOptionsFiltered;
	var mockDerivedFieldsWithNullValue;
	var mockDerivedFieldsWithValue;
	var Workspace;
	var data = {
		id: 1,
		name: 'name',
		type: 'type/1'
	};
	var wsData = {
		id: 9,
		displayName: 'name',
		workspaceTypeId: 399 /* ,
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
			}]
		} */
	};
	var viewsObj = {
		getViewLink: function () {
			return '[workspaceId]/iiii';
		},
		setViewObj: function (obj) {}
	};
	var underscore, q, provide, timeout;

	beforeEach(module('plm360', 'plm360.models', 'plm360.mockData', 'plm360.mockObjects', ($provide) => {
		$provide.value('RESTWrapperService', {});
	}));

	beforeEach(function () {

		inject(function (_, $q, MockPicklistFieldData, MockDerivedFieldsByPivotData, MockRESTWrapperService, $timeout, $httpBackend, $injector) {
			underscore = _;
			q = $q;
			mockPicklistOptions = MockPicklistFieldData.data.options;

			// Massage the data a bit for returning filtered data
			mockPicklistOptionsFiltered = _.extend(MockPicklistFieldData.data.options);
			mockPicklistOptionsFiltered.totalCount = 1;

			mockPicklistMeta = _.extend(MockPicklistFieldData.meta);

			mockDerivedFieldsWithNullValue = MockDerivedFieldsByPivotData.dataWithoutPivotSelection;
			mockDerivedFieldsWithValue = MockDerivedFieldsByPivotData.data;

			timeout = $timeout;
			Workspace = $injector.get('Workspace');
			Workspace.prototype.RESTWrapperService = new MockRESTWrapperService();
			app = new Workspace();
			app.json = data;
			app.views = {
				link: 'api/rest/v1/workspaces/' + app.json.id + '/views.json'
			};
			app.item = {
				link: 'api/v2/workspaces/' + app.json.id + '/items/[dmsId]'
			};
			app.tabs = {
				link: 'api/v3/workspaces/' + app.json.id + '/tabs'
			};
			app.userPermissions = {
				link: 'api/v3/workspaces/' + app.json.id + '/users/[userId]/permissions'
			};
			app.relatedWorkspaces = {
				link: 'api/v3/workspaces/' + app.json.id + '/views/100/related-workspaces'
			};

			// setup mock http backend
			$httpBackend.expect('GET', 'templates/appHeader.html').respond(200, '');
			$httpBackend.when('GET', '/api/rest/v1/token').respond(200, '');
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

	describe('setWorkspace', function () {
		it('should set workspace', function () {
			app.setWorkspace(wsData);
			expect(app.workspace).to.deep.equal(wsData);
		});
	});

	describe('getWorkspace', function () {
		it('should return the workspace', function () {
			app.setWorkspace(wsData);
			expect(app.getWorkspace()).to.deep.equal(wsData);
		});
	});

	describe('setSection', function () {
		it('should set section', function () {
			app.setSection({});
			expect(app.section).to.deep.equal(app.section);
		});
	});

	describe('getSection', function () {
		it('should return the section', function () {
			expect(app.getSection()).to.deep.equal(app.section);
		});
	});

	describe('getDisplayName', function () {
		it('should return the display name', function () {
			app.setWorkspace(wsData);
			expect(app.getDisplayName()).to.equal(app.json.name);
		});
	});

	describe('getId', function () {
		it('should return the id', function () {
			app.setWorkspace(wsData);
			expect(app.getId()).to.equal(app.json.id);
		});
	});

	describe('getTypeId', function () {
		it('should return the type id', function () {
			app.setWorkspace(wsData);
			expect(app.getTypeId()).to.equal(app.json.type.substring(app.json.type.lastIndexOf('/') + 1));
		});
	});

	describe('getViewsLink', function () {
		it('should return link of views', function () {
			expect(app.getViewsLink()).to.equal(app.views.link);
		});
	});

	describe('getTabsLink', function () {
		it('should return link of tabs', function () {
			expect(app.getTabsLink()).to.equal(app.tabs.link);
		});
	});

	describe('getUserPermissionsLink', function () {
		it('should return link of user permissions', function () {
			expect(app.getUserPermissionsLink(1)).to.equal(app.userPermissions.link.replace('[userId]', 1));
		});
	});

	describe('getItemLink', function () {
		it('should return link of item', function () {
			expect(app.getItemLink(1)).to.equal(app.item.link.replace('[dmsId]', 1));
		});
	});

	describe('getItemsLink', function () {
		it('should return link of items', function () {
			expect(app.getItemsLink(viewsObj, 1)).to.equal('1/iiii');
		});
	});

	describe('setPicklistHook', function () {
		it('should add a picklist fetching hook to the field object', function () {
			// Mock field object based on mock metadata
			var field = {
				fieldMetadata: mockPicklistMeta
			};

			app.setPicklistHook(field).then(function (data) {});
			expect(field.fieldMetadata.picklistLoaderWithFiltering).to.be.a('function');
			expect(field.fieldMetadata.picklistPivotLoader).to.be.a('function');
		});
	});

	describe('getPicklistValuesWithFiltering', function () {
		it('should return list of items based on query', function () {
			var localMockPicklistOptionsFiltered = mockPicklistOptionsFiltered;
			localMockPicklistOptionsFiltered.items.pop();

			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/lookups/CUSTOM_LOOKUP_YES_NO', null, {limit: 25, filter: 'Yes'}, {skipCache: true}).returns(q.when(localMockPicklistOptionsFiltered));

			app.getPicklistValuesWithFiltering('/api/v3/lookups/CUSTOM_LOOKUP_YES_NO', 'Yes').then(function (data) {
				expect(data.items.length).to.equal(1);
				expect(data.totalCount).to.equal(1);
			});

			timeout.flush();
		});

		it('should return an empty list of items in case there are no matches', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/lookups/CUSTOM_LOOKUP_YES_NO', null, {limit: 25, filter: 'BLAH'}, {skipCache: true}).returns(q.when({}));

			app.getPicklistValuesWithFiltering('/api/v3/lookups/CUSTOM_LOOKUP_YES_NO', 'BLAH').then(function (data) {
				expect(data.items.length).to.equal(0);
				expect(data.totalCount).to.equal(0);
			});

			timeout.flush();
		});
	});

	describe('getPicklistPivotValues', function () {
		it('should return no content in case there are no derived fields for the pivot', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, {pivotItemId: 3579}, {skipCache: true}).returns(q.when({}));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', 3579).then(function (data) {
				expect(data).to.deep.equal({});
			});

			timeout.flush();
		});

		it('should return null values for derived fields when the pivot is not selected', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, null, {skipCache: true}).returns(q.when(mockDerivedFieldsWithNullValue));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL').then(function (data) {
				expect(data.__self__).to.equal('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL');
				expect(data.urn).to.equal('urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL');
				expect(data.sections[0].fields[0].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_CUSTOM_PL');
				expect(data.sections[0].fields[0].value).to.be.null;
				expect(data.sections[0].fields[1].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_WORKSPACE_PL');
				expect(data.sections[0].fields[1].value).to.be.null;
				expect(data.sections[0].fields[2].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_BOM_UOM');
				expect(data.sections[0].fields[2].value).to.be.null;
				expect(data.sections[0].fields[3].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_DATE');
				expect(data.sections[0].fields[3].value).to.be.null;
				expect(data.sections[1].fields[0].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_TITLE');
				expect(data.sections[1].fields[0].value).to.be.null;
				expect(data.sections[1].fields[1].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_CREATED_ON');
				expect(data.sections[1].fields[1].value).to.be.null;
			});

			timeout.flush();
		});

		it('should have a link to custom PL option when the pivot is selected', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, {pivotItemId: 3579}, {skipCache: true}).returns(q.when(mockDerivedFieldsWithValue));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', 3579).then(function (data) {
				expect(data.__self__).to.equal('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL');
				expect(data.urn).to.equal('urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL');
				expect(data.sections[0].fields[0].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_CUSTOM_PL');
				expect(data.sections[0].fields[0].value.link).to.equal('/api/v3/lookups/CUSTOM_LOOKUP_ALL_USERS_VIEW/options/224');
			});

			timeout.flush();
		});

		it('should have a link to workspace item when the pivot is selected', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, {pivotItemId: 3579}, {skipCache: true}).returns(q.when(mockDerivedFieldsWithValue));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', 3579).then(function (data) {
				expect(data.__self__).to.equal('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL');
				expect(data.urn).to.equal('urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL');
				expect(data.sections[0].fields[1].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_WORKSPACE_PL');
				expect(data.sections[0].fields[1].value.link).to.equal('/api/v3/workspaces/9/items/4852');
			});

			timeout.flush();
		});

		it('should have a link to a BOM UOM option when the pivot is selected', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, {pivotItemId: 3579}, {skipCache: true}).returns(q.when(mockDerivedFieldsWithValue));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', 3579).then(function (data) {
				expect(data.__self__).to.equal('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL');
				expect(data.urn).to.equal('urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL');
				expect(data.sections[0].fields[2].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_BOM_UOM');
				expect(data.sections[0].fields[2].value.link).to.equal('/api/v3/lookups/BOM-UOM/options/6');
			});

			timeout.flush();
		});

		it('should have a date value when the pivot is selected', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, {pivotItemId: 3579}, {skipCache: true}).returns(q.when(mockDerivedFieldsWithValue));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', 3579).then(function (data) {
				expect(data.__self__).to.equal('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL');
				expect(data.urn).to.equal('urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL');
				expect(data.sections[0].fields[3].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_DATE');
				expect(data.sections[0].fields[3].value).to.equal('2016-06-30');
			});

			timeout.flush();
		});

		it('should have a descriptor value when the pivot is selected', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, {pivotItemId: 3579}, {skipCache: true}).returns(q.when(mockDerivedFieldsWithValue));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', 3579).then(function (data) {
				expect(data.__self__).to.equal('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL');
				expect(data.urn).to.equal('urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL');
				expect(data.sections[1].fields[0].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_TITLE');
				expect(data.sections[1].fields[0].value).to.equal('My ECN 01');
			});

			timeout.flush();
		});

		it('should have a created on date value when the pivot is selected', function () {
			Workspace.prototype.RESTWrapperService.get.withArgs('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', null, {pivotItemId: 3579}, {skipCache: true}).returns(q.when(mockDerivedFieldsWithValue));

			app.getPicklistPivotValues('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL', 3579).then(function (data) {
				expect(data.__self__).to.equal('/api/v3/workspaces/71/views/1/pivots/PIVOT_PL');
				expect(data.urn).to.equal('urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL');
				expect(data.sections[1].fields[1].__self__).to.equal('/api/v3/workspaces/71/views/1/fields/DERIVED_CREATED_ON');
				expect(data.sections[1].fields[1].value).to.equal('2016-06-30');
			});

			timeout.flush();
		});
	});

	describe('getViewDetailsFieldsData', function () {
		it('should fetch field details for new item', function () {
			var called = false;

			app.json.sectionsMeta = [{
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

			Workspace.prototype.RESTWrapperService.get.returns({
				type: 'link to fetch type meta data',
				validators: 'link to fetch validator meta data'
			});

			app.getViewDetailsFieldsData().then(function (fieldsData) {
				var fields = underscore.flatten(underscore.pluck(fieldsData, 'fields'));
				expect(fields).to.have.length(1);
			});

			timeout.flush();
		});

		it('should call rest put with formatted data for new item with filter', function () {
			var called = false;

			app.json.sectionsMeta = [{
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

			Workspace.prototype.RESTWrapperService.get.returns({
				type: 'link to fetch type meta data',
				validators: 'link to fetch validator meta data'
			});

			app.getViewDetailsFieldsData().then(function (fieldsData) {
				var fields = underscore.flatten(underscore.pluck(fieldsData, 'fields'));
				expect(fields).to.have.length(1);
			});

			timeout.flush();

			app.getViewDetailsFieldsData(function (field) {
				return false;
			}).then(function (fieldsData) {
				var fields = underscore.flatten(underscore.pluck(fieldsData, 'fields'));
				expect(fields).to.have.length(0);
			});

			timeout.flush();
		});
	});

	describe('addValidationRules', function () {
		it('should add validation rules to field', function () {
			app.json.sectionsMeta = [{
				definition: {
					fields: [{
						fieldMetadata: {
							validators: '/api/v3/workspaces/8/views/1/fields/MONEY/validators'
						}
					}]
				}
			}];
			var mockValidationRule = [{
				__self__: '/api/v3/workspaces/8/views/1/fields/MONEY/validators/929',
				urn: '',
				validatorName: 'required',
				variables: {}
			}];
			var sectionFields = app.json.sectionsMeta[0].definition.fields;
			Workspace.prototype.RESTWrapperService.get.withArgs('api/v3/workspaces/8/views/1/fields/MONEY/validators', null, null, {}).returns(q.when(mockValidationRule));
			app.addValidationRules(sectionFields[0]);
			timeout.flush();
			expect(sectionFields[0].fieldMetadata.validationRules).to.exist;
		});
	});
});
