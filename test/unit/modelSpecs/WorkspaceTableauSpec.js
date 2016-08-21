'use strict';

describe('Workspace Tableau ', function () {

	let underscore, timeout, aWorkspaceTableau, WorkspaceTableau, mockRestService, mockAll, mockAvaible, mockVisible, getAll,getVisible,getAvaible;

	beforeEach(module('plm360', 'plm360.mockData', 'plm360.mockObjects', ($provide) => {
		$provide.value('RESTWrapperService', {});
	}));

	beforeEach(function () {
		inject(function (_,
			$q,
			$timeout,
			$httpBackend,
			$injector,
			MockRESTWrapperService,
			WORKSPACE_TABLEAU_TYPES,
			MockWorkspacesTableauAllData,
			MockWorkspacesTableauAvaibleColumnsData,
			MockWorkspacesTableauVisibleColumnsData) {
			underscore = _;
			timeout = $timeout;
			WorkspaceTableau = $injector.get('WorkspaceTableau');
			mockRestService = new MockRESTWrapperService();
			WorkspaceTableau.prototype.RESTWrapperService = mockRestService;
			WorkspaceTableau.prototype.WORKSPACE_TABLEAU_TYPES = {DEFAULT: 'DEFAULT'};
			WorkspaceTableau.prototype.$q = $q;
			WorkspaceTableau.prototype._ = _;
			aWorkspaceTableau = new WorkspaceTableau();

			// mocks
			mockAll = MockWorkspacesTableauAllData;
			mockVisible = MockWorkspacesTableauVisibleColumnsData;
			mockAvaible = MockWorkspacesTableauAvaibleColumnsData;

			// promises
			getAll = $q.defer();
			getVisible = $q.defer();
			getAvaible = $q.defer();

			mockRestService.get.withArgs('api/v3/workspaces/47/tableaus', null, null, {skipCache:true},{ACCEPT: 'application/json'}).returns(getAll.promise);
			mockRestService.get.withArgs('api/v3/workspaces/47/tableaus/91', null, null, {skipCache:true},{ACCEPT: 'application/vnd.autodesk.plm.meta+json'}).returns(getVisible.promise);
			mockRestService.get.withArgs('api/v3/workspaces/47/tableaus', null, null, {skipCache:true},{ACCEPT: 'application/vnd.autodesk.plm.meta+json'}).returns(getAvaible.promise);

			$timeout(function () {
				getAll.resolve(angular.copy(mockAll));
				getVisible.resolve(angular.copy(mockVisible));
				getAvaible.resolve(angular.copy(mockAvaible));
			},100);
		});
	});

	describe('[WorkspaceTableau]',function () {
		it('shoud return all tableaus in a workspace',function () {
			expect(aWorkspaceTableau.getWorkspaceTableausAllDefinitions).to.not.be.undefined;

			aWorkspaceTableau.getWorkspaceTableausAllDefinitions('api/v3/workspaces/47/tableaus').then(function (data) {
				expect(data).to.deep.equal(mockAll);
			});
			timeout.flush();
		});

		it('shoud return all visible columns in a workspace',function () {
			expect(aWorkspaceTableau.getWorkspaceTableauDefinition).to.not.be.undefined;

			aWorkspaceTableau.getWorkspaceTableauDefinition('api/v3/workspaces/47/tableaus/91').then(function (data) {
				expect(data).to.deep.equal(mockVisible);
			});
			timeout.flush();
		});

		it('shoud return all avaible columns in a workspace',function () {
			expect(aWorkspaceTableau.getWorkspaceTableausAllGroups).to.not.be.undefined;

			aWorkspaceTableau.getWorkspaceTableausAllGroups('api/v3/workspaces/47/tableaus').then(function (data) {
				expect(data).to.deep.equal(mockAvaible);
			});
			timeout.flush();
		});

		it('shoud return an object of columns ',function () {
			expect(aWorkspaceTableau.getTableau).to.not.be.undefined;

			aWorkspaceTableau.getTableau('api/v3/workspaces/47/tableaus', 91).then(function (data) {

				expect(data).to.be.an('object');
				expect(data.ATTACHMENT_FIELD).to.have.property('name').to.equal('Attachments');
				expect(data.ATTACHMENT_FIELD).to.have.property('collapsed').to.be.false;
				expect(data.ATTACHMENT_FIELD).to.have.property('fields').to.be.an('array');
				expect(data.ATTACHMENT_FIELD.fields[0]).to.have.property('visible').to.be.false;

				expect(data.ITEM_DESCRIPTOR_FIELD).to.have.property('name').to.equal('Item Descriptor');
				expect(data.ITEM_DESCRIPTOR_FIELD).to.have.property('collapsed').to.be.false;
				expect(data.ITEM_DESCRIPTOR_FIELD).to.have.property('fields').to.be.an('array');
				expect(data.ITEM_DESCRIPTOR_FIELD.fields[0]).to.have.property('visible').to.be.true;
			});

			timeout.flush();
		});

		it('shoud return an array of columns ',function () {
			expect(aWorkspaceTableau.fetchAllWorkspaceTableau).to.not.be.undefined;

			aWorkspaceTableau.fetchAllWorkspaceTableau('api/v3/workspaces/47/tableaus').then(function (data) {
				expect(data).to.be.an('array');
				var tableau = data.shift();
				expect(tableau).to.be.an('object');
				expect(tableau).to.be.an('object').to.have.property('title');
			});

			timeout.flush();
		});
	});
});
