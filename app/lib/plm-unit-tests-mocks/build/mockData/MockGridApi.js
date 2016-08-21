'use strict';

angular.module('plm360.mockObjects').factory('MockGridApiObj', function () {
	return function () {
		return sinon.stub({
			colMovable: {},
			colResizable: {},
			core: {
				on: {
					rowsRendered: function () {}
				}
			},
			grid: {
				renderContainers: {
					body: {
						visibleRowCache:[]
					}
				}
			},
			listeners: {},
			selection: {},
			treeView: {

			}
		});
	};
});
