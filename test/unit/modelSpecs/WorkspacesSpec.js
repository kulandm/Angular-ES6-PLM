'use strict';

describe('Workspaces', function () {
	var app;
	var workspacesData = [{
		id: 1,
		displayName: 'name'
	}, {
		id: 2,
		displayName: 'a name'
	}];
	var data = {
		id: 1,
		name: 'name',
		sections: [{
			iconResourceUrl: '/wicon7_24.png',
			workspaces: workspacesData
		}]
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new Workspaces();
		app.json = data;
		angular.forEach(app.json.sections, function (section) {
			section.iconResourceUrl = app.getIcon(section);
			angular.forEach(section.workspaces, function (workspace) {
				workspace.link = 'api/v2/workspaces/' + workspace.id;
			});
		});
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});

	describe('getIcon', function () {
		it('should return the icon name based on map', function () {
			expect(app.getIcon({
				iconResourceUrl: '/wicon6_24.png'
			})).to.equal('icon-plm-safe_gear');
		});
		it('should return default icon name if original resource url is not found in map', function () {
			expect(app.getIcon({
				iconResourceUrl: '/notFound'
			})).to.equal('icon-plm-Cube');
		});
	});

	describe('getSectionIcon',function () {
		it('should return the icon name given workspace id', function () {
			expect(app.getSectionIcon(1)).to.equal('icon-plm-stamp');
		});
	});

	describe('getSimpleList',function () {
		it('should return the list of all workspaces sorted by display name', function () {
			var attr = 'displayName';
			expect(app.getSimpleList(attr)[0].displayName).to.equal(workspacesData.sort(function (a, b) {
				return a[attr] > b[attr];
			})[0].displayName);
		});
		it('should return the list of all workspaces unsorted', function () {
			expect(app.getSimpleList()[0].displayName).to.equal(workspacesData[0].displayName);
		});
	});

	describe('getWorkspaceLink',function () {
		it('should return the link given valid workspace id', function () {
			var link = '';
			angular.forEach(workspacesData, function (workspace) {
				if (workspace.id === 1) {
					link = workspace.link;
				}
			});
			expect(app.getWorkspaceLink(1)).to.equal(link);
		});
		it('should return empty string given invalid workspace id', function () {
			expect(app.getWorkspaceLink(3)).to.equal(undefined);
		});
	});
});
