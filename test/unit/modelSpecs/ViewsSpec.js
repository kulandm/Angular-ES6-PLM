'use strict';

describe('Views', function () {
	var app;
	var mockData;

	beforeEach(module('plm360.models', 'plm360.mockData'));

	beforeEach(function () {
		inject(function (MockWorkspaceSlicesData) {
			mockData = MockWorkspaceSlicesData;
			app = new Views();
			app.json = mockData.json;
		});

		if (angular.isDefined(app.json) && angular.isDefined(app.json.items)) {
			angular.forEach(app.json.items, function (view) {
				var viewId = view.link.substring(view.link.lastIndexOf('/') + 1);
				view.link = 'api/v3/workspaces/[workspaceId]/slices/' + viewId;
			});
		}
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(mockData.json.items);
		});
		it('should return empty array if no list data', function () {
			var emptyApp = new Views();
			emptyApp.json = [];
			expect(emptyApp.getFullList()).to.deep.equal([]);
		});
	});

	describe('getDefaultViewId', function () {
		it('should return the id of the default view', function () {
			var viewId = parseInt(mockData.json.items[0].link.substring(mockData.json.items[0].link.lastIndexOf('/') + 1));
			expect(app.getDefaultViewId()).to.equal(viewId);
		});
		it('should return the id of the first view if no default specified', function () {
			var newApp = new Views();
			newApp.json = {
				id: 1,
				name: 'name',
				items: [{
					link: '/api/v3/workspaces/47/reports/91',
					title: 'My Default View',
					urn: 'urn:adsk.plm:tenant.workspace.report:DEVINDMACHINE1001.47.91',
					permissions: []
				}, {
					link: '/api/v3/workspaces/47/reports/97',
					title: 'Images',
					urn: 'urn:adsk.plm:tenant.workspace.report:DEVINDMACHINE1001.47.97',
					permissions: []
				}]
			};
			if (angular.isDefined(newApp.json) && angular.isDefined(newApp.json.items)) {
				angular.forEach(newApp.json.items, function (view) {
					var viewId = view.link.substring(view.link.lastIndexOf('/') + 1);
					view.link = 'api/v3/workspaces/[workspaceId]/slices/' + viewId;
				});
			}
			expect(newApp.getDefaultViewId()).to.equal(91);
		});
		it('should return empty object if no list data', function () {
			var emptyApp = new Views({});
			expect(emptyApp.getDefaultViewId()).to.deep.equal({});
		});
	});

	describe('getViewLink', function () {
		it('should return the link of the view if valid id', function () {
			expect(app.getViewLink(91)).to.equal(mockData.json.items[0].link);
		});
		it('should return empty string if invalid id', function () {
			expect(app.getViewLink(13243)).to.equal('');
		});
		it('should return empty object if no list data', function () {
			var emptyApp = new Views({});
			expect(emptyApp.getViewLink()).to.equal('');
		});
		it('should return the link of the view even if the id is a string', function () {
			expect(app.getViewLink('91')).to.equal(mockData.json.items[0].link);
		});
	});

	describe('getView', function () {
		it('should return the view object if valid id', function () {
			expect(app.getView(91)).to.deep.equal(mockData.json.items[0]);
		});
		it('should return empty object if invalid id', function () {
			expect(app.getView(123234)).to.deep.equal({});
		});
		it('should return empty object if no list data', function () {
			var emptyApp = new Views({});
			expect(emptyApp.getView(1)).to.deep.equal({});
		});
	});
});
